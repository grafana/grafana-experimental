import { toCompletionItem } from '../utils/toCompletionItem.js';

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
const getStandardSuggestions = async (monaco, currentToken, suggestionKinds, positionContext, suggestionsRegistry) => {
  let suggestions = [];
  const invalidRangeToken = (currentToken == null ? void 0 : currentToken.isWhiteSpace()) || (currentToken == null ? void 0 : currentToken.isParenthesis()) || (currentToken == null ? void 0 : currentToken.isIdentifier()) && currentToken.value.endsWith(".");
  const range = invalidRangeToken || !(currentToken == null ? void 0 : currentToken.range) ? monaco.Range.fromPositions(positionContext.position) : currentToken == null ? void 0 : currentToken.range;
  for (const suggestion of [...new Set(suggestionKinds)]) {
    const registeredSuggestions = suggestionsRegistry.getIfExists(suggestion);
    if (registeredSuggestions) {
      const su = await registeredSuggestions.suggestions(__spreadProps(__spreadValues({}, positionContext), { range }), monaco);
      suggestions = [...suggestions, ...su.map((s) => toCompletionItem(s.label, range, __spreadValues({ kind: s.kind }, s)))];
    }
  }
  return Promise.resolve(suggestions);
};

export { getStandardSuggestions };
//# sourceMappingURL=getStandardSuggestions.js.map
