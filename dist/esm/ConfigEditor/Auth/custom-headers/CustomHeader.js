import React__default from 'react';
import { css, cx } from '@emotion/css';
import { useTheme2, InlineFieldRow, InlineField, Input, IconButton } from '@grafana/ui';
import { SecretInput } from '../common/SecretInput.js';
import { useCommonStyles } from '../styles.js';

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
const CustomHeader = ({ header, onChange, onBlur, onDelete, readOnly }) => {
  const { spacing } = useTheme2();
  const commonStyles = useCommonStyles();
  const styles = {
    container: css({
      alignItems: "center"
    }),
    input: css({
      minWidth: "100%"
    }),
    headerNameField: css({
      width: "40%",
      marginRight: 0,
      paddingRight: spacing(1)
    }),
    headerValueField: css({
      width: "45%",
      marginRight: 0
    }),
    removeHeaderBtn: css({
      margin: `0 0 3px 10px`
    })
  };
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(InlineFieldRow, { className: styles.container }, /* @__PURE__ */ React__default.createElement(
    InlineField,
    {
      label: "Header",
      labelWidth: 9,
      grow: true,
      className: styles.headerNameField,
      htmlFor: `custom-header-${header.id}-name-input`,
      disabled: readOnly
    },
    /* @__PURE__ */ React__default.createElement(
      Input,
      {
        id: `custom-header-${header.id}-name-input`,
        placeholder: "X-Custom-Header",
        value: header.name,
        width: 12,
        onChange: (e) => onChange(__spreadProps(__spreadValues({}, header), { name: e.currentTarget.value })),
        onBlur,
        className: styles.input
      }
    )
  ), /* @__PURE__ */ React__default.createElement(
    InlineField,
    {
      label: "Value",
      labelWidth: 9,
      grow: true,
      className: cx(commonStyles.inlineFieldWithSecret, styles.headerValueField),
      htmlFor: `custom-header-${header.id}-value-input`,
      disabled: readOnly
    },
    /* @__PURE__ */ React__default.createElement(
      SecretInput,
      {
        id: `custom-header-${header.id}-value-input`,
        isConfigured: header.configured,
        placeholder: "Header value",
        value: header.value,
        width: 12,
        onChange: (e) => onChange(__spreadProps(__spreadValues({}, header), { value: e.currentTarget.value })),
        onReset: readOnly ? () => {
        } : () => onChange(__spreadProps(__spreadValues({}, header), { configured: false, value: "" })),
        onBlur,
        className: styles.input
      }
    )
  ), /* @__PURE__ */ React__default.createElement(
    IconButton,
    {
      name: "trash-alt",
      tooltip: "Remove header",
      tooltipPlacement: "top",
      className: styles.removeHeaderBtn,
      onClick: onDelete,
      type: "button",
      disabled: readOnly
    }
  )));
};

export { CustomHeader };
//# sourceMappingURL=CustomHeader.js.map
