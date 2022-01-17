const chokidar = require("chokidar");
const http = require("http");
const execSync = require("child_process").execSync;
var momentsLastBuildings = {};


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
    fileName = fileName.split('.');
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


(async () => {


    /**
     * Listening to files for building on events.
     */
    chokidar.watch("app/**/*.{css,scss,js,jsx}", {
        interval: 0,
    }).on("change", (event, fileRelativePath) => {
        let extension = getExtensionByFileName(fileRelativePath);

        // building tailwind styles as 'styles:tail'.
        if (fileRelativePath.includes('tail')) {
            if (!isRecentBuildingAndRefreshMoment('styles:tailwind')) {
                l('building: styles:tail as:' + fileRelativePath);
                execSync('npm run build:tail')
            } else
                l('RECENT_SKIP: building: styles:tail as:' + fileRelativePath);
        }

        // building other styles as 'styles'.
        else if (['css', 'scss'].includes(extension)) {
            if (!isRecentBuildingAndRefreshMoment('styles:sass')) {
                l('building: styles:sass as:' + fileRelativePath);
                execSync('npm run build:sass')
            } else
                l('RECENT_SKIP: building: styles:sass as:' + fileRelativePath);
        }

        // building JS as 'js'.
        else if (['js', 'jsx'].includes(extension)) {
            if (!isRecentBuildingAndRefreshMoment('js:esbuild')) {
                l('building: js:esbuild as:' + fileRelativePath);
                execSync('npm run build:js')
            } else
                l('RECENT_SKIP: building: js:esbuild as:' + fileRelativePath);
        }

    })

})()