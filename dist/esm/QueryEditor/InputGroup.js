import { cx, css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import React__default, { Children, isValidElement, cloneElement } from 'react';

const InputGroup = ({ children }) => {
  const styles = useStyles2(getStyles);
  const modifiedChildren = Children.map(children, (child) => {
    if (isValidElement(child) && child.props.invalid) {
      return cloneElement(child, { className: cx(child.props.className, styles.invalidChild) });
    }
    return child;
  });
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.root }, modifiedChildren);
};
const borderPriority = [
  "",
  // lowest priority
  "base",
  "hovered",
  "invalid",
  "focused"
  // highest priority
];
const getStyles = () => ({
  root: css({
    display: "flex",
    // Style the direct children of the component
    "> *": {
      "&:not(:first-child)": {
        // Negative margin hides the double-border on adjacent selects
        marginLeft: -1
      },
      "&:first-child": {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      },
      "&:last-child": {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      },
      "&:not(:first-child):not(:last-child)": {
        borderRadius: 0
      },
      //
      position: "relative",
      zIndex: borderPriority.indexOf("base"),
      // Adjacent borders are overlapping, so raise children up when hovering etc
      // so all that child's borders are visible.
      "&:hover": {
        zIndex: borderPriority.indexOf("hovered")
      },
      "&:focus-within": {
        zIndex: borderPriority.indexOf("focused")
      }
    }
  }),
  invalidChild: css({
    zIndex: borderPriority.indexOf("invalid")
  })
});

export { InputGroup };
//# sourceMappingURL=InputGroup.js.map
