const { build } = require("esbuild");

(async () => {
    const builder = await build({
        bundle: true,
        entryPoints: ["app/app.jsx"],
        // incremental: true,
        minify: true,
        outfile: "dist/app.js",
        banner: {
            // js: "(() => new EventSource('http://localhost:8082').onmessage = () => location.reload())();",
            js: "(() => new EventSource('http://localhost:8082').onmessage = (m) => console.log(m))();",
        },
    })

    console.log('build:js:reload: ok')
})()