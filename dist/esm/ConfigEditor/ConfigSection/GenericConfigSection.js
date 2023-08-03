import React__default, { useState } from 'react';
import { css } from '@emotion/css';
import { useTheme2, IconButton } from '@grafana/ui';

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
const GenericConfigSection = ({
  children,
  title,
  description,
  isCollapsible = false,
  isInitiallyOpen = true,
  kind = "section",
  className
}) => {
  const { colors, typography, spacing } = useTheme2();
  const [isOpen, setIsOpen] = useState(isCollapsible ? isInitiallyOpen : true);
  const iconName = isOpen ? "angle-up" : "angle-down";
  const isSubSection = kind === "sub-section";
  const collapsibleButtonAriaLabel = `${isOpen ? "Collapse" : "Expand"} section ${title}`;
  const styles = {
    header: css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }),
    title: css({
      margin: 0
    }),
    subtitle: css({
      margin: 0,
      fontWeight: typography.fontWeightRegular
    }),
    descriptionText: css(__spreadProps(__spreadValues({
      marginTop: spacing(isSubSection ? 0.25 : 0.5),
      marginBottom: 0
    }, typography.bodySmall), {
      color: colors.text.secondary
    })),
    content: css({
      marginTop: spacing(2)
    })
  };
  return /* @__PURE__ */ React__default.createElement("div", { className }, /* @__PURE__ */ React__default.createElement("div", { className: styles.header }, kind === "section" ? /* @__PURE__ */ React__default.createElement("h3", { className: styles.title }, title) : /* @__PURE__ */ React__default.createElement("h6", { className: styles.subtitle }, title), isCollapsible && /* @__PURE__ */ React__default.createElement(
    IconButton,
    {
      name: iconName,
      onClick: () => setIsOpen(!isOpen),
      type: "button",
      size: "xl",
      "aria-label": collapsibleButtonAriaLabel
    }
  )), description && /* @__PURE__ */ React__default.createElement("p", { className: styles.descriptionText }, description), isOpen && /* @__PURE__ */ React__default.createElement("div", { className: styles.content }, children));
};

export { GenericConfigSection };
//# sourceMappingURL=GenericConfigSection.js.map
