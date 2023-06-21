import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const stylingSystems = ['SCSS', 'Mui sx', 'Chakra props', 'className'] as const;
type stylingSystem = (typeof stylingSystems)[number];

function getTsxFileContent(
  componentName: string,
  stylingSystem: stylingSystem
) {
  switch (stylingSystem) {
    case 'SCSS':
      return `import React from 'react';
import styles from './index.module.scss';

type Props = React.ComponentPropsWithoutRef<'div'> & {};

export default function ${componentName}({ children }: Props) {
  return (
    <div className={styles.component} data-component="${componentName}">
      {children}
    </div>
  );
}`;
    case 'Mui sx':
      return `import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';

type Props = BoxProps & {};

export default function ${componentName}({ children }: Props) {
  return (<Box sx={{}} data-component="${componentName}">{children}</Box>);
}`;
    case 'Chakra props':
      return `import React from 'react';
import { Box, BoxProps } from '@chakra/react';

type Props = BoxProps & {};

export default function ${componentName}({ children }: Props) {
  return (<Box data-component="${componentName}">{children}</Box>);
}`;
    case 'className':
      return `import React from 'react';

type Props = React.ComponentPropsWithoutRef<'div'> & {};

export default function ${componentName}({ children, className }: Props) {
  return (<div className={\`\${className}\`} data-component="${componentName}">{children}</div>);
}`;
  }
}

function getScssFileContent() {
  return `.component {
  position: relative;
}
`;
}

async function getStylingSystem() {
  const selectedStyling = (await vscode.window.showQuickPick(stylingSystems, {
    placeHolder: 'What styling system to use?',
  })) as stylingSystem;
  return selectedStyling || 'SCSS';
}

async function getDirname(pathName: string) {
  const stats = await fs.promises.stat(pathName);
  if (stats.isFile()) {
    return path.dirname(pathName);
  } else if (stats.isDirectory()) {
    return pathName;
  } else {
    throw new Error('Path is neither file nor directory');
  }
}

export default async (resource: any) => {
  const folderPath = await getDirname(resource.fsPath);
  const componentName = await vscode.window.showInputBox({
    prompt: 'Enter the component name (without extension)',
  });
  const stylingSystem = await getStylingSystem();

  if (componentName) {
    const componentFolderPath = path.join(folderPath, componentName);
    const tsxFilePath = path.join(componentFolderPath, 'index.tsx');
    const tsxFileContent = getTsxFileContent(componentName, stylingSystem);
    const scssFilePath = path.join(componentFolderPath, 'index.module.scss');
    const scssFileContent = getScssFileContent();

    fs.mkdir(componentFolderPath, { recursive: true }, (err) => {
      if (err) {
        vscode.window.showErrorMessage(
          `Failed to create component folder: ${err.message}`
        );
        return;
      }

      fs.writeFile(tsxFilePath, tsxFileContent, (err) => {
        if (err) {
          vscode.window.showErrorMessage(
            `Failed to create index.tsx file: ${err.message}`
          );
          return;
        }
      });

      if (stylingSystem === 'SCSS') {
        fs.writeFile(scssFilePath, scssFileContent, (err) => {
          if (err) {
            vscode.window.showErrorMessage(
              `Failed to create index.module.scss file: ${err.message}`
            );
            return;
          }
        });
      }

      vscode.window.showInformationMessage(
        'React component created successfully'
      );
    });
  }
};
