import React__default from 'react';
import { css, cx } from '@emotion/css';
import { useTheme2 } from '@grafana/ui';

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
const DataSourceDescription = ({ dataSourceName, docsLink, hasRequiredFields = true, className }) => {
  const theme = useTheme2();
  const styles = {
    container: css({
      p: {
        margin: 0
      },
      "p + p": {
        marginTop: theme.spacing(2)
      }
    }),
    text: css(__spreadProps(__spreadValues({}, theme.typography.body), {
      color: theme.colors.text.secondary,
      a: css({
        color: theme.colors.text.link,
        textDecoration: "underline",
        "&:hover": {
          textDecoration: "none"
        }
      })
    }))
  };
  return /* @__PURE__ */ React__default.createElement("div", { className: cx(styles.container, className) }, /* @__PURE__ */ React__default.createElement("p", { className: styles.text }, "Before you can use the ", dataSourceName, " data source, you must configure it below or in the config file. For detailed instructions,", " ", /* @__PURE__ */ React__default.createElement("a", { href: docsLink, target: "_blank", rel: "noreferrer" }, "view the documentation"), "."), hasRequiredFields && /* @__PURE__ */ React__default.createElement("p", { className: styles.text }, /* @__PURE__ */ React__default.createElement("i", null, "Fields marked with * are required")));
};

export { DataSourceDescription };
//# sourceMappingURL=DataSourceDescription.js.map
