import { css } from '@emotion/css';
import React__default, { useCallback } from 'react';
import { Space } from './Space.js';
import { useStyles2, ReactUtils, Tooltip, Icon, Field } from '@grafana/ui';

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
const EditorField = (props) => {
  var _b;
  const _a = props, { label, optional, tooltip, tooltipInteractive, children, width } = _a, fieldProps = __objRest(_a, ["label", "optional", "tooltip", "tooltipInteractive", "children", "width"]);
  const styles = useStyles2(useCallback((theme) => getStyles(theme, width), [width]));
  const childInputId = (fieldProps == null ? void 0 : fieldProps.htmlFor) || ((_b = ReactUtils) == null ? void 0 : _b.getChildId(children));
  const labelEl = /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("label", { className: styles.label, htmlFor: childInputId }, label, optional && /* @__PURE__ */ React__default.createElement("span", { className: styles.optional }, " - optional"), tooltip && /* @__PURE__ */ React__default.createElement(Tooltip, { placement: "top", content: tooltip, theme: "info", interactive: tooltipInteractive }, /* @__PURE__ */ React__default.createElement(Icon, { tabIndex: 0, name: "info-circle", size: "sm", className: styles.icon }))), /* @__PURE__ */ React__default.createElement(Space, { v: 0.5 }));
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.root }, /* @__PURE__ */ React__default.createElement(Field, __spreadValues({ className: styles.field, label: labelEl }, fieldProps), children));
};
const getStyles = (theme, width) => {
  return {
    root: css({
      minWidth: theme.spacing(width != null ? width : 0)
    }),
    label: css({
      fontSize: 12,
      fontWeight: theme.typography.fontWeightMedium
    }),
    optional: css({
      fontStyle: "italic",
      color: theme.colors.text.secondary
    }),
    field: css({
      marginBottom: 0
      // GrafanaUI/Field has a bottom margin which we must remove
    }),
    icon: css({
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing(1),
      ":hover": {
        color: theme.colors.text.primary
      }
    })
  };
};

export { EditorField };
//# sourceMappingURL=EditorField.js.map
