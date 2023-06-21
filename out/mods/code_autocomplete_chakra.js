"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const chakra_autocomplete = [
    ['={[', `(?:\\s|^)([^\\s]+={\\[)$`, '\n', 'null,null]}\n', 27],
    [
        '<Text ',
        `<Text $`,
        '',
        '\nas="p"\nfontSize={[null,null]}\nfontWeight={[null,null]}\nlineHeight={[null,null]}\nletterSpacing={[null,null]}\nmaxW={[null,null]}\n>\n</Text>\n',
        9,
    ],
    [
        '<Flex ',
        `<Flex $`,
        '',
        '\nflexDirection={[null,null]}\nalignItems={[null,null]}\njustifyContent={[null,null]}\nwidth="100%">\n</Flex>\n',
        9,
    ],
    [
        '<Grid ',
        `<Grid $`,
        '',
        '\ngridTemplateColumns={[null,null]}\ngridTemplateRows={[null,null]}\nwidth="100%"\n>\n</Grid>\n',
        9,
    ],
];
// console.log('registered command "convertcode.insertText"');
exports.default = async (event) => {
    if (event.contentChanges.length === 0) {
        return;
    }
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        console.log('No active editor found!');
        return;
    }
    const lastChange = event.contentChanges[event.contentChanges.length - 1];
    if (!lastChange) {
        return;
    }
    const changeText = lastChange.text;
    const changeStartPosition = lastChange.range.start;
    const changeEndPosition = lastChange.range.end;
    const currentLine = changeStartPosition.line;
    const lineStartPosition = editor.document.lineAt(currentLine).range.start;
    let textBeforeTrigger = editor.document.getText(new vscode.Range(lineStartPosition, changeEndPosition));
    textBeforeTrigger += changeText; // Add the new just-typed character
    /*
     * Replace each instance of trigger sequence with before/after text
     */
    for (const [chakra_trigger, chakra_match, chakra_add_before, chakra_add_after, chakra_go_back_length,] of chakra_autocomplete) {
        console.log('textBeforeTrigger chakra_trigger', [
            textBeforeTrigger,
            chakra_trigger,
        ]);
        if (textBeforeTrigger.endsWith(chakra_trigger)) {
            // escape the trigger sequence for regex
            // const chakra_trigger_escape_regex = chakra_trigger.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
            // stop at the last non-whitespace sequence before the trigger sequence
            const regex = new RegExp(chakra_match);
            const match = regex.exec(textBeforeTrigger);
            console.log('match', match);
            // insert the before/after text around trigger sequence
            if (match) {
                const matchedText = match[1] || match[0];
                const matchedTextLength = matchedText.length;
                const replaceStartPosition = changeStartPosition.translate(0, -matchedTextLength + changeText.length);
                const adjustedChangeEndPosition = changeStartPosition.translate(0, changeText.length);
                await editor.edit((editBuilder) => {
                    editBuilder.replace(new vscode.Range(replaceStartPosition, adjustedChangeEndPosition), chakra_add_before + matchedText + chakra_add_after);
                });
                /*
                 * If added some text, go back a specified number of characters,
                 * to the start of the previous tag.
                 */
                if (chakra_go_back_length) {
                    const numberOfKeyPresses = chakra_go_back_length;
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
};
//# sourceMappingURL=code_autocomplete_chakra.js.map