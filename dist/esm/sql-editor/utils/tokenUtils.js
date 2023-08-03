import { FROM, SELECT } from '../standardSql/language.js';
import { TokenType } from '../types.js';

const getSelectToken = (currentToken) => {
  var _a;
  return (_a = currentToken == null ? void 0 : currentToken.getPreviousOfType(TokenType.Keyword, SELECT)) != null ? _a : null;
};
const getFromKeywordToken = (currentToken) => {
  const selectToken = getSelectToken(currentToken);
  return selectToken == null ? void 0 : selectToken.getNextOfType(TokenType.Keyword, FROM);
};
const getTableToken = (currentToken) => {
  var _a;
  const fromToken = getFromKeywordToken(currentToken);
  const nextNonWhiteSpace = fromToken == null ? void 0 : fromToken.getNextNonWhiteSpaceToken();
  if (nextNonWhiteSpace == null ? void 0 : nextNonWhiteSpace.isVariable()) {
    return null;
  } else if ((nextNonWhiteSpace == null ? void 0 : nextNonWhiteSpace.isKeyword()) && ((_a = nextNonWhiteSpace.next) == null ? void 0 : _a.is(TokenType.Parenthesis, "("))) {
    return null;
  } else {
    return nextNonWhiteSpace;
  }
};
const defaultTableNameParser = (token) => {
  const parts = token == null ? void 0 : token.value.split(".");
  if ((parts == null ? void 0 : parts.length) === 1) {
    return { table: parts[0] };
  } else if ((parts == null ? void 0 : parts.length) === 2) {
    return { schema: parts[0], table: parts[1] };
  }
  return null;
};

export { defaultTableNameParser, getFromKeywordToken, getSelectToken, getTableToken };
//# sourceMappingURL=tokenUtils.js.map
