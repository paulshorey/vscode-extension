import * as vscode from 'vscode';
// console.log('registered command "convertcode.selectedToUpperCase"');

export default async () => {
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
