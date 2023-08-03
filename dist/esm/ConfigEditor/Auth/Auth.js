import React__default from 'react';
import { css } from '@emotion/css';
import { AuthMethodSettings } from './auth-method/AuthMethodSettings.js';
import { TLSSettings } from './tls/TLSSettings.js';
import { CustomHeaders } from './custom-headers/CustomHeaders.js';
import { ConfigSection } from '../ConfigSection/ConfigSection.js';
import '@grafana/ui';

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
const Auth = ({
  selectedMethod,
  mostCommonMethod,
  visibleMethods,
  extendedDefaultOptions,
  customMethods,
  onAuthMethodSelect,
  basicAuth,
  TLS,
  customHeaders,
  readOnly = false
}) => {
  const styles = {
    container: css({
      maxWidth: 578
    })
  };
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.container }, /* @__PURE__ */ React__default.createElement(ConfigSection, { title: "Authentication" }, /* @__PURE__ */ React__default.createElement(
    AuthMethodSettings,
    {
      selectedMethod,
      mostCommonMethod,
      customMethods,
      visibleMethods,
      extendedDefaultOptions,
      onAuthMethodSelect,
      basicAuth,
      readOnly
    }
  ), TLS && /* @__PURE__ */ React__default.createElement(TLSSettings, __spreadProps(__spreadValues({}, TLS), { readOnly })), customHeaders && /* @__PURE__ */ React__default.createElement(CustomHeaders, __spreadProps(__spreadValues({}, customHeaders), { readOnly }))));
};

export { Auth };
//# sourceMappingURL=Auth.js.map
