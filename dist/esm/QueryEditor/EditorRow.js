import { css } from '@emotion/css';
import React__default from 'react';
import { Stack } from './Stack.js';
import { useStyles2 } from '@grafana/ui';

const EditorRow = ({ children }) => {
  const styles = useStyles2(getStyles);
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.root }, /* @__PURE__ */ React__default.createElement(Stack, { gap: 2 }, children));
};
const getStyles = (theme) => {
  return {
    root: css({
      padding: theme.spacing(1),
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.shape.borderRadius(1)
    })
  };
};

export { EditorRow };
//# sourceMappingURL=EditorRow.js.map
