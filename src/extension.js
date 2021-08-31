const vscode = require('vscode');
const Conventer = require('./pharConventer');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	var convs = ["createPharFromFolder", "createPharFromZip", "extractPharToFolder", "extractPharToZip"];
	var cmds = convs.map((conv) => {
		return vscode.commands.registerCommand("phartools."+conv, (uri) => {
			if (uri instanceof vscode.Uri) {
				Conventer[conv](uri.fsPath);
			}
		});
	});
	context.subscriptions.push(...cmds);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
