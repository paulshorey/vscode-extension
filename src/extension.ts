import * as vscode from 'vscode';

console.log('Congratulations, your extension "convertcode" is now active!');

function selectedToUpperCase(text: string): string {
  return text.toUpperCase();
}

// The commandId parameter must match the command field in package.json
export function activate(context: vscode.ExtensionContext) {
  {
    console.log('registered command "convertcode.selectedToUpperCase"');
    /*
     * cc UPPERCASE
     */
    let disposable = vscode.commands.registerCommand(
      'convertcode.selectedToUpperCase',
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          return;
        }
        const selectedText = editor.document.getText(editor.selection);
        const transformedText = selectedToUpperCase(selectedText);
        await editor.edit((editBuilder) => {
          editBuilder.replace(editor.selection, transformedText);
        });
      }
    );
    context.subscriptions.push(disposable);
  }
  {
    /*
     * cc insert text on command
     */
    // let disposable = vscode.commands.registerCommand('extension.insertText', async () => {
    //   // The code to insert text at the cursor position goes here
    //   const editor = vscode.window.activeTextEditor;
    //   if (!editor) {
    //     vscode.window.showErrorMessage('No active editor found!');
    //     return;
    //   }
    //   const textToInsert = 'Your text here';
    //   const currentPosition = editor.selection.active;
    //   await editor.edit((editBuilder) => {
    //     editBuilder.insert(currentPosition, textToInsert);
    //   });
    // });
    // context.subscriptions.push(disposable);
  }
  {
    const str_autocomplete: Array<[string, string, string, string, number?]> = [
      // [str_trigger, str_match, str_add_before, str_add_after]
      // [
      //   '[n',
      //   `(?:\\s|^)([^\\s]+: ?\\[n)$`,
      //   '\n',
      //   'ull,null,null,null,null],\n',
      //   27,
      // ],
      [
        '={[',
        `(?:\\s|^)([^\\s]+={\\[)$`,
        '\n',
        'null,null,null,null,null]}\n',
        27,
      ],
      [
        '<Text ',
        `<Text $`,
        '',
        '\nas="p"\nfontSize={[null,null,null,null,null]}\nfontWeight={[null,null,null,null,null]}\nlineHeight={[null,null,null,null,null]}\nletterSpacing={[null,null,null,null,null]}\nmaxW={[null,null,null,null,null]}\n>\n</Text>\n',
        9,
      ],
      [
        '<Flex ',
        `<Flex $`,
        '',
        '\nflexDirection={[null,null,null,null,null]}\nalignItems={[null,null,null,null,null]}\njustifyContent={[null,null,null,null,null]}\nwidth="100%">\n</Flex>\n',
        9,
      ],
      [
        '<Grid ',
        `<Grid $`,
        '',
        '\ngridTemplateColumns={[null,null,null,null,null]}\ngridTemplateRows={[null,null,null,null,null]}\nwidth="100%"\n>\n</Grid>\n',
        9,
      ],
    ];
    console.log('registered command "convertcode.insertText"');
    /*
     * autocomplete
     */
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(async (event) => {
        if (event.contentChanges.length === 0) {
          return;
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          console.log('No active editor found!');
          return;
        }
        const lastChange =
          event.contentChanges[event.contentChanges.length - 1];
        if (!lastChange) {
          return;
        }
        const changeText = lastChange.text;
        const changeStartPosition = lastChange.range.start;
        const changeEndPosition = lastChange.range.end;
        const currentLine = changeStartPosition.line;
        const lineStartPosition =
          editor.document.lineAt(currentLine).range.start;
        let textBeforeTrigger = editor.document.getText(
          new vscode.Range(lineStartPosition, changeEndPosition)
        );
        textBeforeTrigger += changeText; // Add the new just-typed character
        /*
         * Replace each instance of trigger sequence with before/after text
         */
        for (const [
          str_trigger,
          str_match,
          str_add_before,
          str_add_after,
          str_go_back_length,
        ] of str_autocomplete) {
          console.log('textBeforeTrigger str_trigger', [
            textBeforeTrigger,
            str_trigger,
          ]);
          if (textBeforeTrigger.endsWith(str_trigger)) {
            // escape the trigger sequence for regex
            // const str_trigger_escape_regex = str_trigger.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
            // stop at the last non-whitespace sequence before the trigger sequence
            const regex = new RegExp(str_match);
            const match = regex.exec(textBeforeTrigger);
            console.log('match', match);
            // insert the before/after text around trigger sequence
            if (match) {
              const matchedText = match[1] || match[0];
              const matchedTextLength = matchedText.length;
              const replaceStartPosition = changeStartPosition.translate(
                0,
                -matchedTextLength + changeText.length
              );
              const adjustedChangeEndPosition = changeStartPosition.translate(
                0,
                changeText.length
              );
              await editor.edit((editBuilder) => {
                editBuilder.replace(
                  new vscode.Range(
                    replaceStartPosition,
                    adjustedChangeEndPosition
                  ),
                  str_add_before + matchedText + str_add_after
                );
              });
              /*
               * If added some text, go back a specified number of characters,
               * to the start of the previous tag.
               */
              if (str_go_back_length) {
                const numberOfKeyPresses = str_go_back_length;
                for (let i = 0; i < numberOfKeyPresses; i++) {
                  await vscode.commands.executeCommand('cursorLeft');
                }
              }
              /*
               * And save - to trigger Prettier auto-format
               */
              const document = editor.document;
              await document.save();
            }
          }
        }
      })
    );
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
