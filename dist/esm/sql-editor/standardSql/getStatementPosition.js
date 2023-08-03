import { TokenType, StatementPosition } from '../types.js';

function getStatementPosition(currentToken, statementPositionResolversRegistry) {
  var _a;
  const previousNonWhiteSpace = currentToken == null ? void 0 : currentToken.getPreviousNonWhiteSpaceToken();
  const previousKeyword = currentToken == null ? void 0 : currentToken.getPreviousKeyword();
  const previousIsSlash = (_a = currentToken == null ? void 0 : currentToken.getPreviousNonWhiteSpaceToken()) == null ? void 0 : _a.is(TokenType.Operator, "/");
  const resolvers = statementPositionResolversRegistry.list();
  const positions = [];
  for (const resolver of resolvers) {
    if (resolver.resolve(currentToken, previousKeyword != null ? previousKeyword : null, previousNonWhiteSpace != null ? previousNonWhiteSpace : null, Boolean(previousIsSlash))) {
      positions.push(resolver.id);
    }
  }
  if (positions.length === 0) {
    return [StatementPosition.Unknown];
  }
  return positions;
}

export { getStatementPosition };
//# sourceMappingURL=getStatementPosition.js.map
