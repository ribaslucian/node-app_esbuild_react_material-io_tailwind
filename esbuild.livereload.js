const http = require('http')
// const esbuild = require('esbuild');
const chokidar = require('chokidar');


const clients = []
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


async function builder() {
  let result = await require("esbuild").build({
    entryPoints: ['app/app.jsx'],
    bundle: true,
    minify: true,
    incremental: true,
    outfile: 'dist/app.js',
    banner: {
      js: ' (() => new EventSource("http://localhost:8082").onmessage = () => location.reload())();',
    },
  })

  chokidar.watch([
    "./app/**/*.js",
    "./app/**/*.jsx",
    "./app/**/*.html",
    "./app/**/*.scss"
  ]).on('all', (event, path) => {
    // console.log('----');
    // console.log(event);
    // console.log(path);
    // console.log(result);

    if (event == 'change') {
      result.rebuild()
    }

    clients.forEach((res) => res.write('data: update\n\n'))
    clients.length = 0
  });
}
builder()