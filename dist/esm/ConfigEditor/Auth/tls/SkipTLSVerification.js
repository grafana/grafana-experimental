import React__default from 'react';
import { TLSSettingsSection } from './TLSSettingsSection.js';

const SkipTLSVerification = ({ enabled, onToggle, readOnly }) => {
  return /* @__PURE__ */ React__default.createElement(
    TLSSettingsSection,
    {
      enabled,
      label: "Skip TLS certificate validation",
      tooltipText: "Skipping TLS certificate validation is not recommended unless absolutely necessary or for testing",
      onToggle: (newEnabled) => onToggle(newEnabled),
      readOnly
    }
  );
};

export { SkipTLSVerification };
//# sourceMappingURL=SkipTLSVerification.js.map
