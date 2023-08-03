import React__default from 'react';
import { css } from '@emotion/css';
import { useTheme2 } from '@grafana/ui';
import { SelfSignedCertificate } from './SelfSignedCertificate.js';
import { TLSClientAuth } from './TLSClientAuth.js';
import { SkipTLSVerification } from './SkipTLSVerification.js';
import { ConfigSubSection } from '../../ConfigSection/ConfigSubSection.js';

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
const TLSSettings = ({
  selfSignedCertificate,
  TLSClientAuth: TLSClientAuth$1,
  skipTLSVerification,
  readOnly
}) => {
  const { spacing } = useTheme2();
  const styles = {
    container: css({
      marginTop: spacing(3)
    })
  };
  return /* @__PURE__ */ React__default.createElement(
    ConfigSubSection,
    {
      className: styles.container,
      title: "TLS settings",
      description: "Additional security measures that can be applied on top of authentication"
    },
    /* @__PURE__ */ React__default.createElement(SelfSignedCertificate, __spreadProps(__spreadValues({}, selfSignedCertificate), { readOnly })),
    /* @__PURE__ */ React__default.createElement(TLSClientAuth, __spreadProps(__spreadValues({}, TLSClientAuth$1), { readOnly })),
    /* @__PURE__ */ React__default.createElement(SkipTLSVerification, __spreadProps(__spreadValues({}, skipTLSVerification), { readOnly }))
  );
};

export { TLSSettings };
//# sourceMappingURL=TLSSettings.js.map
