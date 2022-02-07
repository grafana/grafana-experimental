import { StatementPosition, TokenType } from '../types';
import { AND, ASC, BY, DESC, EQUALS, FROM, GROUP, NOT_EQUALS, ORDER, SELECT, WHERE, WITH } from './language';
import { StatementPositionResolversRegistryItem } from './types';

export function initStatementPositionResolvers(): StatementPositionResolversRegistryItem[] {
  return [
    {
      id: StatementPosition.SelectKeyword,
      name: StatementPosition.SelectKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(
          currentToken === null ||
            (currentToken.isWhiteSpace() && currentToken.previous === null) ||
            currentToken.is(TokenType.Keyword, SELECT) ||
            (currentToken.is(TokenType.Keyword, SELECT) && currentToken.previous === null) ||
            previousIsSlash ||
            (currentToken.isIdentifier() && (previousIsSlash || currentToken?.previous === null)) ||
            (currentToken.isIdentifier() && SELECT.startsWith(currentToken.value))
        ),
    },
    {
      id: StatementPosition.WithKeyword,
      name: StatementPosition.WithKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(
          currentToken === null ||
            (currentToken.isWhiteSpace() && currentToken.previous === null) ||
            (currentToken.is(TokenType.Keyword, WITH) && currentToken.previous === null) ||
            (currentToken.isIdentifier() && WITH.toLowerCase().startsWith(currentToken.value.toLowerCase()))
        ),
    },
    {
      id: StatementPosition.AfterSelectKeyword,
      name: StatementPosition.AfterSelectKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(previousNonWhiteSpace?.value === SELECT),
    },
    {
      id: StatementPosition.AfterSelectArguments,
      name: StatementPosition.AfterSelectArguments,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        return Boolean(previousKeyword?.value === SELECT && previousNonWhiteSpace?.value === ',');
      },
    },
    {
      id: StatementPosition.AfterSelectFuncFirstArgument,
      name: StatementPosition.AfterSelectFuncFirstArgument,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        return Boolean(
          (previousKeyword?.value.toLowerCase() === 'select' || previousKeyword?.value.toLowerCase() === 'as')  &&
            (previousNonWhiteSpace?.is(TokenType.Parenthesis, '(') || currentToken?.is(TokenType.Parenthesis, '()'))
        );
      },
    },
    {
      id: StatementPosition.SelectAlias,
      name: StatementPosition.SelectAlias,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        if (previousNonWhiteSpace?.value === ',' && previousKeyword?.value.toLowerCase() === 'as') {
          return true
        }
  
        return false;
      },
    },

    {
      id: StatementPosition.FromKeyword,
      name: StatementPosition.FromKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        // cloudwatch specific commented out
        // Boolean(previousKeyword?.value === SELECT && previousNonWhiteSpace?.isParenthesis()),

        return Boolean(
          (previousKeyword?.value === SELECT && previousNonWhiteSpace?.value !== ',') ||
            ((currentToken?.isKeyword() || currentToken?.isIdentifier()) &&
              FROM.toLowerCase().startsWith(currentToken.value.toLowerCase()))
        );
      },
    },
    {
      id: StatementPosition.AfterFromKeyword,
      name: StatementPosition.AfterFromKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(previousNonWhiteSpace?.value === FROM),
    },
    {
      id: StatementPosition.AfterFrom,
      name: StatementPosition.AfterFrom,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(
          (previousKeyword?.value === FROM && previousNonWhiteSpace?.isDoubleQuotedString()) ||
            (previousKeyword?.value === FROM && previousNonWhiteSpace?.isIdentifier()) ||
            (previousKeyword?.value === FROM && previousNonWhiteSpace?.isVariable())
            //  cloudwatch specific
            // (previousKeyword?.value === SCHEMA && previousNonWhiteSpace?.is(TokenType.Parenthesis, ')'))
        ),
    },
    {
      id: StatementPosition.AfterTable,
      name: StatementPosition.AfterTable,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        return Boolean(
          previousKeyword?.value === FROM &&
            (previousNonWhiteSpace?.isVariable() || previousNonWhiteSpace?.value !== '')
        );
      },
    },
    {
      id: StatementPosition.WhereKeyword,
      name: StatementPosition.WhereKeyword,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(
          previousKeyword?.value === WHERE &&
            (previousNonWhiteSpace?.isKeyword() ||
              previousNonWhiteSpace?.is(TokenType.Parenthesis, '(') ||
              previousNonWhiteSpace?.is(TokenType.Operator, AND))
        ),
    },
    {
      id: StatementPosition.WhereComparisonOperator,
      name: StatementPosition.WhereComparisonOperator,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(
          previousKeyword?.value === WHERE &&
            (previousNonWhiteSpace?.isIdentifier() || previousNonWhiteSpace?.isDoubleQuotedString())
        ),
    },
    {
      id: StatementPosition.WhereValue,
      name: StatementPosition.WhereValue,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(
          previousKeyword?.value === WHERE &&
            (previousNonWhiteSpace?.is(TokenType.Operator, EQUALS) ||
              previousNonWhiteSpace?.is(TokenType.Operator, NOT_EQUALS))
        ),
    },
    {
      id: StatementPosition.AfterWhereValue,
      name: StatementPosition.AfterWhereValue,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) => {
        return Boolean(
          previousKeyword?.value === WHERE &&
            (previousNonWhiteSpace?.isString() ||
              previousNonWhiteSpace?.isNumber() ||
              (previousNonWhiteSpace?.is(TokenType.IdentifierQuote) &&
                previousNonWhiteSpace.getPreviousNonWhiteSpaceToken()?.is(TokenType.Identifier) &&
                previousNonWhiteSpace
                  ?.getPreviousNonWhiteSpaceToken()
                  ?.getPreviousNonWhiteSpaceToken()
                  ?.is(TokenType.IdentifierQuote)))
          // cloudwatch specific?
          // || previousNonWhiteSpace?.is(TokenType.Parenthesis, ')')
        );
      },
    },
    {
      id: StatementPosition.AfterGroupByKeywords,
      name: StatementPosition.AfterGroupByKeywords,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(
          previousKeyword?.is(TokenType.Keyword, BY) &&
            previousKeyword?.getPreviousKeyword()?.is(TokenType.Keyword, GROUP) &&
            (previousNonWhiteSpace?.is(TokenType.Keyword, BY) || previousNonWhiteSpace?.is(TokenType.Delimiter, ','))
        ),
    },
    {
      id: StatementPosition.AfterGroupBy,
      name: StatementPosition.AfterGroupBy,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(
          previousKeyword?.is(TokenType.Keyword, BY) &&
            previousKeyword?.getPreviousKeyword()?.is(TokenType.Keyword, GROUP) &&
            (previousNonWhiteSpace?.isIdentifier() || previousNonWhiteSpace?.isDoubleQuotedString())
        ),
    },
    {
      id: StatementPosition.AfterOrderByKeywords,
      name: StatementPosition.AfterOrderByKeywords,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(
          previousNonWhiteSpace?.is(TokenType.Keyword, BY) &&
            previousNonWhiteSpace?.getPreviousKeyword()?.is(TokenType.Keyword, ORDER)
        ),
    },
    {
      id: StatementPosition.AfterOrderByFunction,
      name: StatementPosition.AfterOrderByFunction,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(
          previousKeyword?.is(TokenType.Keyword, BY) &&
            previousKeyword?.getPreviousKeyword()?.is(TokenType.Keyword, ORDER) &&
            previousNonWhiteSpace?.is(TokenType.Parenthesis) &&
            previousNonWhiteSpace?.getPreviousNonWhiteSpaceToken()?.is(TokenType.Function)
        ),
    },
    {
      id: StatementPosition.AfterOrderByDirection,
      name: StatementPosition.AfterOrderByDirection,
      resolve: (currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash) =>
        Boolean(previousKeyword?.is(TokenType.Keyword, DESC) || previousKeyword?.is(TokenType.Keyword, ASC)),
    },
    {
      id: StatementPosition.AfterIsOperator,
      name: StatementPosition.AfterIsOperator,
      resolve: ( currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash ) => {
        return Boolean(previousNonWhiteSpace?.is(TokenType.Operator, 'IS'))
      }
    },
    {
      id: StatementPosition.AfterIsNotOperator,
      name: StatementPosition.AfterIsNotOperator,
      resolve: ( currentToken, previousKeyword, previousNonWhiteSpace, previousIsSlash ) => {
        return Boolean(previousNonWhiteSpace?.is(TokenType.Operator, 'NOT') && previousNonWhiteSpace.getPreviousNonWhiteSpaceToken()?.is(TokenType.Operator, 'IS'))
      }
    }

  ];
}
