import * as vscode from 'vscode';
// console.log('registered command "convertcode.selectedToUpperCase"');

export default async () => {
  try {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    let str = editor.document.getText(editor.selection);
    // CONVERT
    str = str.replace(/sx={{([^}}]*)}}/g, function (match, str: string) {
      console.log('match, str', [match, str]);
      if (match.includes(`':`)) {
        /*
         * ADVANCED SX OBJECT NOT YET SUPPORTED
         */
        return match;
      } else {
        /*
         * SIMPLE SX OBJECT -- REPLACE WITH CHAKRA PROPS
         */
        // replace arrays `mb: ['24px', '36px', null, null]` with `mb={['24px', '36px']}`
        str = str.replace(
          new RegExp(`(\\w+): ?\\[(.*?)],?`, 'g'),
          function (match, p1, p2) {
            console.log('before', p2);
            // remove trailing null values from array
            let arr = p2.split(',');
            console.log('arr', arr);
            if (arr?.length > 1) {
              while (arr[arr.length - 1].trim() === 'null') {
                arr.pop();
              }
              p2 = arr.join(',');
            }
            console.log('after', p2);
            // inject array items back into JSX prop
            return `${p1}={[${p2}]}`;
          }
        );
        // replace color: 'white' with color="white"
        str = str.replace(new RegExp(`(\\w+): ?'([^']+?)',?`, 'g'), '$1="$2"');
        // replace pb:0 with pb={0}
        str = str.replace(new RegExp(`(\\w+): ([0-9]+)`, 'g'), '$1={$2}');
        // replace color: 'white' with color='white'
        // str = str.replace(/: ?/g, '=');
        // remove trailing comma
        str = str.replace(/,\s*$/g, '');
        str = str.replace(/,\s*\n/g, '\n');
        return str;
      }
    });

    /*
     * REPLACE
     */
    await editor.edit((editBuilder) => {
      editBuilder.replace(editor.selection, str);
    });
  } catch (err) {}
};
