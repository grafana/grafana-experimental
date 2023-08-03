import { cx, css } from '@emotion/css';
import React__default, { useCallback } from 'react';
import { useStyles2 } from '@grafana/ui';

const Space = (props) => {
  const styles = useStyles2(useCallback((theme) => getStyles(theme, props), [props]));
  return /* @__PURE__ */ React__default.createElement("span", { className: cx(styles.wrapper) });
};
Space.defaultProps = {
  v: 0,
  h: 0,
  layout: "block"
};
const getStyles = (theme, props) => {
  var _a, _b;
  return {
    wrapper: css([
      {
        paddingRight: theme.spacing((_a = props.h) != null ? _a : 0),
        paddingBottom: theme.spacing((_b = props.v) != null ? _b : 0)
      },
      props.layout === "inline" && {
        display: "inline-block"
      },
      props.layout === "block" && {
        display: "block"
      }
    ])
  };
};

export { Space };
//# sourceMappingURL=Space.js.map
