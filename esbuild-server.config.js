const { build } = require("esbuild")
const chokidar = require("chokidar")
const liveServer = require("live-server");
const {execSync} = require('child_process');

(async () => {
    // `esbuild` bundler for JavaScript / TypeScript.
    const builder = await build({
        // Bundles JavaScript.
        bundle: true,
        // Defines env variables for bundled JavaScript; here `process.env.NODE_ENV`
        // is propagated with a fallback.
        define: { "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development") },
        // Bundles JavaScript from (see `outfile`).
        entryPoints: ["app/app.jsx"],
        // Uses incremental compilation (see `chokidar.on`).
        incremental: true,
        // Removes whitespace, etc. depending on `NODE_ENV=...`.
        minify: process.env.NODE_ENV === "production",
        // Bundles JavaScript to (see `entryPoints`).
        outfile: "dist/app.js",
    })
    // `chokidar` watcher source changes.
    chokidar
        // Watches TypeScript and React TypeScript.
        .watch("app/**/*.{js,jsx,scss,css}", {
            interval: 0, // No delay
        })
        // Rebuilds esbuild (incrementally -- see `build.incremental`).
        .on("all", () => {
            
            execSync("npm run build:sass")
            builder.rebuild()
        })
    // `liveServer` local server for hot reload.
    // para funcionar no windows-10/ubuntu rode: $ export PATH=$PATH:/mnt/c/Windows/System32
    liveServer.start({
        // Opens the local server on start.
        // open: true,
        // Uses `PORT=...` or 8080 as a fallback.
        port: +process.env.PORT || 8080,
        // Uses `public` as the local server folder.
        root: "dist",
        // export PATH=$PATH:/mnt/c/Windows/System32
    })
})()