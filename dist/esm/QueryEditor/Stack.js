import { css } from '@emotion/css';
import React__default, { useCallback } from 'react';
import { useStyles2 } from '@grafana/ui';

var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const Stack = (_a) => {
  var _b = _a, { children } = _b, props = __objRest(_b, ["children"]);
  const styles = useStyles2(useCallback((theme) => getStyles(theme, props), [props]));
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.root }, children);
};
const getStyles = (theme, props) => {
  var _a, _b, _c;
  return {
    root: css({
      display: "flex",
      flexDirection: (_a = props.direction) != null ? _a : "row",
      flexWrap: ((_b = props.wrap) != null ? _b : true) ? "wrap" : void 0,
      alignItems: props.alignItems,
      gap: theme.spacing((_c = props.gap) != null ? _c : 2),
      flexGrow: props.flexGrow
    })
  };
};

export { Stack };
//# sourceMappingURL=Stack.js.map
