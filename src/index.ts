import * as vscode from 'vscode';
import code_autocomplete_chakra from './mods/code_autocomplete_chakra';
import explorer_create_reactComponent from './mods/explorer_create_reactComponent';
import code_selected_toUppercase from './mods/code_selected_toUppercase';
import selected_sxToChakra from './mods/code_selected_sxToChakra';

// The commandId parameter must match the command field in package.json
export function activate(context: vscode.ExtensionContext) {
  {
    /*
     * convert to UPPERCASE
     */
    let disposable = vscode.commands.registerCommand(
      'convertcode.selectedToUpperCase',
      code_selected_toUppercase
    );
    context.subscriptions.push(disposable);
  }
  {
    /*
     * convert Chakra <-> SX
     */
    let disposable = vscode.commands.registerCommand(
      'convertcode.selected_sxToChakra',
      selected_sxToChakra
    );
    context.subscriptions.push(disposable);
  }
  {
    /*
     * create React component
     */
    let disposable = vscode.commands.registerCommand(
      'convertcode.createReactComponent',
      explorer_create_reactComponent
    );
    context.subscriptions.push(disposable);
  }
  {
    /*
     * autocomplete
     */
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(code_autocomplete_chakra)
    );
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
