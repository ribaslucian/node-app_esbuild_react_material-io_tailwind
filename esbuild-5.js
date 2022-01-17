const chokidar = require("chokidar");
const http = require("http");
const execSync = require("child_process").execSync;
const momentsLastBuildings = {};
const { build } = require("esbuild");


/**
 * Create a serve to notify refresh.
 */
clients = [];
http.createServer((req, res) => {
    return clients.push(
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Origin": "*",
            Connection: "keep-alive",
        }),
    );
}).listen(8082);


/**
 * Get de extension on file name.
 * @param {string} fileName 
 * @returns {string}
 */
function getExtensionByFileName(fileName) {
    fileName = (fileName + '').split('.');
    return fileName[Object.keys(fileName).length - 1];
}

/**
 * Console log.
 * @param {string} str 
 */
function l(str) {
    console.log(str);
}

/**
 * This will check if the last build was very
 * recent (> referenceSeconds), and if not,
 * it will already update the last build date.
 * 
 * @param {string} buildingType 
 * @returns boolean
 */
function isRecentBuildingAndRefreshMoment(buildingType) {
    // initialize buildingType key if not exists
    if (!Object.keys(momentsLastBuildings).includes(buildingType)) {
        momentsLastBuildings[buildingType] = new Date();
        return false;
    }

    var referenceSeconds = 1;
    var secondsDiff = (((new Date()) - momentsLastBuildings[buildingType]) / 1000);
    // l('date diff: ' + secondsDiff);
    if (secondsDiff < 1)
        return true;

    momentsLastBuildings[buildingType] = new Date();
    return false;
}

/**
 * Notify clients to refresh pages.
 */
function refreshClients() {
    // l('<refresh:clients>')
    clients.forEach((res) => res.write('data: update\n\n'))
    clients.length = 0
}

async function buildJsEsbuild() {
    l('build:js:esbuild> start')

    const builder = await build({
        bundle: true,
        entryPoints: ["app/app.jsx"],
        // incremental: true,
        minify: true,
        outfile: "dist/app.js",
        banner: {
            js: "(() => new EventSource('http://localhost:8082').onmessage = () => location.reload())();",
            // js: "(() => new EventSource('http://localhost:8082').onmessage = (m) => console.log(m))();",
        },
    })

    l('build:js:esbuild> end')
}

function buildStyleSass() {
    l('build:style:sass> start')
    execSync('npx sass app/app.scss dist/app.css --load-path node_modules/ --style compressed');
    l('build:style:sass> end')
}

function buildStyleTail() {
    l('build:style:tail> start')
    execSync('npx tailwindcss -i ./app/app.tail.css -o ./dist/app.tail.css --minify');
    l('build:style:tail> end')
}


(async () => {


    /**
     * Listening to files for building on events.
     */
    chokidar.watch("app/**/*.{css,scss,js,jsx}", {
        interval: 0,
    }).on("change", (fileRelativePath) => {
        var extension = getExtensionByFileName(fileRelativePath);

        // building tailwind styles as 'build:styles:tail'.
        if (fileRelativePath.includes('tail')) {
            buildStyleTail();
            refreshClients();
        }

        // building other styles as 'build:styles:sass'.
        else if (['css', 'scss'].includes(extension)) {
            buildStyleSass();
            refreshClients();
        }

        // building JS as 'build:js:esbuild'.
        else if (['js', 'jsx'].includes(extension)) {
            buildJsEsbuild();
            refreshClients();
        }
    })

})()