#!/usr/bin/env node

const path = require('path')
const chokidar = require('chokidar')
const http = require('http')

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
    outfile: 'dist/app.js',
    // outdir: path.join(process.cwd(), "dist/"),
    // absWorkingDir: path.join(process.cwd(), "app/"),
    incremental: true,
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
    // if (path.includes("javascript")) {
      result.rebuild()
    // }
    clients.forEach((res) => res.write('data: update\n\n'))
    clients.length = 0
    // console.log('ok')
  });
}
builder()