const fs = require('fs');
const path = require('path');

/**
 * @param {string} folder
 * @return {string[]}
 */
function readdirCompletely(folder) {
    let files = [];
    fs.readdirSync(folder).forEach(file => {
        let dir = path.join(folder, file);
        if (fs.lstatSync(dir).isFile()) {
            files.push(dir);
        } else {
            files.push(...readdirCompletely(dir));
        }
    });
    return files;
}

module.exports = {
    PHAR: ".phar",
    ZIP: ".zip",
    FOLDER: "",
    PHP: ".php",
    PHP_MODE: {language: 'php', scheme: 'file'},
    readdirCompletely
}