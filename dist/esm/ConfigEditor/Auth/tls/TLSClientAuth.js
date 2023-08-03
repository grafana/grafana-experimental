import React__default from 'react';
import { cx } from '@emotion/css';
import { InlineField, Input } from '@grafana/ui';
import { SecretTextArea } from '../common/SecretTextarea.js';
import { TLSSettingsSection } from './TLSSettingsSection.js';
import { useCommonStyles } from '../styles.js';

const TLSClientAuth = ({
  enabled,
  serverName,
  clientCertificateConfigured,
  clientKeyConfigured,
  onToggle,
  onServerNameChange,
  onClientCertificateChange,
  onClientKeyChange,
  onClientCertificateReset,
  onClientKeyReset,
  tooltips,
  readOnly
}) => {
  var _a, _b, _c;
  const commonStyles = useCommonStyles();
  return /* @__PURE__ */ React__default.createElement(
    TLSSettingsSection,
    {
      enabled,
      label: "TLS Client Authentication",
      tooltipText: "Validate using TLS client authentication, in which the server authenticates the client",
      onToggle: (newEnabled) => onToggle(newEnabled),
      readOnly
    },
    /* @__PURE__ */ React__default.createElement(
      InlineField,
      {
        label: "ServerName",
        labelWidth: 24,
        tooltip: (_a = tooltips == null ? void 0 : tooltips.serverNameLabel) != null ? _a : "A Servername is used to verify the hostname on the returned certificate",
        required: true,
        htmlFor: "client-auth-servername-input",
        interactive: true,
        grow: true,
        className: commonStyles.inlineFieldNoMarginRight,
        disabled: readOnly
      },
      /* @__PURE__ */ React__default.createElement(
        Input,
        {
          id: "client-auth-servername-input",
          placeholder: "domain.example.com",
          value: serverName,
          onChange: (e) => onServerNameChange(e.currentTarget.value),
          required: true
        }
      )
    ),
    /* @__PURE__ */ React__default.createElement(
      InlineField,
      {
        label: "Client Certificate",
        labelWidth: 24,
        tooltip: (_b = tooltips == null ? void 0 : tooltips.certificateLabel) != null ? _b : "The client certificate can be generated from a Certificate Authority or be self-signed",
        required: true,
        htmlFor: "client-auth-client-certificate-input",
        interactive: true,
        grow: true,
        className: cx(commonStyles.inlineFieldNoMarginRight, commonStyles.inlineFieldWithSecret),
        disabled: readOnly
      },
      /* @__PURE__ */ React__default.createElement(
        SecretTextArea,
        {
          id: "client-auth-client-certificate-input",
          isConfigured: clientCertificateConfigured,
          onChange: (e) => onClientCertificateChange(e.currentTarget.value),
          onReset: readOnly ? () => {
          } : onClientCertificateReset,
          placeholder: "Begins with --- BEGIN CERTIFICATE ---",
          rows: 6,
          required: true
        }
      )
    ),
    /* @__PURE__ */ React__default.createElement(
      InlineField,
      {
        label: "Client Key",
        labelWidth: 24,
        tooltip: (_c = tooltips == null ? void 0 : tooltips.keyLabel) != null ? _c : "The client key can be generated from a Certificate Authority or be self-signed",
        required: true,
        htmlFor: "client-auth-client-key-input",
        interactive: true,
        grow: true,
        className: cx(commonStyles.inlineFieldNoMarginRight, commonStyles.inlineFieldWithSecret),
        disabled: readOnly
      },
      /* @__PURE__ */ React__default.createElement(
        SecretTextArea,
        {
          id: "client-auth-client-key-input",
          isConfigured: clientKeyConfigured,
          onChange: (e) => onClientKeyChange(e.currentTarget.value),
          onReset: readOnly ? () => {
          } : onClientKeyReset,
          placeholder: `Begins with --- RSA PRIVATE KEY CERTIFICATE ---`,
          rows: 6,
          required: true
        }
      )
    )
  );
};

export { TLSClientAuth };
//# sourceMappingURL=TLSClientAuth.js.map
