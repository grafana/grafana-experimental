import { css } from '@emotion/css';
import { Switch } from '@grafana/ui';
import React__default from 'react';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const EditorSwitch = (props) => {
  const styles = getStyles();
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.switch }, /* @__PURE__ */ React__default.createElement(Switch, __spreadValues({}, props)));
};
const getStyles = () => {
  return {
    switch: css({
      display: "flex",
      alignItems: "center",
      minHeight: 30
    })
  };
};

export { EditorSwitch };
//# sourceMappingURL=EditorSwitch.js.map
