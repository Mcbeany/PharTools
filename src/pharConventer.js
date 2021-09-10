const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const Phar = require('phar');

const Util = require('./util');

/**
 * @param {string} folder
 */
function createPharFromFolder(folder) {
    let zip = new JSZip();
    Util.readdirCompletely(folder).forEach(file => {
        zip.file(file.substr(folder.length + path.sep.length), fs.readFileSync(file));
    });
    zip.generateAsync({type: 'uint8array'}).then(data => {
        Phar.ZipConverter.toPhar(data).then(phar => {
            let dir = getNewDir(folder, Util.ZIP);
            fs.writeFileSync(dir, phar.savePharData());
            vscode.window.showInformationMessage("Successfully created " + path.basename(dir));
        });
    });
}
/**
 * @param {string} file
 */
function createPharFromZip(file) {
    Phar.ZipConverter.toPhar(fs.readFileSync(file)).then(phar => {
        let dir = getNewDir(file, Util.PHAR);
        fs.writeFileSync(dir, phar.savePharData());
        vscode.window.showInformationMessage("Successfully created " + path.basename(dir));
    });
}
/**
 * @param {string} file 
 */
function extractPharToFolder(file) {
    let phar = new Phar.Archive();
    phar.loadPharData(fs.readFileSync(file));
    Phar.ZipConverter.toZip(phar).then(zip => {
        let dir = getNewDir(file, Util.FOLDER);
        fs.mkdirSync(dir);
        Object.keys(zip.files).forEach(name => {
            let filePath = path.join(dir, name);
            fs.mkdir(path.dirname(filePath), {recursive: true}, err => {
                if (err) {
                    return;
                }
                zip.files[name].async('uint8array').then(content => {
                    fs.writeFileSync(filePath, content);
                });
            });
        });
        vscode.window.showInformationMessage("Successfully extracted to " + path.basename(dir));
    });
}
/**
 * @param {string} file
 */
function extractPharToZip(file) {
    let phar = new Phar.Archive();
    phar.loadPharData(fs.readFileSync(file));
    Phar.ZipConverter.toZip(phar).then(data => {
        data.generateAsync({type: 'uint8array'}).then(zip => {
            let dir = getNewDir(file, Util.ZIP);
            fs.writeFileSync(dir, zip);
            vscode.window.showInformationMessage("Successfully extracted to " + path.basename(dir));
        });
    });
}

/**
 * @param {string} file 
 * @param {string} ext 
 * @returns {string}
 */
function getNewDir(file, ext) {
    let name = path.join(path.dirname(file), path.basename(file, path.extname(file)));
    let dir = name.concat(ext);
    let copyOf = 0; // var
    while (true) {
        if (copyOf != 0) {
            dir = name.concat(` (${copyOf})`, ext);
        }
        if (!fs.existsSync(dir) || (fs.lstatSync(dir).isDirectory() && fs.readdirSync(dir).length == 0)) {
            break;
        }
        copyOf++;
    }
    return dir;
}

module.exports = {
    createPharFromFolder,
    createPharFromZip,
    extractPharToFolder,
    extractPharToZip
}