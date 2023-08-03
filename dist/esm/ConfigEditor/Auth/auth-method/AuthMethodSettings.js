import React__default, { useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { useTheme2, Select } from '@grafana/ui';
import { BasicAuth } from './BasicAuth.js';
import { ConfigSubSection } from '../../ConfigSection/ConfigSubSection.js';
import { AuthMethod } from '../types.js';

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
const defaultOptions = {
  [AuthMethod.BasicAuth]: {
    label: "Basic authentication",
    value: AuthMethod.BasicAuth,
    description: "Authenticate with your data source username and password"
  },
  [AuthMethod.CrossSiteCredentials]: {
    label: "Enable cross-site access control requests",
    value: AuthMethod.CrossSiteCredentials,
    description: "Allow cross-site Access-Control requests with your existing credentials and cookies. This enables the server to authenticate the user and perform authorized requests on their behalf on other domains."
  },
  [AuthMethod.OAuthForward]: {
    label: "Forward OAuth Identity",
    value: AuthMethod.OAuthForward,
    description: "Forward the OAuth access token (and if available: the OIDC ID token) of the user querying to the data source"
  },
  [AuthMethod.NoAuth]: {
    label: "No Authentication",
    value: AuthMethod.NoAuth,
    description: "Data source is available without authentication"
  }
};
const AuthMethodSettings = ({
  selectedMethod,
  mostCommonMethod,
  visibleMethods: visibleMethodsFromProps,
  extendedDefaultOptions,
  customMethods,
  onAuthMethodSelect,
  basicAuth,
  readOnly
}) => {
  var _a, _b, _c, _d;
  const [authMethodChanged, setAuthMethodChanged] = useState(false);
  const { colors, spacing } = useTheme2();
  const visibleMethods = useMemo(
    () => {
      var _a2;
      return visibleMethodsFromProps != null ? visibleMethodsFromProps : [
        AuthMethod.BasicAuth,
        AuthMethod.OAuthForward,
        AuthMethod.NoAuth,
        ...(_a2 = customMethods == null ? void 0 : customMethods.map((m) => m.id)) != null ? _a2 : []
      ];
    },
    [customMethods, visibleMethodsFromProps]
  );
  const hasSelect = visibleMethods.length > 1;
  const preparedOptions = useMemo(() => {
    var _a2;
    const customOptions = (_a2 = customMethods == null ? void 0 : customMethods.reduce((acc, method) => {
      acc[method.id] = {
        label: method.label,
        value: method.id,
        description: method.description
      };
      return acc;
    }, {})) != null ? _a2 : {};
    const preparedDefaultOptions = {};
    let k;
    for (k in defaultOptions) {
      if (extendedDefaultOptions && extendedDefaultOptions[k]) {
        preparedDefaultOptions[k] = __spreadValues(__spreadValues({}, defaultOptions[k]), extendedDefaultOptions[k]);
      } else {
        preparedDefaultOptions[k] = defaultOptions[k];
      }
    }
    const allOptions = __spreadValues(__spreadValues({}, customOptions), preparedDefaultOptions);
    return visibleMethods.filter((method) => Boolean(allOptions[method])).map((method) => {
      const option = allOptions[method];
      if (method === mostCommonMethod && hasSelect) {
        return __spreadProps(__spreadValues({}, option), {
          label: `${option.label} (most common)`
        });
      }
      return option;
    });
  }, [visibleMethods, customMethods, extendedDefaultOptions, mostCommonMethod, hasSelect]);
  let selected = selectedMethod;
  if (!hasSelect) {
    selected = visibleMethods[0];
  } else if (selectedMethod === AuthMethod.NoAuth && mostCommonMethod && !authMethodChanged) {
    selected = mostCommonMethod;
  }
  let AuthFieldsComponent = null;
  if (selected === AuthMethod.BasicAuth && basicAuth) {
    AuthFieldsComponent = /* @__PURE__ */ React__default.createElement(BasicAuth, __spreadProps(__spreadValues({}, basicAuth), { readOnly }));
  } else if (selected.startsWith("custom-")) {
    AuthFieldsComponent = (_b = (_a = customMethods == null ? void 0 : customMethods.find((m) => m.id === selected)) == null ? void 0 : _a.component) != null ? _b : null;
  }
  const title = hasSelect ? "Authentication methods" : (_c = preparedOptions[0].label) != null ? _c : "";
  const description = hasSelect ? "Choose an authentication method to access the data source" : (_d = preparedOptions[0].description) != null ? _d : "";
  const styles = {
    authMethods: css(__spreadValues({
      marginTop: spacing(2.5)
    }, hasSelect && {
      padding: spacing(2),
      border: `1px solid ${colors.border.weak}`
    })),
    selectedMethodFields: css({
      marginTop: spacing(1.5)
    })
  };
  return /* @__PURE__ */ React__default.createElement(ConfigSubSection, { title, description }, /* @__PURE__ */ React__default.createElement("div", { className: styles.authMethods }, hasSelect && /* @__PURE__ */ React__default.createElement(
    Select,
    {
      options: preparedOptions,
      value: selected,
      onChange: (option) => {
        setAuthMethodChanged(true);
        onAuthMethodSelect(option.value);
      },
      disabled: readOnly
    }
  ), AuthFieldsComponent && /* @__PURE__ */ React__default.createElement("div", { className: styles.selectedMethodFields }, AuthFieldsComponent)));
};

export { AuthMethodSettings };
//# sourceMappingURL=AuthMethodSettings.js.map
