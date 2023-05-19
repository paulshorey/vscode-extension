## This extension contributes the following features:

```
  "commands": [
    {
      "command": "convertcode.selectedToUpperCase",
      "title": "cc UPPERCASE"
    }
  ],
  "menus": {
    "editor/context": [
      {
        "command": "convertcode.selectedToUpperCase",
        "group": "1_modification",
        "when": "editorHasSelection"
      }
    ]
  }
```

<br />

## Develop

Press F5 to run and debug your extension in a new window. Right-click on any selected text, and you should see the "Transform Selected Text" option in the context menu.

<br />

## Deploy

Package your extension using vsce:

```
npm install -g vsce
vsce package
```

Publish your extension to the Visual Studio Code Marketplace, or share the .vsix file generated in step 9.

<br />

## References

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
