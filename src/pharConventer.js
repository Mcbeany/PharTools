const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const Phar = require('phar');

/**
 * @param {string} folder
 */
function createPharFromFolder(folder) {
    let zip = new JSZip();
    readdirCompletely(folder).forEach(file => {
        zip.file(file.substr(folder.length + path.sep.length), fs.readFileSync(file));
    });
    zip.generateAsync({type: 'uint8array'}).then(data => {
        Phar.ZipConverter.toPhar(data).then(phar => {
            let dir = getNewDir(folder, ".phar");
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
        let dir = getNewDir(file, ".phar");
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
        let dir = getNewDir(file, "");
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
            let dir = getNewDir(file, ".zip");
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
    let dir = name + ext;
    let copyOf = 0; // var
    while (true) {
        if (copyOf != 0) {
            dir = name + " (" + copyOf.toString() + ")" + ext
        }
        if (!fs.existsSync(dir) || (fs.lstatSync(dir).isDirectory() && fs.readdirSync(dir).length == 0)) {
            break;
        }
        copyOf++;
    }
    return dir;
}
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
    createPharFromFolder,
    createPharFromZip,
    extractPharToFolder,
    extractPharToZip
}