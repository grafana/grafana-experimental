import { getStandardSQLCompletionProvider } from './standardSQLCompletionItemProvider.js';

const standardSQLLanguageDefinition = {
  id: "standardSql",
  extensions: [".sql"],
  aliases: ["sql"],
  mimetypes: [],
  loader: () => import('./language.js'),
  completionProvider: getStandardSQLCompletionProvider
};

export { standardSQLLanguageDefinition as default };
//# sourceMappingURL=definition.js.map
