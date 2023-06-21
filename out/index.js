"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const code_autocomplete_chakra_1 = require("./mods/code_autocomplete_chakra");
const explorer_create_reactComponent_1 = require("./mods/explorer_create_reactComponent");
const code_selected_toUppercase_1 = require("./mods/code_selected_toUppercase");
const code_selected_sxToChakra_1 = require("./mods/code_selected_sxToChakra");
// The commandId parameter must match the command field in package.json
function activate(context) {
    {
        /*
         * convert to UPPERCASE
         */
        let disposable = vscode.commands.registerCommand('convertcode.selectedToUpperCase', code_selected_toUppercase_1.default);
        context.subscriptions.push(disposable);
    }
    {
        /*
         * convert Chakra <-> SX
         */
        let disposable = vscode.commands.registerCommand('convertcode.selected_sxToChakra', code_selected_sxToChakra_1.default);
        context.subscriptions.push(disposable);
    }
    {
        /*
         * create React component
         */
        let disposable = vscode.commands.registerCommand('convertcode.createReactComponent', explorer_create_reactComponent_1.default);
        context.subscriptions.push(disposable);
    }
    {
        /*
         * autocomplete
         */
        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(code_autocomplete_chakra_1.default));
    }
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map