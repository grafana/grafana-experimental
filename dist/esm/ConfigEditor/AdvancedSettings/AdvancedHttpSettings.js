import React__default from 'react';
import { css, cx } from '@emotion/css';
import { InlineField, TagsInput, Input } from '@grafana/ui';
import { ConfigSubSection } from '../ConfigSection/ConfigSubSection.js';

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
const AdvancedHttpSettings = ({
  config,
  onChange,
  className
}) => {
  const onCookiesChange = (cookies) => {
    onChange(__spreadProps(__spreadValues({}, config), {
      jsonData: __spreadProps(__spreadValues({}, config.jsonData), {
        keepCookies: cookies
      })
    }));
  };
  const onTimeoutChange = (event) => {
    onChange(__spreadProps(__spreadValues({}, config), {
      jsonData: __spreadProps(__spreadValues({}, config.jsonData), {
        timeout: parseInt(event.currentTarget.value, 10)
      })
    }));
  };
  const styles = {
    container: css({
      maxWidth: 578
    })
  };
  return /* @__PURE__ */ React__default.createElement(ConfigSubSection, { title: "Advanced HTTP settings", className: cx(styles.container, className) }, /* @__PURE__ */ React__default.createElement(
    InlineField,
    {
      htmlFor: "advanced-http-cookies",
      label: "Allowed cookies",
      labelWidth: 24,
      tooltip: "Grafana proxy deletes forwarded cookies by default. Specify cookies by name that should be forwarded to the data source.",
      disabled: config.readOnly,
      grow: true
    },
    /* @__PURE__ */ React__default.createElement(
      TagsInput,
      {
        id: "advanced-http-cookies",
        placeholder: "New cookie (hit enter to add)",
        tags: config.jsonData.keepCookies,
        onChange: onCookiesChange
      }
    )
  ), /* @__PURE__ */ React__default.createElement(
    InlineField,
    {
      htmlFor: "advanced-http-timeout",
      label: "Timeout",
      labelWidth: 24,
      tooltip: "HTTP request timeout in seconds",
      disabled: config.readOnly,
      grow: true
    },
    /* @__PURE__ */ React__default.createElement(
      Input,
      {
        id: "advanced-http-timeout",
        type: "number",
        min: 0,
        placeholder: "Timeout in seconds",
        "aria-label": "Timeout in seconds",
        value: config.jsonData.timeout,
        onChange: onTimeoutChange
      }
    )
  ));
};

export { AdvancedHttpSettings };
//# sourceMappingURL=AdvancedHttpSettings.js.map
