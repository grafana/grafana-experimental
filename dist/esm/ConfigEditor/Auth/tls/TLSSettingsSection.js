import React__default from 'react';
import { css } from '@emotion/css';
import { useTheme2, Checkbox, Tooltip, Icon } from '@grafana/ui';

const TLSSettingsSection = ({ children, enabled, label, tooltipText, onToggle, readOnly }) => {
  const { colors, spacing } = useTheme2();
  const styles = {
    container: css({
      marginTop: 3
    }),
    checkboxContainer: css({
      display: "flex",
      alignItems: "center"
    }),
    infoIcon: css({
      marginTop: -2,
      marginLeft: 5,
      color: colors.text.secondary
    }),
    content: css({
      margin: spacing(1, 0, 2, 3)
    })
  };
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.container }, /* @__PURE__ */ React__default.createElement("div", { className: styles.checkboxContainer }, /* @__PURE__ */ React__default.createElement(Checkbox, { value: enabled, label, onChange: () => onToggle(!enabled), disabled: readOnly }), /* @__PURE__ */ React__default.createElement(Tooltip, { placement: "top", content: tooltipText, interactive: true }, /* @__PURE__ */ React__default.createElement(Icon, { name: "info-circle", className: styles.infoIcon, size: "sm" }))), enabled && children && /* @__PURE__ */ React__default.createElement("div", { className: styles.content }, children));
};

export { TLSSettingsSection };
//# sourceMappingURL=TLSSettingsSection.js.map
