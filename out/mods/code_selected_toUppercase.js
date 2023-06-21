"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
// console.log('registered command "convertcode.selectedToUpperCase"');
exports.default = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const selectedText = editor.document.getText(editor.selection);
    const transformedText = selectedText.toUpperCase();
    await editor.edit((editBuilder) => {
        editBuilder.replace(editor.selection, transformedText);
    });
};
//# sourceMappingURL=code_selected_toUppercase.js.map