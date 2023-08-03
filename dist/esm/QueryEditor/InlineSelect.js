import { css, cx } from '@emotion/css';
import React__default, { useState } from 'react';
import { useStyles2, Select, SelectContainer as SelectContainer$1 } from '@grafana/ui';

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
function InlineSelect(_a) {
  var _b = _a, { label: labelProp } = _b, props = __objRest(_b, ["label"]);
  const styles = useStyles2(getSelectStyles);
  const [id] = useState(() => Math.random().toString(16).slice(2));
  const components = {
    SelectContainer,
    ValueContainer,
    SingleValue: ValueContainer
  };
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.root }, labelProp && /* @__PURE__ */ React__default.createElement("label", { className: styles.label, htmlFor: id }, labelProp, ":", "\xA0"), /* @__PURE__ */ React__default.createElement(Select, __spreadProps(__spreadValues({ openMenuOnFocus: true, inputId: id }, props), { components })));
}
const SelectContainer = (props) => {
  const { children } = props;
  const styles = useStyles2(getSelectStyles);
  return /* @__PURE__ */ React__default.createElement(SelectContainer$1, __spreadProps(__spreadValues({}, props), { className: cx(props.className, styles.container) }), children);
};
const ValueContainer = (props) => {
  const { className, children } = props;
  const styles = useStyles2(getSelectStyles);
  return /* @__PURE__ */ React__default.createElement("div", { className: cx(className, styles.valueContainer) }, children);
};
const getSelectStyles = (theme) => ({
  root: css({
    display: "flex",
    fontSize: 12,
    alignItems: "center"
  }),
  label: css({
    color: theme.colors.text.secondary,
    whiteSpace: "nowrap"
  }),
  container: css({
    background: "none",
    borderColor: "transparent"
  }),
  valueContainer: css({
    display: "flex",
    alignItems: "center",
    flex: "initial",
    color: theme.colors.text.secondary,
    fontSize: 12
  })
});

export { InlineSelect };
//# sourceMappingURL=InlineSelect.js.map
