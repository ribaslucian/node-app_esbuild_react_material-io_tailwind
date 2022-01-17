const esbuild = require("esbuild");
const sassPlugin = require("esbuild-plugin-sass");

esbuild
    .build({
        entryPoints: ["src/app.jxs"],
        bundle: true,
        outfile: "bundle.js",
        plugins: [sassPlugin()],
    })
    .catch((e) => console.error(e.message));