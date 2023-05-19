"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function selectedToUpperCase(text) {
    return text.toUpperCase();
}
// The commandId parameter must match the command field in package.json
function activate(context) {
    {
        let disposable = vscode.commands.registerCommand("convertcode.selectedToUpperCase", async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }
            const selectedText = editor.document.getText(editor.selection);
            const transformedText = selectedToUpperCase(selectedText);
            await editor.edit((editBuilder) => {
                editBuilder.replace(editor.selection, transformedText);
            });
        });
        context.subscriptions.push(disposable);
    }
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map