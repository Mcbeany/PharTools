const vscode = require('vscode');

const Conventer = require('./pharConventer');
const Completion = require('./pharCompletion');
const Util = require('./util');
exports.currentPath = "";

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

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(Util.PHP_MODE, {
		provideCompletionItems(document, position, token) {
			var suggestions = [];
			return suggestions;
		}
	}));
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
