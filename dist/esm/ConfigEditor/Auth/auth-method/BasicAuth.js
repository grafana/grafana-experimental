import React__default from 'react';
import { css, cx } from '@emotion/css';
import { InlineField, Input } from '@grafana/ui';
import { SecretInput } from '../common/SecretInput.js';
import { useCommonStyles } from '../styles.js';

const BasicAuth = ({
  user,
  passwordConfigured,
  userTooltip = "The username of the data source account",
  passwordTooltip = "The password of the data source account",
  onUserChange,
  onPasswordChange,
  onPasswordReset,
  readOnly
}) => {
  const commonStyles = useCommonStyles();
  const styles = {
    lastInlineField: css({
      marginBottom: 0
    })
  };
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(
    InlineField,
    {
      className: commonStyles.inlineFieldNoMarginRight,
      label: "User",
      labelWidth: 24,
      tooltip: userTooltip,
      required: true,
      htmlFor: "basic-auth-user-input",
      interactive: true,
      grow: true,
      disabled: readOnly
    },
    /* @__PURE__ */ React__default.createElement(
      Input,
      {
        id: "basic-auth-user-input",
        placeholder: "User",
        value: user,
        onChange: (e) => onUserChange(e.currentTarget.value),
        required: true
      }
    )
  ), /* @__PURE__ */ React__default.createElement(
    InlineField,
    {
      className: cx(
        commonStyles.inlineFieldNoMarginRight,
        commonStyles.inlineFieldWithSecret,
        styles.lastInlineField
      ),
      label: "Password",
      labelWidth: 24,
      tooltip: passwordTooltip,
      required: true,
      htmlFor: "basic-auth-password-input",
      interactive: true,
      grow: true,
      disabled: readOnly
    },
    /* @__PURE__ */ React__default.createElement(
      SecretInput,
      {
        id: "basic-auth-password-input",
        isConfigured: passwordConfigured,
        onReset: readOnly ? () => {
        } : onPasswordReset,
        placeholder: "Password",
        onChange: (e) => onPasswordChange(e.currentTarget.value),
        required: true
      }
    )
  ));
};

export { BasicAuth };
//# sourceMappingURL=BasicAuth.js.map
