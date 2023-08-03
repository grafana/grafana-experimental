import { StatementPosition, TokenType } from '../types.js';
import { SELECT, WITH, AS, WHERE, BY, GROUP, FROM, AND, ORDER, DESC, ASC } from './language.js';

function initStatementPositionResolvers() {
  return [
    {
      id: StatementPosition.SelectKeyword,
      name: StatementPosition.SelectKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => Boolean(
        currentToken === null || currentToken.isWhiteSpace() && currentToken.previous === null || currentToken.is(TokenType.Keyword, SELECT) || currentToken.is(TokenType.Keyword, SELECT) && currentToken.previous === null || previousIsSlash || currentToken.isIdentifier() && (previousIsSlash || (currentToken == null ? void 0 : currentToken.previous) === null) || currentToken.isIdentifier() && SELECT.startsWith(currentToken.value.toLowerCase())
      )
    },
    {
      id: StatementPosition.WithKeyword,
      name: StatementPosition.WithKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => Boolean(
        currentToken === null || currentToken.isWhiteSpace() && currentToken.previous === null || currentToken.is(TokenType.Keyword, WITH) && currentToken.previous === null || currentToken.isIdentifier() && WITH.toLowerCase().startsWith(currentToken.value.toLowerCase())
      )
    },
    {
      id: StatementPosition.AfterSelectKeyword,
      name: StatementPosition.AfterSelectKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => Boolean((previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.value.toLowerCase()) === SELECT)
    },
    {
      id: StatementPosition.AfterSelectArguments,
      name: StatementPosition.AfterSelectArguments,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        return Boolean((previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === SELECT && (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.value) === ",");
      }
    },
    {
      id: StatementPosition.AfterSelectFuncFirstArgument,
      name: StatementPosition.AfterSelectFuncFirstArgument,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        return Boolean(
          ((previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === SELECT || (previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === AS) && ((previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Parenthesis, "(")) || (currentToken == null ? void 0 : currentToken.is(TokenType.Parenthesis, "()")))
        );
      }
    },
    {
      id: StatementPosition.AfterWhereFunctionArgument,
      name: StatementPosition.AfterWhereFunctionArgument,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        return Boolean(
          (previousKeyword == null ? void 0 : previousKeyword.is(TokenType.Keyword, WHERE)) && ((previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Parenthesis, "(")) || (currentToken == null ? void 0 : currentToken.is(TokenType.Parenthesis, "()")))
        );
      }
    },
    {
      id: StatementPosition.AfterGroupBy,
      name: StatementPosition.AfterGroupBy,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        var _a;
        return Boolean(
          (previousKeyword == null ? void 0 : previousKeyword.is(TokenType.Keyword, BY)) && ((_a = previousKeyword == null ? void 0 : previousKeyword.getPreviousKeyword()) == null ? void 0 : _a.is(TokenType.Keyword, GROUP)) && ((previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isIdentifier()) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isDoubleQuotedString()) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Parenthesis, ")")) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Parenthesis, "()")))
        );
      }
    },
    {
      id: StatementPosition.SelectAlias,
      name: StatementPosition.SelectAlias,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        if ((previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.value) === "," && (previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === AS) {
          return true;
        }
        return false;
      }
    },
    {
      id: StatementPosition.FromKeyword,
      name: StatementPosition.FromKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        return Boolean(
          (previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === SELECT && (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.value) !== "," || ((currentToken == null ? void 0 : currentToken.isKeyword()) || (currentToken == null ? void 0 : currentToken.isIdentifier())) && FROM.toLowerCase().startsWith(currentToken.value.toLowerCase())
        );
      }
    },
    {
      id: StatementPosition.AfterFromKeyword,
      name: StatementPosition.AfterFromKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => Boolean(!(currentToken == null ? void 0 : currentToken.value.includes(".")) && (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.value.toLowerCase()) === FROM)
    },
    {
      id: StatementPosition.AfterSchema,
      name: StatementPosition.AfterSchema,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        if ((currentToken == null ? void 0 : currentToken.isWhiteSpace()) && (currentToken == null ? void 0 : currentToken.next)) {
          currentToken = currentToken == null ? void 0 : currentToken.previous;
          previousNonWhiteSpace = currentToken.getPreviousNonWhiteSpaceToken();
        }
        return Boolean(
          (currentToken == null ? void 0 : currentToken.isIdentifier()) && (currentToken == null ? void 0 : currentToken.value.endsWith(".")) && (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.value.toLowerCase()) === FROM
        );
      }
    },
    {
      id: StatementPosition.AfterFrom,
      name: StatementPosition.AfterFrom,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => Boolean(
        (previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === FROM && (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isDoubleQuotedString()) || (previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === FROM && (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isIdentifier()) || (previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === FROM && (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isVariable())
        //  cloudwatch specific
        // (previousKeyword?.value === SCHEMA && previousNonWhiteSpace?.is(TokenType.Parenthesis, ')'))
      )
    },
    {
      id: StatementPosition.AfterTable,
      name: StatementPosition.AfterTable,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        return Boolean(
          (previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === FROM && ((previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isVariable()) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.value) !== "" && (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.value.toLowerCase()) !== FROM)
        );
      }
    },
    {
      id: StatementPosition.WhereKeyword,
      name: StatementPosition.WhereKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => Boolean(
        (previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === WHERE && ((previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isKeyword()) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Parenthesis, "(")) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Operator, AND)))
      )
    },
    {
      id: StatementPosition.WhereComparisonOperator,
      name: StatementPosition.WhereComparisonOperator,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        var _a;
        return Boolean(
          (previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === WHERE && !((_a = previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.getPreviousNonWhiteSpaceToken()) == null ? void 0 : _a.isOperator()) && !(currentToken == null ? void 0 : currentToken.is(TokenType.Delimiter, ".")) && !(currentToken == null ? void 0 : currentToken.isParenthesis()) && ((previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isIdentifier()) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isDoubleQuotedString()))
        );
      }
    },
    {
      id: StatementPosition.WhereValue,
      name: StatementPosition.WhereValue,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => Boolean((previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === WHERE && (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isOperator()))
    },
    {
      id: StatementPosition.AfterWhereValue,
      name: StatementPosition.AfterWhereValue,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        var _a, _b, _c;
        return Boolean(
          (previousKeyword == null ? void 0 : previousKeyword.value.toLowerCase()) === WHERE && ((previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Operator, "and")) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Operator, "or")) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isString()) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isNumber()) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Parenthesis, ")")) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Parenthesis, "()")) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.isTemplateVariable()) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.IdentifierQuote)) && ((_a = previousNonWhiteSpace.getPreviousNonWhiteSpaceToken()) == null ? void 0 : _a.is(TokenType.Identifier)) && ((_c = (_b = previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.getPreviousNonWhiteSpaceToken()) == null ? void 0 : _b.getPreviousNonWhiteSpaceToken()) == null ? void 0 : _c.is(TokenType.IdentifierQuote)))
        );
      }
    },
    {
      id: StatementPosition.AfterGroupByKeywords,
      name: StatementPosition.AfterGroupByKeywords,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        var _a;
        return Boolean(
          (previousKeyword == null ? void 0 : previousKeyword.is(TokenType.Keyword, BY)) && ((_a = previousKeyword == null ? void 0 : previousKeyword.getPreviousKeyword()) == null ? void 0 : _a.is(TokenType.Keyword, GROUP)) && ((previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Keyword, BY)) || (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Delimiter, ",")))
        );
      }
    },
    {
      id: StatementPosition.AfterGroupByFunctionArgument,
      name: StatementPosition.AfterGroupByFunctionArgument,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        var _a;
        return Boolean(
          (previousKeyword == null ? void 0 : previousKeyword.is(TokenType.Keyword, BY)) && ((_a = previousKeyword == null ? void 0 : previousKeyword.getPreviousKeyword()) == null ? void 0 : _a.is(TokenType.Keyword, GROUP)) && ((previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Parenthesis, "(")) || (currentToken == null ? void 0 : currentToken.is(TokenType.Parenthesis, "()")))
        );
      }
    },
    {
      id: StatementPosition.AfterOrderByKeywords,
      name: StatementPosition.AfterOrderByKeywords,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        var _a;
        return Boolean(
          (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Keyword, BY)) && ((_a = previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.getPreviousKeyword()) == null ? void 0 : _a.is(TokenType.Keyword, ORDER))
        );
      }
    },
    {
      id: StatementPosition.AfterOrderByFunction,
      name: StatementPosition.AfterOrderByFunction,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        var _a, _b;
        return Boolean(
          (previousKeyword == null ? void 0 : previousKeyword.is(TokenType.Keyword, BY)) && ((_a = previousKeyword == null ? void 0 : previousKeyword.getPreviousKeyword()) == null ? void 0 : _a.is(TokenType.Keyword, ORDER)) && (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Parenthesis)) && ((_b = previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.getPreviousNonWhiteSpaceToken()) == null ? void 0 : _b.is(TokenType.Function))
        );
      }
    },
    {
      id: StatementPosition.AfterOrderByDirection,
      name: StatementPosition.AfterOrderByDirection,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => Boolean((previousKeyword == null ? void 0 : previousKeyword.is(TokenType.Keyword, DESC)) || (previousKeyword == null ? void 0 : previousKeyword.is(TokenType.Keyword, ASC)))
    },
    {
      id: StatementPosition.AfterIsOperator,
      name: StatementPosition.AfterIsOperator,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        return Boolean(previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Operator, "IS"));
      }
    },
    {
      id: StatementPosition.AfterIsNotOperator,
      name: StatementPosition.AfterIsNotOperator,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        var _a;
        return Boolean(
          (previousNonWhiteSpace == null ? void 0 : previousNonWhiteSpace.is(TokenType.Operator, "NOT")) && ((_a = previousNonWhiteSpace.getPreviousNonWhiteSpaceToken()) == null ? void 0 : _a.is(TokenType.Operator, "IS"))
        );
      }
    }
  ];
}

export { initStatementPositionResolvers };
//# sourceMappingURL=statementPositionResolversRegistry.js.map
