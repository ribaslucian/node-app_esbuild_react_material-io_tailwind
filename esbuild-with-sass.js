// const sassPlugin = require('esbuild-plugin-sass');


/**
 * Building JSX to JS app.
 */
// const esbuild = require('esbuild');
// esbuild.build({
//     entryPoints: ['app/app.jsx'],
//     bundle: true,
//     minify: true,
//     outfile: 'dist/app.min.js',
//     // plugins: [sassPlugin()]
// })


/**
 * Building JSX to JS app.
 */
// const tailwind = require('tailwindcss');
// tailwind.build({
//     entryPoints: ['./app/app.tail.css'],
//     // bundle: true,
//     minify: true,
//     outfile: './dist/app.tail.css'
// })

const {execSync} = require('child_process')

execSync("npm run build")
// execSync("npm run minify")
// execSync("npm run build_assets")