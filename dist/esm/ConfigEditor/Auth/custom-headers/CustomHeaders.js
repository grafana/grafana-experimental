import React__default, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { useTheme2, Button } from '@grafana/ui';
import { CustomHeader } from './CustomHeader.js';
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
const CustomHeaders = ({ headers: headersFromProps, onChange, readOnly }) => {
  const { spacing } = useTheme2();
  const [headers, setHeaders] = useState(
    headersFromProps.map((header) => __spreadProps(__spreadValues({}, header), {
      id: uniqueId(),
      value: ""
    }))
  );
  useEffect(() => {
    setHeaders((headers2) => {
      let changed = false;
      const newHeaders = headers2.map((header) => {
        var _a;
        const configured = (_a = headersFromProps.find((h) => h.name === header.name)) == null ? void 0 : _a.configured;
        if (typeof configured !== "undefined" && header.configured !== configured) {
          changed = true;
          return __spreadProps(__spreadValues({}, header), { configured });
        }
        return header;
      });
      if (changed) {
        return newHeaders;
      }
      return headers2;
    });
  }, [headersFromProps]);
  const onHeaderAdd = () => {
    setHeaders([...headers, { id: uniqueId(), name: "", value: "", configured: false }]);
  };
  const onHeaderChange = (id, header) => {
    setHeaders(headers.map((h) => h.id === id ? __spreadValues({}, header) : h));
  };
  const onHeaderDelete = (id) => {
    const index = headers.findIndex((h) => h.id === id);
    if (index === -1) {
      return;
    }
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
    onChange(
      newHeaders.map(({ name, value, configured }) => ({
        name,
        value,
        configured
      }))
    );
  };
  const onBlur = () => {
    onChange(
      headers.map(({ name, value, configured }) => ({
        name,
        value,
        configured
      }))
    );
  };
  const styles = {
    container: css({
      marginTop: spacing(3)
    }),
    addHeaderButton: css({
      marginTop: spacing(1.5)
    })
  };
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.container }, /* @__PURE__ */ React__default.createElement(
    ConfigSubSection,
    {
      title: "HTTP headers",
      description: "Pass along additional context and metadata about the request/response",
      isCollapsible: true,
      isInitiallyOpen: headers.length > 0
    },
    /* @__PURE__ */ React__default.createElement("div", null, headers.map((header) => /* @__PURE__ */ React__default.createElement(
      CustomHeader,
      {
        key: header.id,
        header,
        onChange: (header2) => onHeaderChange(header2.id, header2),
        onDelete: () => onHeaderDelete(header.id),
        onBlur,
        readOnly
      }
    ))),
    /* @__PURE__ */ React__default.createElement("div", { className: styles.addHeaderButton }, /* @__PURE__ */ React__default.createElement(Button, { icon: "plus", variant: "secondary", fill: "outline", onClick: onHeaderAdd, disabled: readOnly }, headers.length === 0 ? "Add header" : "Add another header"))
  ));
};
function uniqueId() {
  return Math.random().toString(16).slice(2);
}

export { CustomHeaders };
//# sourceMappingURL=CustomHeaders.js.map
