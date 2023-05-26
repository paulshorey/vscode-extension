## This extension contributes the following features:

### Commands / Menus

```
  {
    "command": "convertcode.selectedToUpperCase",
    "title": "cc UPPERCASE"
  }
```

### Keyboard shortcuts

- type `something={[` and it will autocomplete it as `something={[null,null,null,null,null]}` and move to its own line

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
