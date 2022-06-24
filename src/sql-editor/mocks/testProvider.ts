import { LanguageCompletionProvider, StatementPlacementProvider, TokenType, SuggestionKindProvider, StatementPosition, CompletionItemPriority, PositionContext, CompletionItemKind } from '../index';
import { LinkedToken } from '../utils/LinkedToken';

export const getTestProvider: () => LanguageCompletionProvider =
  () =>
  () => ({
    triggerCharacters: ['.', ' ', '$', ',', '(', "'"],
    supportedFunctions: () => [],
    supportedOperators: () => [],
    customSuggestionKinds: customSuggestionKinds(),
    customStatementPlacement,
  });

export enum CustomStatementPlacement {
  AfterDataset = 'afterDataset',
  AfterFrom = 'afterFrom',
}

export enum CustomSuggestionKind {
  TablesWithinDataset = 'tablesWithinDataset',
}

const TRIGGER_SUGGEST = 'editor.action.triggerSuggest';

enum Keyword {
  Where = 'WHERE',
  From = 'FROM',
}

export const customStatementPlacement: StatementPlacementProvider = () => [
  {
    id: CustomStatementPlacement.AfterDataset,
    resolve: (currentToken, previousKeyword) => {
      return Boolean(
        currentToken?.is(TokenType.Delimiter, '.') ||
          (currentToken?.is(TokenType.Whitespace) && currentToken?.previous?.is(TokenType.Delimiter, '.'))
      );
    },
  },
  {
    id: CustomStatementPlacement.AfterFrom,
    resolve: (currentToken, previousKeyword) => {
      return Boolean(isAfterFrom(currentToken));
    },
  },
];

export const customSuggestionKinds: (
) => SuggestionKindProvider = () => () =>
  [
    {
      id: CustomSuggestionKind.TablesWithinDataset,
      applyTo: [CustomStatementPlacement.AfterDataset],
      suggestionsResolver: async (ctx) => {
        const t = await Promise.resolve([{name: 'table1', completion: 'table1'}])
        return t.map((table) => suggestion(table.name, table.completion ?? table.name, CompletionItemKind.Field, ctx));
      },
    },
    {
      id: `Custom${StatementPosition.WhereKeyword}`,
      applyTo: [StatementPosition.WhereKeyword],
      suggestionsResolver: async (ctx) => {
        const t = await Promise.resolve([{name: 'meta', completion: 'meta'}])
        return t.map((table) => suggestion(table.name, table.completion ?? table.name, CompletionItemKind.Field, ctx));
      },
    },
    {
      id: 'metaAfterSelect',
      applyTo: [StatementPosition.AfterSelectKeyword],
      suggestionsResolver: async (ctx) => {
        const t = await Promise.resolve([{kind: CompletionItemKind.Class, completion: 'meta', name: 'meta'}])
        return t.map((meta) => {
          const completion = meta.kind === CompletionItemKind.Class ? `${meta.completion}.` : meta.completion;
          return suggestion(meta.name, completion!, meta.kind, ctx);
        });
      },
    },
  ];

export function getTablePath(token: LinkedToken) {
  let processedToken = token;
  let tablePath = '';
  while (processedToken?.previous && !processedToken.previous.isWhiteSpace()) {
    processedToken = processedToken.previous;
    tablePath = processedToken.value + tablePath;
  }

  tablePath = tablePath.trim();
  return tablePath;
}

function suggestion(label: string, completion: string, kind: CompletionItemKind, ctx: PositionContext) {
  return {
    label,
    insertText: completion,
    command: { id: TRIGGER_SUGGEST, title: '' },
    kind,
    sortText: CompletionItemPriority.High,
    range: {
      ...ctx.range,
      startColumn: ctx.range.endColumn,
      endColumn: ctx.range.endColumn,
    },
  };
}

function isAfterFrom(token: LinkedToken | null) {
  return isAfter(token, Keyword.From);
}

// function isAfterWhere(token: LinkedToken | null) {
//   return isAfter(token, Keyword.Where);
// }

function isAfter(token: LinkedToken | null, keyword: string) {
  return token?.is(TokenType.Whitespace) && token?.previous?.is(TokenType.Keyword, keyword);
}
