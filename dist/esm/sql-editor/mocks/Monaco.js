const getMonacoMock = (testData) => ({
  editor: {
    tokenize: (value, languageId) => testData.get(value)
  },
  Range: {
    containsPosition: (range, position) => {
      return position.lineNumber >= range.startLineNumber && position.lineNumber <= range.endLineNumber && position.column >= range.startColumn && position.column <= range.endColumn;
    }
  },
  languages: {
    CompletionItemKind: { Snippet: 2, Function: 1, Keyword: 3 },
    CompletionItemInsertTextRule: { InsertAsSnippet: 2 }
  }
});

export { getMonacoMock };
//# sourceMappingURL=Monaco.js.map
