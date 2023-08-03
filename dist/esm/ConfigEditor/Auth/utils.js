import { AuthMethod } from './types.js';

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
const headerNamePrefix = "httpHeaderName";
const headerValuePrefix = "httpHeaderValue";
function convertLegacyAuthProps({
  config,
  onChange
}) {
  const props = {
    selectedMethod: getSelectedMethod(config),
    onAuthMethodSelect: getOnAuthMethodSelectHandler(config, onChange),
    basicAuth: getBasicAuthProps(config, onChange),
    TLS: getTLSProps(config, onChange),
    customHeaders: getCustomHeaders(config, onChange),
    readOnly: config.readOnly
  };
  return props;
}
function getSelectedMethod(config) {
  if (config.basicAuth) {
    return AuthMethod.BasicAuth;
  }
  if (config.withCredentials) {
    return AuthMethod.CrossSiteCredentials;
  }
  if (config.jsonData.oauthPassThru) {
    return AuthMethod.OAuthForward;
  }
  return AuthMethod.NoAuth;
}
function getOnAuthMethodSelectHandler(config, onChange) {
  return (method) => {
    onChange(__spreadProps(__spreadValues({}, config), {
      basicAuth: method === AuthMethod.BasicAuth,
      withCredentials: method === AuthMethod.CrossSiteCredentials,
      jsonData: __spreadProps(__spreadValues({}, config.jsonData), {
        oauthPassThru: method === AuthMethod.OAuthForward
      })
    }));
  };
}
function getBasicAuthProps(config, onChange) {
  return {
    user: config.basicAuthUser,
    passwordConfigured: config.secureJsonFields.basicAuthPassword,
    onUserChange: (user) => onChange(__spreadProps(__spreadValues({}, config), { basicAuthUser: user })),
    onPasswordChange: (password) => onChange(__spreadProps(__spreadValues({}, config), {
      secureJsonData: __spreadProps(__spreadValues({}, config.secureJsonData), {
        basicAuthPassword: password
      })
    })),
    onPasswordReset: () => onChange(__spreadProps(__spreadValues({}, config), {
      secureJsonData: __spreadProps(__spreadValues({}, config.secureJsonData), { basicAuthPassword: "" }),
      secureJsonFields: __spreadProps(__spreadValues({}, config.secureJsonFields), {
        basicAuthPassword: false
      })
    }))
  };
}
function getTLSProps(config, onChange) {
  return {
    selfSignedCertificate: {
      enabled: Boolean(config.jsonData.tlsAuthWithCACert),
      certificateConfigured: config.secureJsonFields.tlsCACert,
      onToggle: (enabled) => onChange(__spreadProps(__spreadValues({}, config), {
        jsonData: __spreadProps(__spreadValues({}, config.jsonData), { tlsAuthWithCACert: enabled })
      })),
      onCertificateChange: (certificate) => onChange(__spreadProps(__spreadValues({}, config), {
        secureJsonData: __spreadProps(__spreadValues({}, config.secureJsonData), { tlsCACert: certificate })
      })),
      onCertificateReset: () => onChange(__spreadProps(__spreadValues({}, config), {
        secureJsonData: __spreadProps(__spreadValues({}, config.secureJsonData), { tlsCACert: "" }),
        secureJsonFields: __spreadProps(__spreadValues({}, config.secureJsonFields), { tlsCACert: false })
      }))
    },
    TLSClientAuth: {
      enabled: config.jsonData.tlsAuth,
      serverName: config.jsonData.serverName,
      clientCertificateConfigured: config.secureJsonFields.tlsClientCert,
      clientKeyConfigured: config.secureJsonFields.tlsClientKey,
      onToggle: (enabled) => onChange(__spreadProps(__spreadValues({}, config), {
        jsonData: __spreadProps(__spreadValues({}, config.jsonData), { tlsAuth: enabled })
      })),
      onServerNameChange: (serverName) => onChange(__spreadProps(__spreadValues({}, config), {
        jsonData: __spreadProps(__spreadValues({}, config.jsonData), { serverName })
      })),
      onClientCertificateChange: (clientCertificate) => onChange(__spreadProps(__spreadValues({}, config), {
        secureJsonData: __spreadProps(__spreadValues({}, config.secureJsonData), {
          tlsClientCert: clientCertificate
        })
      })),
      onClientCertificateReset: () => onChange(__spreadProps(__spreadValues({}, config), {
        secureJsonData: __spreadProps(__spreadValues({}, config.secureJsonData), {
          tlsClientCert: ""
        }),
        secureJsonFields: __spreadProps(__spreadValues({}, config.secureJsonFields), {
          tlsClientCert: false
        })
      })),
      onClientKeyChange: (clientKey) => onChange(__spreadProps(__spreadValues({}, config), {
        secureJsonData: __spreadProps(__spreadValues({}, config.secureJsonData), {
          tlsClientKey: clientKey
        })
      })),
      onClientKeyReset: () => onChange(__spreadProps(__spreadValues({}, config), {
        secureJsonData: __spreadProps(__spreadValues({}, config.secureJsonData), {
          tlsClientKey: ""
        }),
        secureJsonFields: __spreadProps(__spreadValues({}, config.secureJsonFields), {
          tlsClientKey: false
        })
      }))
    },
    skipTLSVerification: {
      enabled: config.jsonData.tlsSkipVerify,
      onToggle: (enabled) => onChange(__spreadProps(__spreadValues({}, config), {
        jsonData: __spreadProps(__spreadValues({}, config.jsonData), { tlsSkipVerify: enabled })
      }))
    }
  };
}
function getCustomHeaders(config, onChange) {
  const headers = Object.keys(config.jsonData).filter((key) => key.startsWith(headerNamePrefix)).sort().map((key) => {
    var _a;
    const index = key.slice(headerNamePrefix.length);
    return {
      name: config.jsonData[key],
      configured: (_a = config.secureJsonFields[`${headerValuePrefix}${index}`]) != null ? _a : false
    };
  });
  return {
    headers,
    onChange: (headers2) => {
      const newJsonData = Object.fromEntries(
        Object.entries(config.jsonData).filter(([key]) => !key.startsWith(headerNamePrefix))
      );
      const newSecureJsonData = Object.fromEntries(
        Object.entries(config.secureJsonData || {}).filter(([key]) => !key.startsWith(headerValuePrefix))
      );
      const newSecureJsonFields = Object.fromEntries(
        Object.entries(config.secureJsonFields).filter(([key]) => !key.startsWith(headerValuePrefix))
      );
      headers2.forEach((header, index) => {
        newJsonData[`${headerNamePrefix}${index + 1}`] = header.name;
        if (header.configured) {
          newSecureJsonFields[`${headerValuePrefix}${index + 1}`] = true;
        } else {
          newSecureJsonData[`${headerValuePrefix}${index + 1}`] = header.value;
        }
      });
      onChange(__spreadProps(__spreadValues({}, config), {
        jsonData: newJsonData,
        secureJsonData: newSecureJsonData,
        secureJsonFields: newSecureJsonFields
      }));
    }
  };
}

export { convertLegacyAuthProps, getBasicAuthProps, getCustomHeaders, getOnAuthMethodSelectHandler, getSelectedMethod, getTLSProps };
//# sourceMappingURL=utils.js.map
