// import {
//     CompletionItemInsertTextRule,
//     CompletionItemKind,
//     CompletionItemPriority,
//     LanguageCompletionProvider,
//     StatementPlacementProvider,
//     StatementPosition,
//     SuggestionKindProvider,
//     TokenType,
// } from '@grafana/experimental';
// import { PartitioningType } from 'api';

// // import { BQ_AGGREGATE_FNS } from './bigQueryFunctions';
// // import { BQ_OPERATORS } from './bigQueryOperators';


  
//   export const getStandardSQLCompletionProvider: () => LanguageCompletionProvider = () => () => ({
//     triggerCharacters: ['.', ' ', '$', ',', '(', "'"],
//     supportedFunctions: () => BQ_AGGREGATE_FNS,
//     supportedOperators: () => BQ_OPERATORS,
//     customStatementPlacement,
//   });
  
//   export enum CustomStatementPlacement {
//     AfterDataset = 'afterDataset',
//   }
  
//   export enum CustomSuggestionKind {
//     TablesWithinDataset = 'tablesWithinDataset',
//     Partition = 'partition',
//   }
  
//   export const customStatementPlacement: StatementPlacementProvider = () => [
//     {
//       id: CustomStatementPlacement.AfterDataset,
//       resolve: (currentToken, previousKeyword) => {
//         return Boolean(
//           currentToken?.is(TokenType.Delimiter, '.') ||
//             (currentToken?.is(TokenType.Whitespace) && currentToken?.previous?.is(TokenType.Delimiter, '.')) ||
//             (currentToken?.value === '`' && currentToken?.previous?.is(TokenType.Delimiter, '.')) ||
//             (currentToken?.value === '`' && isTypingTableIn(currentToken))
//         );
//       },
//     },
//     // Overriding default befaviour of AfterFrom resolver
//     {
//       id: StatementPosition.AfterFrom,
//       overrideDefault: true,
//       resolve: (currentToken) => {
//         const untilFrom = currentToken?.getPreviousUntil(TokenType.Keyword, [], 'from');
//         if (!untilFrom) {
//           return false;
//         }
//         let q = '';
//         for (let i = untilFrom?.length - 1; i >= 0; i--) {
//           q += untilFrom[i].value;
//         }
  
//         return q.startsWith('`') && q.endsWith('`');
//       },
//     },
//   ];
  
//   export const customSuggestionKinds: (
//     getTables: CompletionProviderGetterArgs['getTables'],
//     getTableSchema: CompletionProviderGetterArgs['getTableSchema']
//   ) => SuggestionKindProvider = (getTables, getTableSchema) => () => [
//     {
//       id: CustomSuggestionKind.TablesWithinDataset,
//       applyTo: [CustomStatementPlacement.AfterDataset],
//       suggestionsResolver: async (ctx) => {
//         const tablePath = ctx.currentToken ? getTablePath(ctx.currentToken) : '';
//         const t = await getTables.current(tablePath);
  
//         return t.map((table) => ({
//           label: table.name,
//           insertText: table.completion ?? table.name,
//           kind: CompletionItemKind.Field,
//           sortText: CompletionItemPriority.High,
//           range: {
//             ...ctx.range,
//             startColumn: ctx.range.endColumn,
//             endColumn: ctx.range.endColumn,
//           },
//         }));
//       },
//     },
  
//     {
//       id: CustomSuggestionKind.Partition,
//       applyTo: [StatementPosition.AfterFrom],
//       suggestionsResolver: async (ctx) => {
//         const tablePath = ctx.currentToken ? getTablePath(ctx.currentToken) : '';
//         const path = tablePath.split('.').filter((s) => s);
//         const suggestions = [];
  
//         if (path.length === 3) {
//           const schema = await getTableSchema.current(path[0], path[1], path[2]);
  
//           if (schema) {
//             const timePartitioningSetup = schema.timePartitioning;
//             if (timePartitioningSetup) {
//               if (timePartitioningSetup.field) {
//                 // TODO: add suport for field partitioning
//               }
  
//               if (timePartitioningSetup.type) {
//                 // Ingestion-time partition
//                 // https://cloud.google.com/bigquery/docs/querying-partitioned-tables#query_an_ingestion-time_partitioned_table
//                 suggestions.push({
//                   label: '_PARTITIONTIME BETWEEN',
//                   insertText: 'WHERE _PARTITIONTIME BETWEEN TIMESTAMP("$1") AND TIMESTAMP("$2")',
//                   kind: CompletionItemKind.Snippet,
//                   insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
//                   sortText: CompletionItemPriority.MediumLow,
//                 });
//                 suggestions.push({
//                   label: '_PARTITIONTIME EQUALS',
//                   insertText: 'WHERE DATE(_PARTITIONTIME) = "$1"',
//                   kind: CompletionItemKind.Snippet,
//                   insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
//                   sortText: CompletionItemPriority.MediumLow,
//                 });
  
//                 if (timePartitioningSetup.type && timePartitioningSetup.type === PartitioningType.Day) {
//                   suggestions.push({
//                     label: '_PARTITIONDATE BETWEEN',
//                     insertText: 'WHERE _PARTITIONDATE BETWEEN DATE("$1") AND DATE("$2")',
//                     kind: CompletionItemKind.Snippet,
//                     insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
//                     sortText: CompletionItemPriority.MediumLow,
//                   });
//                   suggestions.push({
//                     label: '_PARTITIONDATE EQUALS',
//                     insertText: 'WHERE DATE(_PARTITIONDATE) = "$1"',
//                     kind: CompletionItemKind.Snippet,
//                     insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
//                     sortText: CompletionItemPriority.MediumLow,
//                   });
//                 }
//               }
//             }
//           }
//         }
  
//         return suggestions;
//       },
//     },
//   ];
  