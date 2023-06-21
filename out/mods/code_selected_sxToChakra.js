"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
exports.default = async () => {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let str = editor.document.getText(editor.selection);
        // CONVERT
        if (str.includes('sx={{')) {
            str = str.replace(/sx={{([^}}]*)}}/g, replaceSxObjectContent);
        }
        else {
            str = replaceSxObjectContent('', str);
        }
        // REPLACE
        await editor.edit((editBuilder) => {
            editBuilder.replace(editor.selection, str);
        });
        // SAVE
        if (vscode.window.activeTextEditor) {
            vscode.window.activeTextEditor.document.save();
        }
        else {
            vscode.commands.executeCommand('workbench.action.files.save');
        }
    }
    catch (err) { }
};
function replaceSxObjectContent(match, str) {
    /*
     * ADVANCED SX OBJECT -- ATTEMPT TO EVAL
     */
    if (match.includes(`':`)) {
        console.log('detected "\':" - attempting to parse str', str);
        try {
            let str = '';
            // let obj = JSON.parse('{' + str + '}');
            let obj = eval(`({${str}})`);
            console.log('obj', obj);
            if (obj) {
                str = buildSxStringFromObject(obj);
            }
            return str;
        }
        catch (e) { }
    }
    /*
     * SIMPLE SX OBJECT -- REPLACE WITH CHAKRA PROPS
     */
    // replace array
    str = str.replace(new RegExp(`(\\w+): ?\\[(.*?)],?`, 'g'), function (match, p1, p2) {
        // console.log('before', p2);
        // remove trailing null values
        let arr = p2.split(',');
        // console.log('arr', arr);
        if (arr?.length > 1) {
            while (arr[arr.length - 1].trim() === 'null') {
                arr.pop();
            }
            p2 = arr.join(',');
        }
        // console.log('after', p2);
        // inject array items back into JSX prop
        return `${p1}={[${p2}]}`;
    });
    // replace color: 'white' with color="white"
    str = str.replace(new RegExp(`(\\w+): ?'([^']+?)',?`, 'g'), '$1="$2"');
    // replace pb:0 with pb={0}
    str = str.replace(new RegExp(`(\\w+): ([0-9-]+)`, 'g'), '$1={$2}');
    // remove trailing comma
    str = str.replace(/,\s*$/g, '');
    str = str.replace(/,\s*\n/g, '\n');
    return str;
}
function buildSxStringFromObject(obj) {
    let str = '';
    for (let key in obj) {
        let val = obj[key];
        if (key === ':hover') {
            key = '_hover';
        }
        if (key === ':focus') {
            key = '_focus';
        }
        if (typeof val === 'string') {
            val = val.replace(/"/g, '\\"');
            str += `${key}="${val}" `;
        }
        else {
            str += `${key}={${val}} `;
        }
    }
    return str;
}
//# sourceMappingURL=code_selected_sxToChakra.js.map