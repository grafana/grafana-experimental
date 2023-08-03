import { OperatorType } from '../types.js';
import { MACROS } from './macros.js';

function getStandardSQLCompletionProvider(monaco, language) {
  var _a, _b, _c;
  const provider = { triggerCharacters: [".", " ", "$", ",", "(", "'"] };
  if (language && Array.isArray(language.builtinFunctions)) {
    provider.supportedFunctions = () => language.builtinFunctions.map((f) => ({ id: f, name: f }));
  }
  const operators = [];
  if ((_a = language == null ? void 0 : language.comparisonOperators) == null ? void 0 : _a.length) {
    operators.push(
      ...language.comparisonOperators.map((f) => ({
        id: f.toLocaleLowerCase(),
        operator: f,
        type: OperatorType.Comparison
      }))
    );
  }
  language.logicalOperators = (_b = language.logicalOperators) != null ? _b : language.operators;
  if ((_c = language == null ? void 0 : language.logicalOperators) == null ? void 0 : _c.length) {
    operators.push(
      ...language.logicalOperators.map((f) => ({ id: f.toLocaleLowerCase(), operator: f, type: OperatorType.Logical }))
    );
  }
  provider.supportedOperators = () => operators;
  provider.supportedMacros = () => MACROS;
  return provider;
}

export { getStandardSQLCompletionProvider };
//# sourceMappingURL=standardSQLCompletionItemProvider.js.map
