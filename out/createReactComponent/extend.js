"use strict";
function getTsxFileContent(componentName) {
    return `import React from 'react';
import styles from './index.module.scss';

const ${componentName} = () => {
  return <div className={styles.container}>${componentName}</div>;
};

export default ${componentName};
`;
}
function getScssFileContent() {
    return `.container {
  /* Add your styles here */
}
`;
}
//# sourceMappingURL=extend.js.map