import { css } from '@emotion/css';
import React__default from 'react';
import { useStyles2 } from '@grafana/ui';

const EditorHeader = ({ children }) => {
  const styles = useStyles2(getStyles);
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.root }, children);
};
const getStyles = (theme) => ({
  root: css({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing(3),
    minHeight: theme.spacing(4)
  })
});

export { EditorHeader };
//# sourceMappingURL=EditorHeader.js.map
