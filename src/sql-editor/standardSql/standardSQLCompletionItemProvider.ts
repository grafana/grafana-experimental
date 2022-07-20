import { Monaco } from '@grafana/ui';
import { Operator, OperatorType, SQLCompletionItemProvider } from 'sql-editor/types';
import { SQLMonarchLanguage } from './types';

export function getStandardSQLCompletionProvider(
  monaco: Monaco,
  language: SQLMonarchLanguage
): SQLCompletionItemProvider {
  const provider: SQLCompletionItemProvider = { triggerCharacters: ['.', ' ', '$', ',', '(', "'"] };
  if (language?.builtinFunctions.length) {
    provider.supportedFunctions = () => language.builtinFunctions.map((f) => ({ id: f, name: f }));
  }

  const operators: Array<Operator> = [];
  if (language?.comparisonOperators.length) {
    operators.push(
      ...language.comparisonOperators.map((f) => ({
        id: f.toLocaleLowerCase(),
        operator: f,
        type: OperatorType.Comparison,
      }))
    );
  }

  if (language?.logicalOperators.length) {
    operators.push(
      ...language.logicalOperators.map((f) => ({ id: f.toLocaleLowerCase(), operator: f, type: OperatorType.Logical }))
    );
  }

  provider.supportedOperators = () => operators;

  return provider;
}
