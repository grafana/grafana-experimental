import React__default from 'react';
import { css, cx } from '@emotion/css';
import { InlineField, Input } from '@grafana/ui';
import { ConfigSection } from '../ConfigSection/ConfigSection.js';

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
const ConnectionSettings = ({
  config,
  onChange,
  description,
  urlPlaceholder,
  urlTooltip,
  urlLabel,
  className
}) => {
  const isValidUrl = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(
    config.url
  );
  const styles = {
    container: css({
      maxWidth: 578
    })
  };
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(ConfigSection, { title: "Connection", description, className: cx(styles.container, className) }, /* @__PURE__ */ React__default.createElement(
    InlineField,
    {
      htmlFor: "connection-url",
      label: urlLabel || "URL",
      labelWidth: 24,
      tooltip: urlTooltip || /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, "Specify a complete HTTP URL", /* @__PURE__ */ React__default.createElement("br", null), "(for example https://example.com:8080)"),
      grow: true,
      disabled: config.readOnly,
      required: true,
      invalid: !isValidUrl && !config.readOnly,
      error: isValidUrl ? "" : "Please enter a valid URL",
      interactive: true
    },
    /* @__PURE__ */ React__default.createElement(
      Input,
      {
        id: "connection-url",
        "aria-label": "Data source connection URL",
        onChange: (event) => onChange(__spreadProps(__spreadValues({}, config), {
          url: event.currentTarget.value
        })),
        value: config.url || "",
        placeholder: urlPlaceholder || "URL"
      }
    )
  )));
};

export { ConnectionSettings };
//# sourceMappingURL=ConnectionSettings.js.map
