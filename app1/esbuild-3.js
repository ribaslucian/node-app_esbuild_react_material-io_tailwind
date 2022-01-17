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


    // chokidar.watch("app/**/*.{jsx, scss}", {
    chokidar.watch("app/MUIButton.jsx", {
        interval: 0,
    }).on("all", (e, m) => {
        console.log(e, m)
        console.log('--')
        console.log('Bulding...')

        // Writing string data
        clients.forEach(function (res) {
            res.write("Heyy geeksforgeeks ", 'utf8', () => {
                console.log("Writing string Data...");
            });

            // Prints Output on the browser in response
            // res.end(' ok');
        })

        

        execSync('npm run build:js:reload')

        clients.forEach((res) => res.write('data: build:end\n\n'))
        clients.length = 0
        // execSync("npm run build:sass")

        // document.getElementById("building-status").style.display = "none";

        console.log('Bulding Ok')
        console.log('--')
    })

})()