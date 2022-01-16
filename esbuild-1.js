// const { build } = require("esbuild")
const es = require("esbuild")
const chokidar = require("chokidar")
const http = require("http")
const { execSync } = require('child_process');


clients = []
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


(async () => {

    let examplePlugin = {
        name: 'example',
        setup(build) {
            build.onEnd(result => {
                console.log(`build ended with ${result.errors.length} errors`)
                
                clients.forEach((res) => res.write('data: update\n\n'))
            })
        },
    }


    let builder = await es.build({
        bundle: true,
        entryPoints: ["app/app.jsx"],
        incremental: true,
        minify: true,
        outfile: "dist/app.js",
        banner: {
            js: "(() => new EventSource('http://localhost:8082').onmessage = () => location.reload())();",
        },
        plugins: [examplePlugin],
    })



    chokidar.watch("app/**/*.{js,jsx,scss,css}", {
        interval: 0,
    }).on("all", () => {
        console.log('--')
        console.log('Bulding...')

        // execSync("npm run build:sass")
        builder.rebuild()
        // clients.forEach((res) => res.write('data: update\n\n'))
        // clients.length = 0

        console.log('Bulding Ok')
        console.log('--')
    })

})()