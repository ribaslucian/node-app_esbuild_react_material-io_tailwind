const chokidar = require("chokidar");


/**
 * Console log.
 * @param {string} str 
 */
function l(str) {
    console.log(str);
}


(async () => {


    /**
     * Listening to files for building on events.
     */
    chokidar.watch("app/**/*.{css,scss,js,jsx}", {
        interval: 0,
        ignoreInitial: true
    }).on("all", (event, fileRelativePath, op) => {

        // l(event);
        l(fileRelativePath);
        // l(op);
        // l('---');

    })

})()