import { cx, css } from '@emotion/css';
import * as React from 'react';
import { useStyles2, HorizontalGroup, TextArea, Button } from '@grafana/ui';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
const CONFIGURED_TEXT = "configured";
const RESET_BUTTON_TEXT = "Reset";
const getStyles = (theme) => {
  return {
    configuredStyle: css`
      min-height: ${theme.spacing(theme.components.height.md)};
      padding-top: ${theme.spacing(0.5)};
      resize: none;
    `
  };
};
const SecretTextArea = (_a) => {
  var _b = _a, { isConfigured, onReset } = _b, props = __objRest(_b, ["isConfigured", "onReset"]);
  const styles = useStyles2(getStyles);
  return /* @__PURE__ */ React.createElement(HorizontalGroup, null, !isConfigured && /* @__PURE__ */ React.createElement(TextArea, __spreadValues({}, props)), isConfigured && /* @__PURE__ */ React.createElement(TextArea, __spreadProps(__spreadValues({}, props), { rows: 1, disabled: true, value: CONFIGURED_TEXT, className: cx(styles.configuredStyle) })), isConfigured && /* @__PURE__ */ React.createElement(Button, { onClick: onReset, variant: "secondary" }, RESET_BUTTON_TEXT));
};

export { CONFIGURED_TEXT, RESET_BUTTON_TEXT, SecretTextArea };
//# sourceMappingURL=SecretTextarea.js.map
