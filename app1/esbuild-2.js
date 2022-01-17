const chokidar = require("chokidar")
const http = require("http")
const execSync = require("child_process").execSync;


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
    

    chokidar.watch("app/**/*.{js,jsx,scss,css}", {
        interval: 0,
    }).on("all", () => {
        console.log('--')
        console.log('Bulding...')

        // execSync("npm run build:sass")
        execSync('npm run build:js:reload')
        clients.forEach((res) => res.write('data: update\n\n'))
        clients.length = 0
        // execSync("npm run build:sass")

        console.log('Bulding Ok')
        console.log('--')
    })

})()