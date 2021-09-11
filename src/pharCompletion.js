const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const Phar = require('phar');

const Util = require('./util');

const NORMAL = 0;
const ABSTRACT = 1;
const INTERFACE = 2;
const FINAL = 3;
const TRAIT = 4;

class PhpClass {
    /**
     * @param {string} name 
     * @param {string} namespace
     * @param {number} type
     */
    constructor(name, namespace, type) {
        this.name = name;
        this.namespace = namespace;
        this.type = type;
    }
}

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