const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const Phar = require('phar');

const Util = require('./util');

module.exports = {

    indexFiles() {
        const workingDir = vscode.workspace.rootPath;
        var files = Util.readdirCompletely(workingDir).filter(name => path.basename(name) == Util.PHAR);
        files.forEach(name => {
            if (fs.existsSync(name)) {
                var phar = new Phar.Archive();
                phar.loadPharData(fs.readFileSync(name));
                var contents = phar.getFiles();
            }
        });
    }
}