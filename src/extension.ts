import * as vscode from "vscode";

function selectedToUpperCase(text: string): string {
  return text.toUpperCase();
}

// The commandId parameter must match the command field in package.json
export function activate(context: vscode.ExtensionContext) {
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

// This method is called when your extension is deactivated
export function deactivate() {}
