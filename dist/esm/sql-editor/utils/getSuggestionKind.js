function getSuggestionKinds(statementPosition, suggestionsKindRegistry) {
  let result = [];
  for (let i = 0; i < statementPosition.length; i++) {
    const exists = suggestionsKindRegistry.getIfExists(statementPosition[i]);
    if (exists) {
      result = result.concat(exists.kind);
    }
  }
  return result;
}

export { getSuggestionKinds };
//# sourceMappingURL=getSuggestionKind.js.map
