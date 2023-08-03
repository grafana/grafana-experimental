'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var data = require('@grafana/data');
var runtime = require('@grafana/runtime');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var ui = require('@grafana/ui');
var React = require('react');
var uuid = require('uuid');
var css = require('@emotion/css');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var React__namespace = /*#__PURE__*/_interopNamespace(React);

const LLM_PLUGIN_ID = "grafana-llm-app";
const LLM_PLUGIN_ROUTE = `/api/plugins/${LLM_PLUGIN_ID}`;
const OPENAI_CHAT_COMPLETIONS_PATH = "openai/v1/chat/completions";
function isContentMessage(message) {
  return message.content != null;
}
function isDoneMessage(message) {
  return message.done !== void 0;
}
function extractContent() {
  return rxjs.pipe(
    operators.filter((response) => isContentMessage(response.choices[0].delta)),
    // The type assertion is needed here because the type predicate above doesn't seem to propagate.
    operators.map((response) => response.choices[0].delta.content)
  );
}
function accumulateContent() {
  return rxjs.pipe(
    extractContent(),
    operators.scan((acc, curr) => acc + curr, "")
  );
}
async function chatCompletions(request) {
  const response = await runtime.getBackendSrv().post("/api/plugins/grafana-llm-app/resources/openai/v1/chat/completions", request, {
    headers: { "Content-Type": "application/json" }
  });
  return response;
}
function streamChatCompletions(request) {
  const channel = {
    scope: data.LiveChannelScope.Plugin,
    namespace: LLM_PLUGIN_ID,
    path: OPENAI_CHAT_COMPLETIONS_PATH,
    data: request
  };
  const messages = runtime.getGrafanaLiveSrv().getStream(channel).pipe(operators.filter((event) => data.isLiveChannelMessageEvent(event)));
  return messages.pipe(
    operators.takeWhile((event) => !isDoneMessage(event.message.choices[0].delta)),
    operators.map((event) => event.message)
  );
}
let loggedWarning = false;
const enabled = async () => {
  var _a, _b;
  try {
    const settings = await runtime.getBackendSrv().get(`${LLM_PLUGIN_ROUTE}/settings`, void 0, void 0, {
      showSuccessAlert: false,
      showErrorAlert: false
    });
    return settings.enabled && ((_b = (_a = settings == null ? void 0 : settings.secureJsonFields) == null ? void 0 : _a.openAIKey) != null ? _b : false);
  } catch (e) {
    if (!loggedWarning) {
      runtime.logDebug(String(e));
      runtime.logDebug("Failed to check if OpenAI is enabled. This is expected if the Grafana LLM plugin is not installed, and the above error can be ignored.");
      loggedWarning = true;
    }
    return false;
  }
};

var openai = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isContentMessage: isContentMessage,
  isDoneMessage: isDoneMessage,
  extractContent: extractContent,
  accumulateContent: accumulateContent,
  chatCompletions: chatCompletions,
  streamChatCompletions: streamChatCompletions,
  enabled: enabled
});

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  openai: openai
});

var OperatorType = /* @__PURE__ */ ((OperatorType2) => {
  OperatorType2[OperatorType2["Comparison"] = 0] = "Comparison";
  OperatorType2[OperatorType2["Logical"] = 1] = "Logical";
  return OperatorType2;
})(OperatorType || {});
var MacroType = /* @__PURE__ */ ((MacroType2) => {
  MacroType2[MacroType2["Value"] = 0] = "Value";
  MacroType2[MacroType2["Filter"] = 1] = "Filter";
  MacroType2[MacroType2["Group"] = 2] = "Group";
  MacroType2[MacroType2["Column"] = 3] = "Column";
  MacroType2[MacroType2["Table"] = 4] = "Table";
  return MacroType2;
})(MacroType || {});
var TokenType = /* @__PURE__ */ ((TokenType2) => {
  TokenType2["Parenthesis"] = "delimiter.parenthesis.sql";
  TokenType2["Whitespace"] = "white.sql";
  TokenType2["Keyword"] = "keyword.sql";
  TokenType2["Delimiter"] = "delimiter.sql";
  TokenType2["Operator"] = "operator.sql";
  TokenType2["Identifier"] = "identifier.sql";
  TokenType2["IdentifierQuote"] = "identifier.quote.sql";
  TokenType2["Type"] = "type.sql";
  TokenType2["Function"] = "predefined.sql";
  TokenType2["Number"] = "number.sql";
  TokenType2["String"] = "string.sql";
  TokenType2["Variable"] = "variable.sql";
  return TokenType2;
})(TokenType || {});
var StatementPosition = /* @__PURE__ */ ((StatementPosition2) => {
  StatementPosition2["Unknown"] = "unknown";
  StatementPosition2["SelectKeyword"] = "selectKeyword";
  StatementPosition2["WithKeyword"] = "withKeyword";
  StatementPosition2["AfterSelectKeyword"] = "afterSelectKeyword";
  StatementPosition2["AfterSelectArguments"] = "afterSelectArguments";
  StatementPosition2["AfterSelectFuncFirstArgument"] = "afterSelectFuncFirstArgument";
  StatementPosition2["SelectAlias"] = "selectAlias";
  StatementPosition2["AfterFromKeyword"] = "afterFromKeyword";
  StatementPosition2["AfterTable"] = "afterTable";
  StatementPosition2["SchemaFuncFirstArgument"] = "schemaFuncFirstArgument";
  StatementPosition2["SchemaFuncExtraArgument"] = "schemaFuncExtraArgument";
  StatementPosition2["FromKeyword"] = "fromKeyword";
  StatementPosition2["AfterFrom"] = "afterFrom";
  StatementPosition2["WhereKeyword"] = "whereKeyword";
  StatementPosition2["WhereComparisonOperator"] = "whereComparisonOperator";
  StatementPosition2["WhereValue"] = "whereValue";
  StatementPosition2["AfterWhereFunctionArgument"] = "afterWhereFunctionArgument";
  StatementPosition2["AfterGroupByFunctionArgument"] = "afterGroupByFunctionArgument";
  StatementPosition2["AfterWhereValue"] = "afterWhereValue";
  StatementPosition2["AfterGroupByKeywords"] = "afterGroupByKeywords";
  StatementPosition2["AfterGroupBy"] = "afterGroupBy";
  StatementPosition2["AfterOrderByKeywords"] = "afterOrderByKeywords";
  StatementPosition2["AfterOrderByFunction"] = "afterOrderByFunction";
  StatementPosition2["AfterOrderByDirection"] = "afterOrderByDirection";
  StatementPosition2["AfterIsOperator"] = "afterIsOperator";
  StatementPosition2["AfterIsNotOperator"] = "afterIsNotOperator";
  StatementPosition2["AfterSchema"] = "afterSchema";
  return StatementPosition2;
})(StatementPosition || {});
var SuggestionKind = /* @__PURE__ */ ((SuggestionKind2) => {
  SuggestionKind2["Schemas"] = "schemas";
  SuggestionKind2["Tables"] = "tables";
  SuggestionKind2["Columns"] = "columns";
  SuggestionKind2["SelectKeyword"] = "selectKeyword";
  SuggestionKind2["WithKeyword"] = "withKeyword";
  SuggestionKind2["FunctionsWithArguments"] = "functionsWithArguments";
  SuggestionKind2["FromKeyword"] = "fromKeyword";
  SuggestionKind2["WhereKeyword"] = "whereKeyword";
  SuggestionKind2["GroupByKeywords"] = "groupByKeywords";
  SuggestionKind2["OrderByKeywords"] = "orderByKeywords";
  SuggestionKind2["FunctionsWithoutArguments"] = "functionsWithoutArguments";
  SuggestionKind2["LimitKeyword"] = "limitKeyword";
  SuggestionKind2["SortOrderDirectionKeyword"] = "sortOrderDirectionKeyword";
  SuggestionKind2["ComparisonOperators"] = "comparisonOperators";
  SuggestionKind2["LogicalOperators"] = "logicalOperators";
  SuggestionKind2["SelectMacro"] = "selectMacro";
  SuggestionKind2["TableMacro"] = "tableMacro";
  SuggestionKind2["FilterMacro"] = "filterMacro";
  SuggestionKind2["GroupMacro"] = "groupMacro";
  SuggestionKind2["BoolValues"] = "boolValues";
  SuggestionKind2["NullValue"] = "nullValue";
  SuggestionKind2["NotKeyword"] = "notKeyword";
  SuggestionKind2["TemplateVariables"] = "templateVariables";
  SuggestionKind2["StarWildCard"] = "starWildCard";
  return SuggestionKind2;
})(SuggestionKind || {});
var CompletionItemPriority = /* @__PURE__ */ ((CompletionItemPriority2) => {
  CompletionItemPriority2["High"] = "a";
  CompletionItemPriority2["MediumHigh"] = "d";
  CompletionItemPriority2["Medium"] = "g";
  CompletionItemPriority2["MediumLow"] = "k";
  CompletionItemPriority2["Low"] = "q";
  return CompletionItemPriority2;
})(CompletionItemPriority || {});
var CompletionItemKind = /* @__PURE__ */ ((CompletionItemKind2) => {
  CompletionItemKind2[CompletionItemKind2["Method"] = 0] = "Method";
  CompletionItemKind2[CompletionItemKind2["Function"] = 1] = "Function";
  CompletionItemKind2[CompletionItemKind2["Constructor"] = 2] = "Constructor";
  CompletionItemKind2[CompletionItemKind2["Field"] = 3] = "Field";
  CompletionItemKind2[CompletionItemKind2["Variable"] = 4] = "Variable";
  CompletionItemKind2[CompletionItemKind2["Class"] = 5] = "Class";
  CompletionItemKind2[CompletionItemKind2["Struct"] = 6] = "Struct";
  CompletionItemKind2[CompletionItemKind2["Interface"] = 7] = "Interface";
  CompletionItemKind2[CompletionItemKind2["Module"] = 8] = "Module";
  CompletionItemKind2[CompletionItemKind2["Property"] = 9] = "Property";
  CompletionItemKind2[CompletionItemKind2["Event"] = 10] = "Event";
  CompletionItemKind2[CompletionItemKind2["Operator"] = 11] = "Operator";
  CompletionItemKind2[CompletionItemKind2["Unit"] = 12] = "Unit";
  CompletionItemKind2[CompletionItemKind2["Value"] = 13] = "Value";
  CompletionItemKind2[CompletionItemKind2["Constant"] = 14] = "Constant";
  CompletionItemKind2[CompletionItemKind2["Enum"] = 15] = "Enum";
  CompletionItemKind2[CompletionItemKind2["EnumMember"] = 16] = "EnumMember";
  CompletionItemKind2[CompletionItemKind2["Keyword"] = 17] = "Keyword";
  CompletionItemKind2[CompletionItemKind2["Text"] = 18] = "Text";
  CompletionItemKind2[CompletionItemKind2["Color"] = 19] = "Color";
  CompletionItemKind2[CompletionItemKind2["File"] = 20] = "File";
  CompletionItemKind2[CompletionItemKind2["Reference"] = 21] = "Reference";
  CompletionItemKind2[CompletionItemKind2["Customcolor"] = 22] = "Customcolor";
  CompletionItemKind2[CompletionItemKind2["Folder"] = 23] = "Folder";
  CompletionItemKind2[CompletionItemKind2["TypeParameter"] = 24] = "TypeParameter";
  CompletionItemKind2[CompletionItemKind2["User"] = 25] = "User";
  CompletionItemKind2[CompletionItemKind2["Issue"] = 26] = "Issue";
  CompletionItemKind2[CompletionItemKind2["Snippet"] = 27] = "Snippet";
  return CompletionItemKind2;
})(CompletionItemKind || {});
var CompletionItemInsertTextRule = /* @__PURE__ */ ((CompletionItemInsertTextRule2) => {
  CompletionItemInsertTextRule2[CompletionItemInsertTextRule2["KeepWhitespace"] = 1] = "KeepWhitespace";
  CompletionItemInsertTextRule2[CompletionItemInsertTextRule2["InsertAsSnippet"] = 4] = "InsertAsSnippet";
  return CompletionItemInsertTextRule2;
})(CompletionItemInsertTextRule || {});
var EditorMode = /* @__PURE__ */ ((EditorMode2) => {
  EditorMode2["Builder"] = "builder";
  EditorMode2["Code"] = "code";
  return EditorMode2;
})(EditorMode || {});

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

var __defProp$k = Object.defineProperty;
var __getOwnPropSymbols$l = Object.getOwnPropertySymbols;
var __hasOwnProp$l = Object.prototype.hasOwnProperty;
var __propIsEnum$l = Object.prototype.propertyIsEnumerable;
var __defNormalProp$k = (obj, key, value) => key in obj ? __defProp$k(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$k = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$l.call(b, prop))
      __defNormalProp$k(a, prop, b[prop]);
  if (__getOwnPropSymbols$l)
    for (var prop of __getOwnPropSymbols$l(b)) {
      if (__propIsEnum$l.call(b, prop))
        __defNormalProp$k(a, prop, b[prop]);
    }
  return a;
};
const toCompletionItem = (value, range, rest = {}) => {
  const item = __spreadValues$k({
    label: value,
    insertText: value,
    kind: CompletionItemKind.Field,
    sortText: CompletionItemPriority.Medium,
    range
  }, rest);
  return item;
};

var __defProp$j = Object.defineProperty;
var __defProps$h = Object.defineProperties;
var __getOwnPropDescs$h = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$k = Object.getOwnPropertySymbols;
var __hasOwnProp$k = Object.prototype.hasOwnProperty;
var __propIsEnum$k = Object.prototype.propertyIsEnumerable;
var __defNormalProp$j = (obj, key, value) => key in obj ? __defProp$j(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$j = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$k.call(b, prop))
      __defNormalProp$j(a, prop, b[prop]);
  if (__getOwnPropSymbols$k)
    for (var prop of __getOwnPropSymbols$k(b)) {
      if (__propIsEnum$k.call(b, prop))
        __defNormalProp$j(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$h = (a, b) => __defProps$h(a, __getOwnPropDescs$h(b));
const getStandardSuggestions = async (monaco, currentToken, suggestionKinds, positionContext, suggestionsRegistry) => {
  let suggestions = [];
  const invalidRangeToken = (currentToken == null ? void 0 : currentToken.isWhiteSpace()) || (currentToken == null ? void 0 : currentToken.isParenthesis()) || (currentToken == null ? void 0 : currentToken.isIdentifier()) && currentToken.value.endsWith(".");
  const range = invalidRangeToken || !(currentToken == null ? void 0 : currentToken.range) ? monaco.Range.fromPositions(positionContext.position) : currentToken == null ? void 0 : currentToken.range;
  for (const suggestion of [...new Set(suggestionKinds)]) {
    const registeredSuggestions = suggestionsRegistry.getIfExists(suggestion);
    if (registeredSuggestions) {
      const su = await registeredSuggestions.suggestions(__spreadProps$h(__spreadValues$j({}, positionContext), { range }), monaco);
      suggestions = [...suggestions, ...su.map((s) => toCompletionItem(s.label, range, __spreadValues$j({ kind: s.kind }, s)))];
    }
  }
  return Promise.resolve(suggestions);
};

const initSuggestionsKindRegistry = () => {
  return [
    {
      id: StatementPosition.SelectKeyword,
      name: StatementPosition.SelectKeyword,
      kind: [SuggestionKind.SelectKeyword]
    },
    {
      id: StatementPosition.WithKeyword,
      name: StatementPosition.WithKeyword,
      kind: [SuggestionKind.WithKeyword]
    },
    {
      id: StatementPosition.AfterSelectKeyword,
      name: StatementPosition.AfterSelectKeyword,
      kind: [
        SuggestionKind.StarWildCard,
        SuggestionKind.FunctionsWithArguments,
        SuggestionKind.Columns,
        SuggestionKind.SelectMacro
      ]
    },
    {
      id: StatementPosition.AfterSelectFuncFirstArgument,
      name: StatementPosition.AfterSelectFuncFirstArgument,
      kind: [SuggestionKind.Columns]
    },
    {
      id: StatementPosition.AfterGroupByFunctionArgument,
      name: StatementPosition.AfterGroupByFunctionArgument,
      kind: [SuggestionKind.Columns]
    },
    {
      id: StatementPosition.AfterWhereFunctionArgument,
      name: StatementPosition.AfterWhereFunctionArgument,
      kind: [SuggestionKind.Columns]
    },
    {
      id: StatementPosition.AfterSelectArguments,
      name: StatementPosition.AfterSelectArguments,
      kind: [SuggestionKind.Columns]
    },
    {
      id: StatementPosition.AfterFromKeyword,
      name: StatementPosition.AfterFromKeyword,
      kind: [SuggestionKind.Schemas, SuggestionKind.Tables, SuggestionKind.TableMacro]
    },
    {
      id: StatementPosition.AfterSchema,
      name: StatementPosition.AfterSchema,
      kind: [SuggestionKind.Tables, SuggestionKind.TableMacro]
    },
    {
      id: StatementPosition.SelectAlias,
      name: StatementPosition.SelectAlias,
      kind: [SuggestionKind.Columns, SuggestionKind.FunctionsWithArguments]
    },
    {
      id: StatementPosition.FromKeyword,
      name: StatementPosition.FromKeyword,
      kind: [SuggestionKind.FromKeyword]
    },
    {
      id: StatementPosition.AfterFrom,
      name: StatementPosition.AfterFrom,
      kind: [
        SuggestionKind.WhereKeyword,
        SuggestionKind.GroupByKeywords,
        SuggestionKind.OrderByKeywords,
        SuggestionKind.LimitKeyword
      ]
    },
    {
      id: StatementPosition.AfterTable,
      name: StatementPosition.AfterTable,
      kind: [
        SuggestionKind.WhereKeyword,
        SuggestionKind.GroupByKeywords,
        SuggestionKind.OrderByKeywords,
        SuggestionKind.LimitKeyword
      ]
    },
    {
      id: StatementPosition.WhereKeyword,
      name: StatementPosition.WhereKeyword,
      kind: [SuggestionKind.Columns, SuggestionKind.FilterMacro, SuggestionKind.TemplateVariables]
    },
    {
      id: StatementPosition.WhereComparisonOperator,
      name: StatementPosition.WhereComparisonOperator,
      kind: [SuggestionKind.ComparisonOperators]
    },
    {
      id: StatementPosition.WhereValue,
      name: StatementPosition.WhereValue,
      kind: [SuggestionKind.FilterMacro, SuggestionKind.TemplateVariables]
    },
    {
      id: StatementPosition.AfterWhereValue,
      name: StatementPosition.AfterWhereValue,
      kind: [
        SuggestionKind.LogicalOperators,
        SuggestionKind.GroupByKeywords,
        SuggestionKind.OrderByKeywords,
        SuggestionKind.LimitKeyword,
        SuggestionKind.Columns,
        SuggestionKind.TemplateVariables
      ]
    },
    {
      id: StatementPosition.AfterGroupByKeywords,
      name: StatementPosition.AfterGroupByKeywords,
      kind: [SuggestionKind.GroupMacro, SuggestionKind.Columns]
    },
    {
      id: StatementPosition.AfterGroupBy,
      name: StatementPosition.AfterGroupBy,
      kind: [SuggestionKind.OrderByKeywords, SuggestionKind.LimitKeyword]
    },
    {
      id: StatementPosition.AfterOrderByKeywords,
      name: StatementPosition.AfterOrderByKeywords,
      kind: [SuggestionKind.Columns]
    },
    {
      id: StatementPosition.AfterOrderByFunction,
      name: StatementPosition.AfterOrderByFunction,
      kind: [SuggestionKind.SortOrderDirectionKeyword, SuggestionKind.LimitKeyword]
    },
    {
      id: StatementPosition.AfterOrderByDirection,
      name: StatementPosition.AfterOrderByDirection,
      kind: [SuggestionKind.LimitKeyword]
    },
    {
      id: StatementPosition.AfterIsOperator,
      name: StatementPosition.AfterOrderByDirection,
      kind: [SuggestionKind.NotKeyword, SuggestionKind.NullValue, SuggestionKind.BoolValues]
    },
    {
      id: StatementPosition.AfterIsNotOperator,
      name: StatementPosition.AfterOrderByDirection,
      kind: [SuggestionKind.NullValue, SuggestionKind.BoolValues]
    }
  ];
};

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

class LinkedToken {
  constructor(type, value, range, previous, next) {
    this.type = type;
    this.value = value;
    this.range = range;
    this.previous = previous;
    this.next = next;
  }
  isKeyword() {
    return this.type === TokenType.Keyword;
  }
  isWhiteSpace() {
    return this.type === TokenType.Whitespace;
  }
  isParenthesis() {
    return this.type === TokenType.Parenthesis;
  }
  isIdentifier() {
    return this.type === TokenType.Identifier;
  }
  isString() {
    return this.type === TokenType.String;
  }
  isNumber() {
    return this.type === TokenType.Number;
  }
  isDoubleQuotedString() {
    return this.type === TokenType.Type;
  }
  isVariable() {
    return this.type === TokenType.Variable;
  }
  isFunction() {
    return this.type === TokenType.Function;
  }
  isOperator() {
    return this.type === TokenType.Operator;
  }
  isTemplateVariable() {
    return this.type === TokenType.Variable;
  }
  is(type, value) {
    const isType = this.type === type;
    return value !== void 0 ? isType && compareTokenWithValue(type, this, value) : isType;
  }
  getPreviousNonWhiteSpaceToken() {
    let curr = this.previous;
    while (curr != null) {
      if (!curr.isWhiteSpace()) {
        return curr;
      }
      curr = curr.previous;
    }
    return null;
  }
  getPreviousOfType(type, value) {
    let curr = this.previous;
    while (curr != null) {
      const isType = curr.type === type;
      if (value !== void 0 ? isType && compareTokenWithValue(type, curr, value) : isType) {
        return curr;
      }
      curr = curr.previous;
    }
    return null;
  }
  getPreviousUntil(type, ignoreTypes, value) {
    let tokens = [];
    let curr = this.previous;
    while (curr != null) {
      if (ignoreTypes.some((t) => t === (curr == null ? void 0 : curr.type))) {
        curr = curr.previous;
        continue;
      }
      const isType = curr.type === type;
      if (value !== void 0 ? isType && compareTokenWithValue(type, curr, value) : isType) {
        return tokens;
      }
      if (!curr.isWhiteSpace()) {
        tokens.push(curr);
      }
      curr = curr.previous;
    }
    return tokens;
  }
  getNextUntil(type, ignoreTypes, value) {
    let tokens = [];
    let curr = this.next;
    while (curr != null) {
      if (ignoreTypes.some((t) => t === (curr == null ? void 0 : curr.type))) {
        curr = curr.next;
        continue;
      }
      const isType = curr.type === type;
      if (value !== void 0 ? isType && compareTokenWithValue(type, curr, value) : isType) {
        return tokens;
      }
      if (!curr.isWhiteSpace()) {
        tokens.push(curr);
      }
      curr = curr.next;
    }
    return tokens;
  }
  getPreviousKeyword() {
    let curr = this.previous;
    while (curr != null) {
      if (curr.isKeyword()) {
        return curr;
      }
      curr = curr.previous;
    }
    return null;
  }
  getNextNonWhiteSpaceToken() {
    let curr = this.next;
    while (curr != null) {
      if (!curr.isWhiteSpace()) {
        return curr;
      }
      curr = curr.next;
    }
    return null;
  }
  getNextOfType(type, value) {
    let curr = this.next;
    while (curr != null) {
      const isType = curr.type === type;
      if (value !== void 0 ? isType && compareTokenWithValue(type, curr, value) : isType) {
        return curr;
      }
      curr = curr.next;
    }
    return null;
  }
}
function compareTokenWithValue(type, token, value) {
  return type === TokenType.Keyword || type === TokenType.Operator ? token.value.toLowerCase() === value.toString().toLowerCase() : token.value === value;
}

function linkedTokenBuilder(monaco, model, position, languageId = "sql") {
  var _a;
  let current = null;
  let previous = null;
  const tokensPerLine = monaco.editor.tokenize((_a = model.getValue()) != null ? _a : "", languageId);
  for (let lineIndex = 0; lineIndex < tokensPerLine.length; lineIndex++) {
    const tokens = tokensPerLine[lineIndex];
    if (!tokens.length && previous) {
      const token = {
        offset: 0,
        type: TokenType.Whitespace,
        language: languageId,
        _tokenBrand: void 0
      };
      tokens.push(token);
    }
    for (let columnIndex = 0; columnIndex < tokens.length; columnIndex++) {
      const token = tokens[columnIndex];
      let endColumn = tokens.length > columnIndex + 1 ? tokens[columnIndex + 1].offset + 1 : model.getLineLength(lineIndex + 1) + 1;
      const range = {
        startLineNumber: lineIndex + 1,
        startColumn: token.offset === 0 ? 0 : token.offset + 1,
        endLineNumber: lineIndex + 1,
        endColumn
      };
      const value = model.getValueInRange(range);
      const sqlToken = new LinkedToken(token.type, value, range, previous, null);
      if (monaco.Range.containsPosition(range, position)) {
        current = sqlToken;
      }
      if (previous) {
        previous.next = sqlToken;
      }
      previous = sqlToken;
    }
  }
  return current;
}

const SELECT = "select";
const FROM = "from";
const WHERE = "where";
const GROUP = "group";
const ORDER = "order";
const BY = "by";
const DESC = "desc";
const ASC = "asc";
const LIMIT = "limit";
const WITH = "with";
const AS = "as";
const SCHEMA = "schema";
const AND = "AND";
const OR = "OR";
const LOGICAL_OPERATORS = [AND, OR];
const EQUALS = "=";
const NOT_EQUALS = "!=";
const COMPARISON_OPERATORS = [EQUALS, NOT_EQUALS];
const STD_OPERATORS = [...COMPARISON_OPERATORS];
const conf = {
  comments: {
    lineComment: "--",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ]
};
const language = {
  defaultToken: "",
  tokenPostfix: ".sql",
  ignoreCase: true,
  brackets: [
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "(", close: ")", token: "delimiter.parenthesis" }
  ],
  keywords: [
    "ABORT",
    "ABSOLUTE",
    "ACTION",
    "ADA",
    "ADD",
    "AFTER",
    "ALL",
    "ALLOCATE",
    "ALTER",
    "ALWAYS",
    "ANALYZE",
    "AND",
    "ANY",
    "ARE",
    "AS",
    "ASC",
    "ASSERTION",
    "AT",
    "ATTACH",
    "AUTHORIZATION",
    "AUTOINCREMENT",
    "AVG",
    "BACKUP",
    "BEFORE",
    "BEGIN",
    "BETWEEN",
    "BIT",
    "BIT_LENGTH",
    "BOTH",
    "BREAK",
    "BROWSE",
    "BULK",
    "BY",
    "CASCADE",
    "CASCADED",
    "CASE",
    "CAST",
    "CATALOG",
    "CHAR",
    "CHARACTER",
    "CHARACTER_LENGTH",
    "CHAR_LENGTH",
    "CHECK",
    "CHECKPOINT",
    "CLOSE",
    "CLUSTERED",
    "COALESCE",
    "COLLATE",
    "COLLATION",
    "COLUMN",
    "COMMIT",
    "COMPUTE",
    "CONFLICT",
    "CONNECT",
    "CONNECTION",
    "CONSTRAINT",
    "CONSTRAINTS",
    "CONTAINS",
    "CONTAINSTABLE",
    "CONTINUE",
    "CONVERT",
    "CORRESPONDING",
    "COUNT",
    "CREATE",
    "CROSS",
    "CURRENT",
    "CURRENT_DATE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_USER",
    "CURSOR",
    "DATABASE",
    "DATE",
    "DAY",
    "DBCC",
    "DEALLOCATE",
    "DEC",
    "DECIMAL",
    "DECLARE",
    "DEFAULT",
    "DEFERRABLE",
    "DEFERRED",
    "DELETE",
    "DENY",
    "DESC",
    "DESCRIBE",
    "DESCRIPTOR",
    "DETACH",
    "DIAGNOSTICS",
    "DISCONNECT",
    "DISK",
    "DISTINCT",
    "DISTRIBUTED",
    "DO",
    "DOMAIN",
    "DOUBLE",
    "DROP",
    "DUMP",
    "EACH",
    "ELSE",
    "END",
    "END-EXEC",
    "ERRLVL",
    "ESCAPE",
    "EXCEPT",
    "EXCEPTION",
    "EXCLUDE",
    "EXCLUSIVE",
    "EXEC",
    "EXECUTE",
    "EXISTS",
    "EXIT",
    "EXPLAIN",
    "EXTERNAL",
    "EXTRACT",
    "FAIL",
    "FALSE",
    "FETCH",
    "FILE",
    "FILLFACTOR",
    "FILTER",
    "FIRST",
    "FLOAT",
    "FOLLOWING",
    "FOR",
    "FOREIGN",
    "FORTRAN",
    "FOUND",
    "FREETEXT",
    "FREETEXTTABLE",
    "FROM",
    "FULL",
    "FUNCTION",
    "GENERATED",
    "GET",
    "GLOB",
    "GLOBAL",
    "GO",
    "GOTO",
    "GRANT",
    "GROUP",
    "GROUPS",
    "HAVING",
    "HOLDLOCK",
    "HOUR",
    "IDENTITY",
    "IDENTITYCOL",
    "IDENTITY_INSERT",
    "IF",
    "IGNORE",
    "IMMEDIATE",
    "IN",
    "INCLUDE",
    "INDEX",
    "INDEXED",
    "INDICATOR",
    "INITIALLY",
    "INNER",
    "INPUT",
    "INSENSITIVE",
    "INSERT",
    "INSTEAD",
    "INT",
    "INTEGER",
    "INTERSECT",
    "INTERVAL",
    "INTO",
    "IS",
    "ISNULL",
    "ISOLATION",
    "JOIN",
    "KEY",
    "KILL",
    "LANGUAGE",
    "LAST",
    "LEADING",
    "LEFT",
    "LEVEL",
    "LIKE",
    "LIMIT",
    "LINENO",
    "LOAD",
    "LOCAL",
    "LOWER",
    "MATCH",
    "MATERIALIZED",
    "MAX",
    "MERGE",
    "MIN",
    "MINUTE",
    "MODULE",
    "MONTH",
    "NAMES",
    "NATIONAL",
    "NATURAL",
    "NCHAR",
    "NEXT",
    "NO",
    "NOCHECK",
    "NONCLUSTERED",
    "NONE",
    "NOT",
    "NOTHING",
    "NOTNULL",
    "NULL",
    "NULLIF",
    "NULLS",
    "NUMERIC",
    "OCTET_LENGTH",
    "OF",
    "OFF",
    "OFFSET",
    "OFFSETS",
    "ON",
    "ONLY",
    "OPEN",
    "OPENDATASOURCE",
    "OPENQUERY",
    "OPENROWSET",
    "OPENXML",
    "OPTION",
    "OR",
    "ORDER",
    "OTHERS",
    "OUTER",
    "OUTPUT",
    "OVER",
    "OVERLAPS",
    "PAD",
    "PARTIAL",
    "PARTITION",
    "PASCAL",
    "PERCENT",
    "PIVOT",
    "PLAN",
    "POSITION",
    "PRAGMA",
    "PRECEDING",
    "PRECISION",
    "PREPARE",
    "PRESERVE",
    "PRIMARY",
    "PRINT",
    "PRIOR",
    "PRIVILEGES",
    "PROC",
    "PROCEDURE",
    "PUBLIC",
    "QUERY",
    "RAISE",
    "RAISERROR",
    "RANGE",
    "READ",
    "READTEXT",
    "REAL",
    "RECONFIGURE",
    "RECURSIVE",
    "REFERENCES",
    "REGEXP",
    "REINDEX",
    "RELATIVE",
    "RELEASE",
    "RENAME",
    "REPLACE",
    "REPLICATION",
    "RESTORE",
    "RESTRICT",
    "RETURN",
    "RETURNING",
    "REVERT",
    "REVOKE",
    "RIGHT",
    "ROLLBACK",
    "ROW",
    "ROWCOUNT",
    "ROWGUIDCOL",
    "ROWS",
    "RULE",
    "SAVE",
    "SAVEPOINT",
    "SCHEMA",
    "SCROLL",
    "SECOND",
    "SECTION",
    "SECURITYAUDIT",
    "SELECT",
    "SEMANTICKEYPHRASETABLE",
    "SEMANTICSIMILARITYDETAILSTABLE",
    "SEMANTICSIMILARITYTABLE",
    "SESSION",
    "SESSION_USER",
    "SET",
    "SETUSER",
    "SHUTDOWN",
    "SIZE",
    "SMALLINT",
    "SOME",
    "SPACE",
    "SQL",
    "SQLCA",
    "SQLCODE",
    "SQLERROR",
    "SQLSTATE",
    "SQLWARNING",
    "STATISTICS",
    "SUBSTRING",
    "SUM",
    "SYSTEM_USER",
    "TABLE",
    "TABLESAMPLE",
    "TEMP",
    "TEMPORARY",
    "TEXTSIZE",
    "THEN",
    "TIES",
    "TIME",
    "TIMESTAMP",
    "TIMEZONE_HOUR",
    "TIMEZONE_MINUTE",
    "TO",
    "TOP",
    "TRAILING",
    "TRAN",
    "TRANSACTION",
    "TRANSLATE",
    "TRANSLATION",
    "TRIGGER",
    "TRIM",
    "TRUE",
    "TRUNCATE",
    "TRY_CONVERT",
    "TSEQUAL",
    "UNBOUNDED",
    "UNION",
    "UNIQUE",
    "UNKNOWN",
    "UNPIVOT",
    "UPDATE",
    "UPDATETEXT",
    "UPPER",
    "USAGE",
    "USE",
    "USER",
    "USING",
    "VACUUM",
    "VALUE",
    "VALUES",
    "VARCHAR",
    "VARYING",
    "VIEW",
    "VIRTUAL",
    "WAITFOR",
    "WHEN",
    "WHENEVER",
    "WHERE",
    "WHILE",
    "WINDOW",
    "WITH",
    "WITHIN GROUP",
    "WITHOUT",
    "WORK",
    "WRITE",
    "WRITETEXT",
    "YEAR",
    "ZONE"
  ],
  operators: [
    // Set
    "EXCEPT",
    "INTERSECT",
    "UNION",
    // Join
    "APPLY",
    "CROSS",
    "FULL",
    "INNER",
    "JOIN",
    "LEFT",
    "OUTER",
    "RIGHT",
    // Predicates
    "CONTAINS",
    "FREETEXT",
    "IS",
    "NULL",
    // Pivoting
    "PIVOT",
    "UNPIVOT",
    // Merging
    "MATCHED"
  ],
  logicalOperators: ["ALL", "AND", "ANY", "BETWEEN", "EXISTS", "IN", "LIKE", "NOT", "OR", "SOME"],
  comparisonOperators: ["<>", ">", "<", ">=", "<=", "=", "!=", "&", "~", "^", "%"],
  builtinFunctions: [
    // Aggregate
    "AVG",
    "CHECKSUM_AGG",
    "COUNT",
    "COUNT_BIG",
    "GROUPING",
    "GROUPING_ID",
    "MAX",
    "MIN",
    "SUM",
    "STDEV",
    "STDEVP",
    "VAR",
    "VARP",
    // Analytic
    "CUME_DIST",
    "FIRST_VALUE",
    "LAG",
    "LAST_VALUE",
    "LEAD",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    "PERCENT_RANK",
    // Collation
    "COLLATE",
    "COLLATIONPROPERTY",
    "TERTIARY_WEIGHTS",
    // Azure
    "FEDERATION_FILTERING_VALUE",
    // Conversion
    "CAST",
    "CONVERT",
    "PARSE",
    "TRY_CAST",
    "TRY_CONVERT",
    "TRY_PARSE",
    // Cryptographic
    "ASYMKEY_ID",
    "ASYMKEYPROPERTY",
    "CERTPROPERTY",
    "CERT_ID",
    "CRYPT_GEN_RANDOM",
    "DECRYPTBYASYMKEY",
    "DECRYPTBYCERT",
    "DECRYPTBYKEY",
    "DECRYPTBYKEYAUTOASYMKEY",
    "DECRYPTBYKEYAUTOCERT",
    "DECRYPTBYPASSPHRASE",
    "ENCRYPTBYASYMKEY",
    "ENCRYPTBYCERT",
    "ENCRYPTBYKEY",
    "ENCRYPTBYPASSPHRASE",
    "HASHBYTES",
    "IS_OBJECTSIGNED",
    "KEY_GUID",
    "KEY_ID",
    "KEY_NAME",
    "SIGNBYASYMKEY",
    "SIGNBYCERT",
    "SYMKEYPROPERTY",
    "VERIFYSIGNEDBYCERT",
    "VERIFYSIGNEDBYASYMKEY",
    // Cursor
    "CURSOR_STATUS",
    // Datatype
    "DATALENGTH",
    "IDENT_CURRENT",
    "IDENT_INCR",
    "IDENT_SEED",
    "IDENTITY",
    "SQL_VARIANT_PROPERTY",
    // Datetime
    "CURRENT_TIMESTAMP",
    "DATEADD",
    "DATEDIFF",
    "DATEFROMPARTS",
    "DATENAME",
    "DATEPART",
    "DATETIME2FROMPARTS",
    "DATETIMEFROMPARTS",
    "DATETIMEOFFSETFROMPARTS",
    "DAY",
    "EOMONTH",
    "GETDATE",
    "GETUTCDATE",
    "ISDATE",
    "MONTH",
    "SMALLDATETIMEFROMPARTS",
    "SWITCHOFFSET",
    "SYSDATETIME",
    "SYSDATETIMEOFFSET",
    "SYSUTCDATETIME",
    "TIMEFROMPARTS",
    "TODATETIMEOFFSET",
    "YEAR",
    // Logical
    "CHOOSE",
    "COALESCE",
    "IIF",
    "NULLIF",
    // Mathematical
    "ABS",
    "ACOS",
    "ASIN",
    "ATAN",
    "ATN2",
    "CEILING",
    "COS",
    "COT",
    "DEGREES",
    "EXP",
    "FLOOR",
    "LOG",
    "LOG10",
    "PI",
    "POWER",
    "RADIANS",
    "RAND",
    "ROUND",
    "SIGN",
    "SIN",
    "SQRT",
    "SQUARE",
    "TAN",
    // Metadata
    "APP_NAME",
    "APPLOCK_MODE",
    "APPLOCK_TEST",
    "ASSEMBLYPROPERTY",
    "COL_LENGTH",
    "COL_NAME",
    "COLUMNPROPERTY",
    "DATABASE_PRINCIPAL_ID",
    "DATABASEPROPERTYEX",
    "DB_ID",
    "DB_NAME",
    "FILE_ID",
    "FILE_IDEX",
    "FILE_NAME",
    "FILEGROUP_ID",
    "FILEGROUP_NAME",
    "FILEGROUPPROPERTY",
    "FILEPROPERTY",
    "FULLTEXTCATALOGPROPERTY",
    "FULLTEXTSERVICEPROPERTY",
    "INDEX_COL",
    "INDEXKEY_PROPERTY",
    "INDEXPROPERTY",
    "OBJECT_DEFINITION",
    "OBJECT_ID",
    "OBJECT_NAME",
    "OBJECT_SCHEMA_NAME",
    "OBJECTPROPERTY",
    "OBJECTPROPERTYEX",
    "ORIGINAL_DB_NAME",
    "PARSENAME",
    "SCHEMA_ID",
    "SCHEMA_NAME",
    "SCOPE_IDENTITY",
    "SERVERPROPERTY",
    "STATS_DATE",
    "TYPE_ID",
    "TYPE_NAME",
    "TYPEPROPERTY",
    // Ranking
    "DENSE_RANK",
    "NTILE",
    "RANK",
    "ROW_NUMBER",
    // Replication
    "PUBLISHINGSERVERNAME",
    // Rowset
    "OPENDATASOURCE",
    "OPENQUERY",
    "OPENROWSET",
    "OPENXML",
    // Security
    "CERTENCODED",
    "CERTPRIVATEKEY",
    "CURRENT_USER",
    "HAS_DBACCESS",
    "HAS_PERMS_BY_NAME",
    "IS_MEMBER",
    "IS_ROLEMEMBER",
    "IS_SRVROLEMEMBER",
    "LOGINPROPERTY",
    "ORIGINAL_LOGIN",
    "PERMISSIONS",
    "PWDENCRYPT",
    "PWDCOMPARE",
    "SESSION_USER",
    "SESSIONPROPERTY",
    "SUSER_ID",
    "SUSER_NAME",
    "SUSER_SID",
    "SUSER_SNAME",
    "SYSTEM_USER",
    "USER",
    "USER_ID",
    "USER_NAME",
    // String
    "ASCII",
    "CHAR",
    "CHARINDEX",
    "CONCAT",
    "DIFFERENCE",
    "FORMAT",
    "LEFT",
    "LEN",
    "LOWER",
    "LTRIM",
    "NCHAR",
    "PATINDEX",
    "QUOTENAME",
    "REPLACE",
    "REPLICATE",
    "REVERSE",
    "RIGHT",
    "RTRIM",
    "SOUNDEX",
    "SPACE",
    "STR",
    "STUFF",
    "SUBSTRING",
    "UNICODE",
    "UPPER",
    // System
    "BINARY_CHECKSUM",
    "CHECKSUM",
    "CONNECTIONPROPERTY",
    "CONTEXT_INFO",
    "CURRENT_REQUEST_ID",
    "ERROR_LINE",
    "ERROR_NUMBER",
    "ERROR_MESSAGE",
    "ERROR_PROCEDURE",
    "ERROR_SEVERITY",
    "ERROR_STATE",
    "FORMATMESSAGE",
    "GETANSINULL",
    "GET_FILESTREAM_TRANSACTION_CONTEXT",
    "HOST_ID",
    "HOST_NAME",
    "ISNULL",
    "ISNUMERIC",
    "MIN_ACTIVE_ROWVERSION",
    "NEWID",
    "NEWSEQUENTIALID",
    "ROWCOUNT_BIG",
    "XACT_STATE",
    // TextImage
    "TEXTPTR",
    "TEXTVALID",
    // Trigger
    "COLUMNS_UPDATED",
    "EVENTDATA",
    "TRIGGER_NESTLEVEL",
    "UPDATE",
    // ChangeTracking
    "CHANGETABLE",
    "CHANGE_TRACKING_CONTEXT",
    "CHANGE_TRACKING_CURRENT_VERSION",
    "CHANGE_TRACKING_IS_COLUMN_IN_MASK",
    "CHANGE_TRACKING_MIN_VALID_VERSION",
    // FullTextSearch
    "CONTAINSTABLE",
    "FREETEXTTABLE",
    // SemanticTextSearch
    "SEMANTICKEYPHRASETABLE",
    "SEMANTICSIMILARITYDETAILSTABLE",
    "SEMANTICSIMILARITYTABLE",
    // FileStream
    "FILETABLEROOTPATH",
    "GETFILENAMESPACEPATH",
    "GETPATHLOCATOR",
    "PATHNAME",
    // ServiceBroker
    "GET_TRANSMISSION_STATUS"
  ],
  builtinVariables: [
    // Configuration
    "@@DATEFIRST",
    "@@DBTS",
    "@@LANGID",
    "@@LANGUAGE",
    "@@LOCK_TIMEOUT",
    "@@MAX_CONNECTIONS",
    "@@MAX_PRECISION",
    "@@NESTLEVEL",
    "@@OPTIONS",
    "@@REMSERVER",
    "@@SERVERNAME",
    "@@SERVICENAME",
    "@@SPID",
    "@@TEXTSIZE",
    "@@VERSION",
    // Cursor
    "@@CURSOR_ROWS",
    "@@FETCH_STATUS",
    // Datetime
    "@@DATEFIRST",
    // Metadata
    "@@PROCID",
    // System
    "@@ERROR",
    "@@IDENTITY",
    "@@ROWCOUNT",
    "@@TRANCOUNT",
    // Stats
    "@@CONNECTIONS",
    "@@CPU_BUSY",
    "@@IDLE",
    "@@IO_BUSY",
    "@@PACKET_ERRORS",
    "@@PACK_RECEIVED",
    "@@PACK_SENT",
    "@@TIMETICKS",
    "@@TOTAL_ERRORS",
    "@@TOTAL_READ",
    "@@TOTAL_WRITE"
  ],
  pseudoColumns: ["$ACTION", "$IDENTITY", "$ROWGUID", "$PARTITION"],
  tokenizer: {
    root: [
      { include: "@templateVariables" },
      { include: "@macros" },
      { include: "@comments" },
      { include: "@whitespace" },
      { include: "@pseudoColumns" },
      { include: "@numbers" },
      { include: "@strings" },
      { include: "@complexIdentifiers" },
      { include: "@scopes" },
      { include: "@schemaTable" },
      [/[;,.]/, "delimiter"],
      [/[()]/, "@brackets"],
      [
        /[\w@#$|<|>|=|!|%|&|+|\|-|*|/|~|^]+/,
        {
          cases: {
            "@operators": "operator",
            "@comparisonOperators": "operator",
            "@logicalOperators": "operator",
            "@builtinVariables": "predefined",
            "@builtinFunctions": "predefined",
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ]
    ],
    templateVariables: [[/\$[a-zA-Z0-9]+/, "variable"]],
    macros: [[/\$__[a-zA-Z0-9-_]+/, "type"]],
    schemaTable: [
      [/(\w+)\./, "identifier"],
      [/(\w+\.\w+)/, "identifier"]
    ],
    whitespace: [[/\s+/, "white"]],
    comments: [
      [/--+.*/, "comment"],
      [/\/\*/, { token: "comment.quote", next: "@comment" }]
    ],
    comment: [
      [/[^*/]+/, "comment"],
      // Not supporting nested comments, as nested comments seem to not be standard?
      // i.e. http://stackoverflow.com/questions/728172/are-there-multiline-comment-delimiters-in-sql-that-are-vendor-agnostic
      // [/\/\*/, { token: 'comment.quote', next: '@push' }],    // nested comment not allowed :-(
      [/\*\//, { token: "comment.quote", next: "@pop" }],
      [/./, "comment"]
    ],
    pseudoColumns: [
      [
        /[$][A-Za-z_][\w@#$]*/,
        {
          cases: {
            "@pseudoColumns": "predefined",
            "@default": "identifier"
          }
        }
      ]
    ],
    numbers: [
      [/0[xX][0-9a-fA-F]*/, "number"],
      [/[$][+-]*\d*(\.\d*)?/, "number"],
      [/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, "number"]
    ],
    strings: [
      [/N'/, { token: "string", next: "@string" }],
      [/'/, { token: "string", next: "@string" }]
    ],
    string: [
      [/[^']+/, "string"],
      [/''/, "string"],
      [/'/, { token: "string", next: "@pop" }]
    ],
    complexIdentifiers: [
      [/\[/, { token: "identifier.quote", next: "@bracketedIdentifier" }],
      [/"/, { token: "identifier.quote", next: "@quotedIdentifier" }]
    ],
    bracketedIdentifier: [
      [/[^\]]+/, "identifier"],
      [/]]/, "identifier"],
      [/]/, { token: "identifier.quote", next: "@pop" }]
    ],
    quotedIdentifier: [
      [/[^"]+/, "identifier"],
      [/""/, "identifier"],
      [/"/, { token: "identifier.quote", next: "@pop" }]
    ],
    scopes: [
      [/BEGIN\s+(DISTRIBUTED\s+)?TRAN(SACTION)?\b/i, "keyword"],
      [/BEGIN\s+TRY\b/i, { token: "keyword.try" }],
      [/END\s+TRY\b/i, { token: "keyword.try" }],
      [/BEGIN\s+CATCH\b/i, { token: "keyword.catch" }],
      [/END\s+CATCH\b/i, { token: "keyword.catch" }],
      [/(BEGIN|CASE)\b/i, { token: "keyword.block" }],
      [/END\b/i, { token: "keyword.block" }],
      [/WHEN\b/i, { token: "keyword.choice" }],
      [/THEN\b/i, { token: "keyword.choice" }]
    ]
  }
};

var language$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SELECT: SELECT,
  FROM: FROM,
  WHERE: WHERE,
  GROUP: GROUP,
  ORDER: ORDER,
  BY: BY,
  DESC: DESC,
  ASC: ASC,
  LIMIT: LIMIT,
  WITH: WITH,
  AS: AS,
  SCHEMA: SCHEMA,
  AND: AND,
  OR: OR,
  LOGICAL_OPERATORS: LOGICAL_OPERATORS,
  EQUALS: EQUALS,
  NOT_EQUALS: NOT_EQUALS,
  COMPARISON_OPERATORS: COMPARISON_OPERATORS,
  STD_OPERATORS: STD_OPERATORS,
  conf: conf,
  language: language
});

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

const TRIGGER_SUGGEST = {
  id: "editor.action.triggerSuggest",
  title: ""
};

const initStandardSuggestions = (functions, operators, macros) => () => [
  {
    id: SuggestionKind.SelectKeyword,
    name: SuggestionKind.SelectKeyword,
    suggestions: (_, m) => Promise.resolve([
      {
        label: `SELECT <column>`,
        insertText: `SELECT $0`,
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        kind: CompletionItemKind.Snippet,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.Medium
      },
      {
        label: `SELECT <column> FROM <table>`,
        insertText: `SELECT $2 FROM $1`,
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        kind: CompletionItemKind.Snippet,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.Medium
      }
    ])
  },
  {
    id: SuggestionKind.TemplateVariables,
    name: SuggestionKind.TemplateVariables,
    suggestions: (_, m) => {
      const templateSrv = runtime.getTemplateSrv();
      if (!templateSrv) {
        return Promise.resolve([]);
      }
      return Promise.resolve(
        templateSrv.getVariables().map((variable) => {
          const label = `$${variable.name}`;
          const val = templateSrv.replace(label);
          return {
            label,
            detail: `(Template Variable) ${val}`,
            kind: CompletionItemKind.Snippet,
            documentation: `(Template Variable) ${val}`,
            insertText: `\\$${variable.name} `,
            insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
            command: TRIGGER_SUGGEST,
            sortText: CompletionItemPriority.Low
          };
        })
      );
    }
  },
  {
    id: SuggestionKind.SelectMacro,
    name: SuggestionKind.SelectMacro,
    suggestions: (_, m) => Promise.resolve([
      ...macros.list().filter((m2) => m2.type === MacroType.Value || m2.type === MacroType.Column).map(createMacroSuggestionItem)
    ])
  },
  {
    id: SuggestionKind.TableMacro,
    name: SuggestionKind.TableMacro,
    suggestions: (_, m) => Promise.resolve([
      ...macros.list().filter((m2) => m2.type === MacroType.Table).map(createMacroSuggestionItem)
    ])
  },
  {
    id: SuggestionKind.GroupMacro,
    name: SuggestionKind.GroupMacro,
    suggestions: (_, m) => Promise.resolve([
      ...macros.list().filter((m2) => m2.type === MacroType.Group).map(createMacroSuggestionItem)
    ])
  },
  {
    id: SuggestionKind.FilterMacro,
    name: SuggestionKind.FilterMacro,
    suggestions: (_, m) => Promise.resolve([
      ...macros.list().filter((m2) => m2.type === MacroType.Filter).map(createMacroSuggestionItem)
    ])
  },
  {
    id: SuggestionKind.WithKeyword,
    name: SuggestionKind.WithKeyword,
    suggestions: (_, m) => Promise.resolve([
      {
        label: `WITH <alias> AS ( ... )`,
        insertText: `WITH $1  AS ( $2 )`,
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        kind: CompletionItemKind.Snippet,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.Medium
      }
    ])
  },
  {
    id: SuggestionKind.StarWildCard,
    name: SuggestionKind.StarWildCard,
    suggestions: (_, m) => Promise.resolve([
      {
        label: "*",
        insertText: `* $0`,
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        kind: CompletionItemKind.Field,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.High
      }
    ])
  },
  {
    id: SuggestionKind.FunctionsWithArguments,
    name: SuggestionKind.FunctionsWithArguments,
    suggestions: (_, m) => Promise.resolve([
      ...functions.list().map((f) => ({
        label: f.name,
        insertText: `${f.name}($0)`,
        documentation: f.description,
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        kind: CompletionItemKind.Function,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.MediumLow
      }))
    ])
  },
  {
    id: SuggestionKind.FunctionsWithoutArguments,
    name: SuggestionKind.FunctionsWithoutArguments,
    suggestions: (_, m) => Promise.resolve([
      ...functions.list().map((f) => ({
        label: f.name,
        insertText: `${f.name}()`,
        documentation: f.description,
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        kind: CompletionItemKind.Function,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.MediumHigh
      }))
    ])
  },
  {
    id: SuggestionKind.FromKeyword,
    name: SuggestionKind.FromKeyword,
    suggestions: (_, m) => Promise.resolve([
      {
        label: "FROM",
        insertText: `FROM $0`,
        command: TRIGGER_SUGGEST,
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        kind: CompletionItemKind.Keyword
      }
    ])
  },
  {
    id: SuggestionKind.Schemas,
    name: SuggestionKind.Schemas,
    suggestions: (_, m) => Promise.resolve([])
  },
  {
    id: SuggestionKind.Tables,
    name: SuggestionKind.Tables,
    suggestions: (_, m) => Promise.resolve([])
  },
  {
    id: SuggestionKind.Columns,
    name: SuggestionKind.Columns,
    suggestions: (_, m) => Promise.resolve([])
  },
  {
    id: SuggestionKind.LogicalOperators,
    name: SuggestionKind.LogicalOperators,
    suggestions: (_, m) => Promise.resolve(
      operators.list().filter((o) => o.type === OperatorType.Logical).map((o) => ({
        label: o.operator,
        insertText: `${o.operator} `,
        documentation: o.description,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.MediumHigh,
        kind: CompletionItemKind.Operator
      }))
    )
  },
  {
    id: SuggestionKind.WhereKeyword,
    name: SuggestionKind.WhereKeyword,
    suggestions: (_, m) => Promise.resolve([
      {
        label: "WHERE",
        insertText: `WHERE `,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.MediumHigh,
        kind: CompletionItemKind.Keyword
      }
    ])
  },
  {
    id: SuggestionKind.ComparisonOperators,
    name: SuggestionKind.ComparisonOperators,
    suggestions: (_, m) => Promise.resolve([
      ...operators.list().filter((o) => o.type === OperatorType.Comparison).map((o) => ({
        label: o.operator,
        insertText: `${o.operator} `,
        documentation: o.description,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.MediumHigh,
        kind: CompletionItemKind.Operator
      })),
      {
        label: "IN (...)",
        insertText: `IN ( $0 )`,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.Medium,
        kind: CompletionItemKind.Operator,
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: "NOT IN (...)",
        insertText: `NOT IN ( $0 )`,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.Medium,
        kind: CompletionItemKind.Operator,
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: "IS",
        insertText: `IS`,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.Medium,
        kind: CompletionItemKind.Operator
      },
      {
        label: "IS NOT",
        insertText: `IS NOT`,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.Medium,
        kind: CompletionItemKind.Operator
      }
    ])
  },
  {
    id: SuggestionKind.GroupByKeywords,
    name: SuggestionKind.GroupByKeywords,
    suggestions: (_, m) => Promise.resolve([
      {
        label: "GROUP BY",
        insertText: `GROUP BY `,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.MediumHigh,
        kind: CompletionItemKind.Keyword
      }
    ])
  },
  {
    id: SuggestionKind.OrderByKeywords,
    name: SuggestionKind.OrderByKeywords,
    suggestions: (_, m) => Promise.resolve([
      {
        label: "ORDER BY",
        insertText: `ORDER BY `,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.Medium,
        kind: CompletionItemKind.Keyword
      },
      {
        label: "ORDER BY(ascending)",
        insertText: `ORDER BY $1 ASC `,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.MediumLow,
        kind: CompletionItemKind.Snippet,
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: "ORDER BY(descending)",
        insertText: `ORDER BY $1 DESC`,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.MediumLow,
        kind: CompletionItemKind.Snippet,
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
      }
    ])
  },
  {
    id: SuggestionKind.LimitKeyword,
    name: SuggestionKind.LimitKeyword,
    suggestions: (_, m) => Promise.resolve([
      {
        label: "LIMIT",
        insertText: `LIMIT `,
        command: TRIGGER_SUGGEST,
        sortText: CompletionItemPriority.MediumLow,
        kind: CompletionItemKind.Keyword
      }
    ])
  },
  {
    id: SuggestionKind.SortOrderDirectionKeyword,
    name: SuggestionKind.SortOrderDirectionKeyword,
    suggestions: (_, m) => Promise.resolve(
      [ASC, DESC].map((o) => ({
        label: o,
        insertText: `${o} `,
        command: TRIGGER_SUGGEST,
        kind: CompletionItemKind.Keyword
      }))
    )
  },
  {
    id: SuggestionKind.NotKeyword,
    name: SuggestionKind.NotKeyword,
    suggestions: () => Promise.resolve([
      {
        label: "NOT",
        insertText: "NOT",
        command: TRIGGER_SUGGEST,
        kind: CompletionItemKind.Keyword,
        sortText: CompletionItemPriority.High
      }
    ])
  },
  {
    id: SuggestionKind.BoolValues,
    name: SuggestionKind.BoolValues,
    suggestions: () => Promise.resolve(
      ["TRUE", "FALSE"].map((o) => ({
        label: o,
        insertText: `${o}`,
        command: TRIGGER_SUGGEST,
        kind: CompletionItemKind.Keyword,
        sortText: CompletionItemPriority.Medium
      }))
    )
  },
  {
    id: SuggestionKind.NullValue,
    name: SuggestionKind.NullValue,
    suggestions: () => Promise.resolve(
      ["NULL"].map((o) => ({
        label: o,
        insertText: `${o}`,
        command: TRIGGER_SUGGEST,
        kind: CompletionItemKind.Keyword,
        sortText: CompletionItemPriority.Low
      }))
    )
  }
];
function createMacroSuggestionItem(m) {
  return {
    label: m.name,
    insertText: `${"\\" + m.text}${argsString(m.args)} `,
    insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
    kind: CompletionItemKind.Snippet,
    documentation: m.description,
    command: TRIGGER_SUGGEST
  };
}
function argsString(args) {
  if (!args) {
    return "()";
  }
  return "(".concat(args.map((t, i) => `\${${i}:${t}}`).join(", ")).concat(")");
}

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

let sqlEditorLogger = { logger: () => {
} };
let sqlEditorLog = () => {
};
if (ui.attachDebugger && ui.createLogger) {
  sqlEditorLogger = ui.createLogger("SQLEditor");
  sqlEditorLog = sqlEditorLogger.logger;
  ui.attachDebugger("sqleditor", void 0, sqlEditorLogger);
}

const COLUMN = "column", RELATIVE_TIME_STRING = "'5m'";
const MACROS = [
  {
    id: "$__timeFilter(dateColumn)",
    name: "$__timeFilter(dateColumn)",
    text: "$__timeFilter",
    args: [COLUMN],
    type: MacroType.Filter,
    description: "Will be replaced by a time range filter using the specified column name. For example, dateColumn BETWEEN FROM_UNIXTIME(1494410783) AND FROM_UNIXTIME(1494410983)"
  },
  {
    id: "$__timeFrom()",
    name: "$__timeFrom()",
    text: "$__timeFrom",
    args: [],
    type: MacroType.Filter,
    description: "Will be replaced by the start of the currently active time selection. For example, FROM_UNIXTIME(1494410783)"
  },
  {
    id: "$__timeTo()",
    name: "$__timeTo()",
    text: "$__timeTo",
    args: [],
    type: MacroType.Filter,
    description: "Will be replaced by the end of the currently active time selection. For example, FROM_UNIXTIME(1494410983)"
  },
  {
    id: "$__timeGroup(dateColumn, '5m')",
    name: "$__timeGroup(dateColumn, '5m')",
    text: "$__timeGroup",
    args: [COLUMN, RELATIVE_TIME_STRING],
    type: MacroType.Value,
    description: "Will be replaced by an expression usable in GROUP BY clause. For example, *cast(cast(UNIX_TIMESTAMP(dateColumn)/(300) as signed)*300 as signed),*"
  },
  {
    id: "$__table",
    name: "$__table",
    text: "$__table",
    args: [],
    type: MacroType.Table,
    description: "Will be replaced by the query table."
  },
  {
    id: "$__column",
    name: "$__column",
    text: "$__column",
    args: [],
    type: MacroType.Column,
    description: "Will be replaced by the query column."
  }
];

function getStandardSQLCompletionProvider(monaco, language) {
  var _a, _b, _c;
  const provider = { triggerCharacters: [".", " ", "$", ",", "(", "'"] };
  if (language && Array.isArray(language.builtinFunctions)) {
    provider.supportedFunctions = () => language.builtinFunctions.map((f) => ({ id: f, name: f }));
  }
  const operators = [];
  if ((_a = language == null ? void 0 : language.comparisonOperators) == null ? void 0 : _a.length) {
    operators.push(
      ...language.comparisonOperators.map((f) => ({
        id: f.toLocaleLowerCase(),
        operator: f,
        type: OperatorType.Comparison
      }))
    );
  }
  language.logicalOperators = (_b = language.logicalOperators) != null ? _b : language.operators;
  if ((_c = language == null ? void 0 : language.logicalOperators) == null ? void 0 : _c.length) {
    operators.push(
      ...language.logicalOperators.map((f) => ({ id: f.toLocaleLowerCase(), operator: f, type: OperatorType.Logical }))
    );
  }
  provider.supportedOperators = () => operators;
  provider.supportedMacros = () => MACROS;
  return provider;
}

const standardSQLLanguageDefinition = {
  id: "standardSql",
  extensions: [".sql"],
  aliases: ["sql"],
  mimetypes: [],
  loader: () => Promise.resolve().then(function () { return language$1; }),
  completionProvider: getStandardSQLCompletionProvider
};

var __defProp$i = Object.defineProperty;
var __defProps$g = Object.defineProperties;
var __getOwnPropDescs$g = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$j = Object.getOwnPropertySymbols;
var __hasOwnProp$j = Object.prototype.hasOwnProperty;
var __propIsEnum$j = Object.prototype.propertyIsEnumerable;
var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$i = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$j.call(b, prop))
      __defNormalProp$i(a, prop, b[prop]);
  if (__getOwnPropSymbols$j)
    for (var prop of __getOwnPropSymbols$j(b)) {
      if (__propIsEnum$j.call(b, prop))
        __defNormalProp$i(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$g = (a, b) => __defProps$g(a, __getOwnPropDescs$g(b));
const STANDARD_SQL_LANGUAGE = "sql";
const LANGUAGES_CACHE = /* @__PURE__ */ new Map();
const INSTANCE_CACHE = /* @__PURE__ */ new Map();
const SQLEditor = ({
  children,
  onBlur,
  onChange,
  query,
  language = { id: STANDARD_SQL_LANGUAGE },
  width,
  height
}) => {
  const monacoRef = React.useRef(null);
  const langUid = React.useRef();
  const id = React.useMemo(() => {
    const uid = uuid.v4();
    const id2 = `${language.id}-${uid}`;
    langUid.current = id2;
    return id2;
  }, [language.id]);
  React.useEffect(() => {
    return () => {
      if (langUid.current) {
        INSTANCE_CACHE.delete(langUid.current);
      }
      sqlEditorLog(`Removing instance cache ${langUid.current}`, false, INSTANCE_CACHE);
    };
  }, []);
  const formatQuery = React.useCallback(() => {
    if (monacoRef.current) {
      monacoRef.current.getAction("editor.action.formatDocument").run();
    }
  }, []);
  return /* @__PURE__ */ React__default["default"].createElement("div", { style: { width } }, /* @__PURE__ */ React__default["default"].createElement(
    ui.CodeEditor,
    {
      height: height || "240px",
      width: width ? `${width - 2}px` : void 0,
      language: id,
      value: query,
      onBlur: (v) => {
        onChange && onChange(v, false);
        onBlur && onBlur();
      },
      showMiniMap: false,
      showLineNumbers: true,
      onEditorDidMount: (editor, m) => {
        monacoRef.current = editor;
        editor.onDidChangeModelContent((e) => {
          const text = editor.getValue();
          if (onChange) {
            onChange(text, false);
          }
        });
        editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.Enter, () => {
          const text = editor.getValue();
          if (onChange) {
            onChange(text, true);
          }
        });
        editor.onKeyUp((e) => {
          if (e.keyCode === 84) {
            editor.trigger(TRIGGER_SUGGEST.id, TRIGGER_SUGGEST.id, {});
          }
        });
        registerLanguageAndSuggestions(m, language, id);
      }
    }
  ), children && children({ formatQuery }));
};
const resolveLanguage = (monaco, languageDefinitionProp) => {
  if ((languageDefinitionProp == null ? void 0 : languageDefinitionProp.id) !== STANDARD_SQL_LANGUAGE && !languageDefinitionProp.loader) {
    sqlEditorLog(`Loading language '${languageDefinitionProp == null ? void 0 : languageDefinitionProp.id}' from Monaco registry`, false);
    const allLangs = monaco.languages.getLanguages();
    const custom = allLangs.find(({ id }) => id === (languageDefinitionProp == null ? void 0 : languageDefinitionProp.id));
    if (!custom) {
      throw Error(`Unknown Monaco language ${languageDefinitionProp == null ? void 0 : languageDefinitionProp.id}`);
    }
    return __spreadValues$i(__spreadValues$i({ completionProvider: getStandardSQLCompletionProvider }, custom), languageDefinitionProp);
  }
  return __spreadValues$i(__spreadValues$i({}, standardSQLLanguageDefinition), languageDefinitionProp);
};
const registerLanguageAndSuggestions = async (monaco, l, lid) => {
  const languageDefinition = resolveLanguage(monaco, l);
  if (!languageDefinition.loader) {
    return;
  }
  const { language, conf } = await languageDefinition.loader(monaco);
  monaco.languages.register({ id: lid });
  monaco.languages.setMonarchTokensProvider(lid, __spreadValues$i({}, language));
  monaco.languages.setLanguageConfiguration(lid, __spreadValues$i({}, conf));
  if (languageDefinition.formatter) {
    monaco.languages.registerDocumentFormattingEditProvider(lid, {
      provideDocumentFormattingEdits: (model) => {
        var _a;
        const formatted = (_a = l.formatter) == null ? void 0 : _a.call(l, model.getValue());
        return [
          {
            range: model.getFullModelRange(),
            text: formatted || ""
          }
        ];
      }
    });
  }
  if (languageDefinition.completionProvider) {
    const customProvider = languageDefinition.completionProvider(monaco, language);
    extendStandardRegistries(l.id, lid, customProvider);
    const languageSuggestionsRegistries = LANGUAGES_CACHE.get(l.id);
    const instanceSuggestionsRegistry = INSTANCE_CACHE.get(lid);
    const completionProvider = async (model, position, context, token) => {
      const currentToken = linkedTokenBuilder(monaco, model, position, lid);
      const statementPosition = getStatementPosition(currentToken, languageSuggestionsRegistries.positionResolvers);
      const kind = getSuggestionKinds(statementPosition, languageSuggestionsRegistries.suggestionKinds);
      sqlEditorLog("Statement position", false, statementPosition);
      sqlEditorLog("Suggestion kinds", false, kind);
      const ctx = {
        position,
        currentToken,
        statementPosition,
        kind,
        range: monaco.Range.fromPositions(position)
      };
      const stdSuggestions = await getStandardSuggestions(monaco, currentToken, kind, ctx, instanceSuggestionsRegistry);
      return {
        suggestions: stdSuggestions
      };
    };
    monaco.languages.registerCompletionItemProvider(lid, __spreadProps$g(__spreadValues$i({}, customProvider), {
      provideCompletionItems: completionProvider
    }));
  }
};
function extendStandardRegistries(id, lid, customProvider) {
  var _a;
  if (!LANGUAGES_CACHE.has(id)) {
    initializeLanguageRegistries(id);
  }
  const languageRegistries = LANGUAGES_CACHE.get(id);
  if (!INSTANCE_CACHE.has(lid)) {
    INSTANCE_CACHE.set(
      lid,
      new data.Registry(
        initStandardSuggestions(languageRegistries.functions, languageRegistries.operators, languageRegistries.macros)
      )
    );
  }
  const instanceSuggestionsRegistry = INSTANCE_CACHE.get(lid);
  if (customProvider.supportedFunctions) {
    for (const func of customProvider.supportedFunctions()) {
      const exists = languageRegistries.functions.getIfExists(func.id);
      if (!exists) {
        languageRegistries.functions.register(func);
      }
    }
  }
  if (customProvider.supportedOperators) {
    for (const op of customProvider.supportedOperators()) {
      const exists = languageRegistries.operators.getIfExists(op.id);
      if (!exists) {
        languageRegistries.operators.register(__spreadProps$g(__spreadValues$i({}, op), { name: op.id }));
      }
    }
  }
  if (customProvider.supportedMacros) {
    for (const macro of customProvider.supportedMacros()) {
      const exists = languageRegistries.macros.getIfExists(macro.id);
      if (!exists) {
        languageRegistries.macros.register(__spreadProps$g(__spreadValues$i({}, macro), { name: macro.id }));
      }
    }
  }
  if (customProvider.customStatementPlacement) {
    for (const placement of customProvider.customStatementPlacement()) {
      const exists = languageRegistries.positionResolvers.getIfExists(placement.id);
      if (!exists) {
        languageRegistries.positionResolvers.register(__spreadProps$g(__spreadValues$i({}, placement), {
          id: placement.id,
          name: placement.id
        }));
        languageRegistries.suggestionKinds.register({
          id: placement.id,
          name: placement.id,
          kind: []
        });
      } else {
        const origResolve = exists.resolve;
        exists.resolve = (...args) => {
          const ext = placement.resolve(...args);
          if (placement.overrideDefault) {
            return ext;
          }
          const orig = origResolve(...args);
          return orig || ext;
        };
      }
    }
  }
  if (customProvider.customSuggestionKinds) {
    for (const kind of customProvider.customSuggestionKinds()) {
      (_a = kind.applyTo) == null ? void 0 : _a.forEach((applyTo) => {
        const exists = languageRegistries.suggestionKinds.getIfExists(applyTo);
        if (exists) {
          if (exists.kind.indexOf(kind.id) === -1) {
            exists.kind.push(kind.id);
          }
        }
      });
      if (kind.overrideDefault) {
        const stbBehaviour = instanceSuggestionsRegistry.get(kind.id);
        if (stbBehaviour !== void 0) {
          stbBehaviour.suggestions = kind.suggestionsResolver;
          continue;
        }
      }
      instanceSuggestionsRegistry.register({
        id: kind.id,
        name: kind.id,
        suggestions: kind.suggestionsResolver
      });
    }
  }
  if (customProvider.schemas) {
    const stbBehaviour = instanceSuggestionsRegistry.get(SuggestionKind.Schemas);
    const s = stbBehaviour.suggestions;
    stbBehaviour.suggestions = async (ctx, m) => {
      const standardSchemas = await s(ctx, m);
      if (!customProvider.schemas) {
        return [...standardSchemas];
      }
      const customSchemas = await customProvider.schemas.resolve();
      const customSchemaCompletionItems = customSchemas.map((x) => {
        var _a2;
        return {
          label: x.name,
          insertText: `${(_a2 = x.completion) != null ? _a2 : x.name}.`,
          command: TRIGGER_SUGGEST,
          kind: CompletionItemKind.Module,
          // it's nice to differentiate schemas from tables
          sortText: CompletionItemPriority.High
        };
      });
      return [...standardSchemas, ...customSchemaCompletionItems];
    };
  }
  if (customProvider.tables) {
    const stbBehaviour = instanceSuggestionsRegistry.get(SuggestionKind.Tables);
    const s = stbBehaviour.suggestions;
    stbBehaviour.suggestions = async (ctx, m) => {
      var _a2, _b, _c, _d, _e;
      const o = await s(ctx, m);
      const tableToken = getTableToken(ctx.currentToken);
      const tableNameParser = (_b = (_a2 = customProvider.tables) == null ? void 0 : _a2.parseName) != null ? _b : defaultTableNameParser;
      const tableIdentifier = tableNameParser(tableToken);
      const oo = ((_e = await ((_d = (_c = customProvider.tables) == null ? void 0 : _c.resolve) == null ? void 0 : _d.call(_c, tableIdentifier))) != null ? _e : []).map((x) => {
        var _a3;
        return {
          label: x.name,
          // if no custom completion is provided it's safe to move cursor further in the statement
          insertText: `${(_a3 = x.completion) != null ? _a3 : x.name}${x.completion === x.name ? " $0" : ""}`,
          insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
          command: TRIGGER_SUGGEST,
          kind: CompletionItemKind.Field,
          sortText: CompletionItemPriority.MediumHigh
        };
      });
      return [...o, ...oo];
    };
  }
  if (customProvider.columns) {
    const stbBehaviour = instanceSuggestionsRegistry.get(SuggestionKind.Columns);
    const s = stbBehaviour.suggestions;
    stbBehaviour.suggestions = async (ctx, m) => {
      var _a2, _b, _c;
      const o = await s(ctx, m);
      const tableToken = getTableToken(ctx.currentToken);
      let tableIdentifier;
      const tableNameParser = (_b = (_a2 = customProvider.tables) == null ? void 0 : _a2.parseName) != null ? _b : defaultTableNameParser;
      if (tableToken && tableToken.value) {
        tableIdentifier = tableNameParser(tableToken);
      }
      let oo = [];
      if (tableIdentifier) {
        const columns = await ((_c = customProvider.columns) == null ? void 0 : _c.resolve(tableIdentifier));
        oo = columns ? columns.map((x) => {
          var _a3;
          return {
            label: x.name,
            insertText: (_a3 = x.completion) != null ? _a3 : x.name,
            kind: CompletionItemKind.Field,
            sortText: CompletionItemPriority.High,
            detail: x.type,
            documentation: x.description
          };
        }) : [];
      }
      return [...o, ...oo];
    };
  }
}
function initializeLanguageRegistries(id) {
  if (!LANGUAGES_CACHE.has(id)) {
    LANGUAGES_CACHE.set(id, {
      functions: new data.Registry(),
      operators: new data.Registry(),
      suggestionKinds: new data.Registry(initSuggestionsKindRegistry),
      positionResolvers: new data.Registry(initStatementPositionResolvers),
      macros: new data.Registry()
    });
  }
  return LANGUAGES_CACHE.get(id);
}

const singleLineFullQuery = {
  query: `SELECT column1, FROM table1 WHERE column1 = "value1" GROUP BY column1 ORDER BY column1 DESC LIMIT 10`,
  tokens: [
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 7,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 14,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 15,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 16,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 20,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 21,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 27,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 28,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 33,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 34,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 41,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 42,
        type: "operator.sql",
        language: "sql"
      },
      {
        offset: 43,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 44,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 45,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 51,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 52,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 53,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 58,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 59,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 61,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 62,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 69,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 70,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 75,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 76,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 78,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 79,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 86,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 87,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 91,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 92,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 97,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 98,
        type: "number.sql",
        language: "sql"
      },
      {
        offset: 100,
        type: "delimiter.sql",
        language: "sql"
      }
    ]
  ]
};

const singleLineFullQueryWithAggregation = {
  query: 'SELECT count(column1), FROM table1 WHERE column1 = "value1" GROUP BY column1 ORDER BY column1 DESC LIMIT 10;',
  tokens: [
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 7,
        type: "predefined.sql",
        language: "sql"
      },
      {
        offset: 12,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 13,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 20,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 21,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 22,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 23,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 27,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 28,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 34,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 35,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 40,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 41,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 48,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 49,
        type: "operator.sql",
        language: "sql"
      },
      {
        offset: 50,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 51,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 52,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 58,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 59,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 60,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 65,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 66,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 68,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 69,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 76,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 77,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 82,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 83,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 85,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 86,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 93,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 94,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 98,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 99,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 104,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 105,
        type: "number.sql",
        language: "sql"
      },
      {
        offset: 107,
        type: "delimiter.sql",
        language: "sql"
      }
    ]
  ]
};

const multiLineFullQuery = {
  query: `SELECT column1,
  FROM table1

  WHERE column1 = "value1"
  GROUP BY column1 ORDER BY column1 DESC
  LIMIT 10;`,
  tokens: [
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 7,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 14,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 15,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 4,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 11,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 13,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 14,
        type: "operator.sql",
        language: "sql"
      },
      {
        offset: 15,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 16,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 17,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 23,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 24,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 8,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 9,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 16,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 17,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 22,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 23,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 25,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 26,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 33,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 34,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 38,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "number.sql",
        language: "sql"
      },
      {
        offset: 8,
        type: "delimiter.sql",
        language: "sql"
      }
    ]
  ]
};

const multiLineFullQueryWithAggregation = {
  query: `SELECT count(column1),
  FROM table1

  WHERE column1 = "value1"
  GROUP BY column1 ORDER BY column1 DESC
  LIMIT 10;`,
  tokens: [
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 7,
        type: "predefined.sql",
        language: "sql"
      },
      {
        offset: 12,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 13,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 20,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 21,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 22,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 4,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 11,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 13,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 14,
        type: "operator.sql",
        language: "sql"
      },
      {
        offset: 15,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 16,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 17,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 23,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 24,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 8,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 9,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 16,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 17,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 22,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 23,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 25,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 26,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 33,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 34,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 38,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "number.sql",
        language: "sql"
      },
      {
        offset: 8,
        type: "delimiter.sql",
        language: "sql"
      }
    ]
  ]
};

const singleLineEmptyQuery = {
  query: "",
  tokens: []
};

const singleLineTwoQueries = {
  query: 'SELECT column1, FROM table1 WHERE column1 = "value1" GROUP BY column1 ORDER BY column1 DESC LIMIT 10; SELECT column2, FROM table2 WHERE column2 = "value2" GROUP BY column1 ORDER BY column2 DESC LIMIT 10;',
  tokens: [
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 7,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 14,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 15,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 16,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 20,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 21,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 27,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 28,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 33,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 34,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 41,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 42,
        type: "operator.sql",
        language: "sql"
      },
      {
        offset: 43,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 44,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 45,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 51,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 52,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 53,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 58,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 59,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 61,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 62,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 69,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 70,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 75,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 76,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 78,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 79,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 86,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 87,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 91,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 92,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 97,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 98,
        type: "number.sql",
        language: "sql"
      },
      {
        offset: 100,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 101,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 102,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 108,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 109,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 116,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 117,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 118,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 122,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 123,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 129,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 130,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 135,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 136,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 143,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 144,
        type: "operator.sql",
        language: "sql"
      },
      {
        offset: 145,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 146,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 147,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 153,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 154,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 155,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 160,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 161,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 163,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 164,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 171,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 172,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 177,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 178,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 180,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 181,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 188,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 189,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 193,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 194,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 199,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 200,
        type: "number.sql",
        language: "sql"
      },
      {
        offset: 202,
        type: "delimiter.sql",
        language: "sql"
      }
    ]
  ]
};

const singleLineTwoQueriesWithAggregation = {
  query: 'SELECT count(column1), FROM table1 WHERE column1 = "value1" GROUP BY column1 ORDER BY column1 DESC LIMIT 10; SELECT count(column2), FROM table2 WHERE column2 = "value2" GROUP BY column1 ORDER BY column2 DESC LIMIT 10;',
  tokens: [
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 7,
        type: "predefined.sql",
        language: "sql"
      },
      {
        offset: 12,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 13,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 20,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 21,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 22,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 23,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 27,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 28,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 34,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 35,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 40,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 41,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 48,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 49,
        type: "operator.sql",
        language: "sql"
      },
      {
        offset: 50,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 51,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 52,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 58,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 59,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 60,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 65,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 66,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 68,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 69,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 76,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 77,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 82,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 83,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 85,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 86,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 93,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 94,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 98,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 99,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 104,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 105,
        type: "number.sql",
        language: "sql"
      },
      {
        offset: 107,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 108,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 109,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 115,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 116,
        type: "predefined.sql",
        language: "sql"
      },
      {
        offset: 121,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 122,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 129,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 130,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 131,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 132,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 136,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 137,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 143,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 144,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 149,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 150,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 157,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 158,
        type: "operator.sql",
        language: "sql"
      },
      {
        offset: 159,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 160,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 161,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 167,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 168,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 169,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 174,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 175,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 177,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 178,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 185,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 186,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 191,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 192,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 194,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 195,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 202,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 203,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 207,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 208,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 213,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 214,
        type: "number.sql",
        language: "sql"
      },
      {
        offset: 216,
        type: "delimiter.sql",
        language: "sql"
      }
    ]
  ]
};

const singleLineMultipleColumns = {
  query: 'SELECT count(column1), column2 FROM table1 WHERE column1 = "value1" GROUP BY column1 ORDER BY column1, avg(column2) DESC LIMIT 10;',
  tokens: [
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 7,
        type: "predefined.sql",
        language: "sql"
      },
      {
        offset: 12,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 13,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 20,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 21,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 22,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 23,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 30,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 31,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 35,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 36,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 42,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 43,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 48,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 49,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 56,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 57,
        type: "operator.sql",
        language: "sql"
      },
      {
        offset: 58,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 59,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 60,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 66,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 67,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 68,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 73,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 74,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 76,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 77,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 84,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 85,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 90,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 91,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 93,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 94,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 101,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 102,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 103,
        type: "predefined.sql",
        language: "sql"
      },
      {
        offset: 106,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 107,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 114,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 115,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 116,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 120,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 121,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 126,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 127,
        type: "number.sql",
        language: "sql"
      },
      {
        offset: 129,
        type: "delimiter.sql",
        language: "sql"
      }
    ]
  ]
};

const multiLineMultipleColumns = {
  query: `SELECT count(column1), column2
  FROM table1

  WHERE column1 = "value1"
  GROUP BY column1 ORDER BY column1, avg(column2) DESC
  LIMIT 10;`,
  tokens: [
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 7,
        type: "predefined.sql",
        language: "sql"
      },
      {
        offset: 12,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 13,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 20,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 21,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 22,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 23,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 30,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 4,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 11,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 13,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 14,
        type: "operator.sql",
        language: "sql"
      },
      {
        offset: 15,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 16,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 17,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 23,
        type: "identifier.quote.sql",
        language: "sql"
      },
      {
        offset: 24,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 8,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 9,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 16,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 17,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 22,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 23,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 25,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 26,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 33,
        type: "delimiter.sql",
        language: "sql"
      },
      {
        offset: 34,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 35,
        type: "predefined.sql",
        language: "sql"
      },
      {
        offset: 38,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 39,
        type: "identifier.sql",
        language: "sql"
      },
      {
        offset: 46,
        type: "delimiter.parenthesis.sql",
        language: "sql"
      },
      {
        offset: 47,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 48,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 52,
        type: "white.sql",
        language: "sql"
      }
    ],
    [
      {
        offset: 0,
        type: "keyword.sql",
        language: "sql"
      },
      {
        offset: 5,
        type: "white.sql",
        language: "sql"
      },
      {
        offset: 6,
        type: "number.sql",
        language: "sql"
      },
      {
        offset: 8,
        type: "delimiter.sql",
        language: "sql"
      }
    ]
  ]
};

var testData = /*#__PURE__*/Object.freeze({
  __proto__: null,
  singleLineFullQuery: singleLineFullQuery,
  singleLineFullQueryWithAggregation: singleLineFullQueryWithAggregation,
  multiLineFullQuery: multiLineFullQuery,
  multiLineFullQueryWithAggregation: multiLineFullQueryWithAggregation,
  singleLineEmptyQuery: singleLineEmptyQuery,
  singleLineTwoQueries: singleLineTwoQueries,
  singleLineTwoQueriesWithAggregation: singleLineTwoQueriesWithAggregation,
  singleLineMultipleColumns: singleLineMultipleColumns,
  multiLineMultipleColumns: multiLineMultipleColumns
});

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

function TextModel(value) {
  return {
    getValue: function(eol, preserveBOM) {
      return value;
    },
    getValueInRange: function(range, eol) {
      const lines = value.split("\n");
      const line = lines[range.startLineNumber - 1];
      return line.trim().slice(range.startColumn === 0 ? 0 : range.startColumn - 1, range.endColumn - 1);
    },
    getLineLength: function(lineNumber) {
      const lines = value.split("\n");
      return lines[lineNumber - 1].trim().length;
    }
  };
}

function assertPosition(query, position, expected, monacoMock, resolversRegistry) {
  const testModel = TextModel(query);
  const current = linkedTokenBuilder(monacoMock, testModel, position);
  const statementPosition = getStatementPosition(current, resolversRegistry);
  expect(statementPosition).toContain(expected);
}
const testStatementPosition = (expected, cases, resolvers) => {
  describe(`${expected}`, () => {
    let MonacoMock;
    let statementPositionResolversRegistry;
    beforeEach(() => {
      const mockQueries = /* @__PURE__ */ new Map();
      cases.forEach((c) => mockQueries.set(c.query.query, c.query.tokens));
      MonacoMock = getMonacoMock(mockQueries);
      statementPositionResolversRegistry = new data.Registry(() => {
        return resolvers().map((r) => ({
          id: r.id,
          name: r.name || r.id,
          resolve: r.resolve
        }));
      });
    });
    cases.forEach((c) => {
      test(`${c.query.query}`, () => {
        assertPosition(
          c.query.query,
          { lineNumber: c.position.line, column: c.position.column },
          expected,
          MonacoMock,
          statementPositionResolversRegistry
        );
      });
    });
  });
};

const SQLEditorTestUtils = {
  testData,
  testStatementPosition
};

var __defProp$h = Object.defineProperty;
var __defProps$f = Object.defineProperties;
var __getOwnPropDescs$f = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$i = Object.getOwnPropertySymbols;
var __hasOwnProp$i = Object.prototype.hasOwnProperty;
var __propIsEnum$i = Object.prototype.propertyIsEnumerable;
var __defNormalProp$h = (obj, key, value) => key in obj ? __defProp$h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$h = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$i.call(b, prop))
      __defNormalProp$h(a, prop, b[prop]);
  if (__getOwnPropSymbols$i)
    for (var prop of __getOwnPropSymbols$i(b)) {
      if (__propIsEnum$i.call(b, prop))
        __defNormalProp$h(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$f = (a, b) => __defProps$f(a, __getOwnPropDescs$f(b));
var __objRest$7 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$i.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$i)
    for (var prop of __getOwnPropSymbols$i(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$i.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const AccessoryButton = (_a) => {
  var _b = _a, { className } = _b, props = __objRest$7(_b, ["className"]);
  const styles = ui.useStyles2(getButtonStyles);
  return /* @__PURE__ */ React__default["default"].createElement(ui.Button, __spreadProps$f(__spreadValues$h({}, props), { className: css.cx(className, styles.button) }));
};
const getButtonStyles = (theme) => ({
  button: css.css({
    paddingLeft: theme.spacing(3 / 2),
    paddingRight: theme.spacing(3 / 2)
  })
});

var __getOwnPropSymbols$h = Object.getOwnPropertySymbols;
var __hasOwnProp$h = Object.prototype.hasOwnProperty;
var __propIsEnum$h = Object.prototype.propertyIsEnumerable;
var __objRest$6 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$h.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$h)
    for (var prop of __getOwnPropSymbols$h(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$h.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const Stack = (_a) => {
  var _b = _a, { children } = _b, props = __objRest$6(_b, ["children"]);
  const styles = ui.useStyles2(React.useCallback((theme) => getStyles$7(theme, props), [props]));
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.root }, children);
};
const getStyles$7 = (theme, props) => {
  var _a, _b, _c;
  return {
    root: css.css({
      display: "flex",
      flexDirection: (_a = props.direction) != null ? _a : "row",
      flexWrap: ((_b = props.wrap) != null ? _b : true) ? "wrap" : void 0,
      alignItems: props.alignItems,
      gap: theme.spacing((_c = props.gap) != null ? _c : 2),
      flexGrow: props.flexGrow
    })
  };
};

const EditorFieldGroup = ({ children }) => {
  return /* @__PURE__ */ React__default["default"].createElement(Stack, { gap: 1 }, children);
};

const EditorHeader = ({ children }) => {
  const styles = ui.useStyles2(getStyles$6);
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.root }, children);
};
const getStyles$6 = (theme) => ({
  root: css.css({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing(3),
    minHeight: theme.spacing(4)
  })
});

const Space = (props) => {
  const styles = ui.useStyles2(React.useCallback((theme) => getStyles$5(theme, props), [props]));
  return /* @__PURE__ */ React__default["default"].createElement("span", { className: css.cx(styles.wrapper) });
};
Space.defaultProps = {
  v: 0,
  h: 0,
  layout: "block"
};
const getStyles$5 = (theme, props) => {
  var _a, _b;
  return {
    wrapper: css.css([
      {
        paddingRight: theme.spacing((_a = props.h) != null ? _a : 0),
        paddingBottom: theme.spacing((_b = props.v) != null ? _b : 0)
      },
      props.layout === "inline" && {
        display: "inline-block"
      },
      props.layout === "block" && {
        display: "block"
      }
    ])
  };
};

var __defProp$g = Object.defineProperty;
var __getOwnPropSymbols$g = Object.getOwnPropertySymbols;
var __hasOwnProp$g = Object.prototype.hasOwnProperty;
var __propIsEnum$g = Object.prototype.propertyIsEnumerable;
var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$g = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$g.call(b, prop))
      __defNormalProp$g(a, prop, b[prop]);
  if (__getOwnPropSymbols$g)
    for (var prop of __getOwnPropSymbols$g(b)) {
      if (__propIsEnum$g.call(b, prop))
        __defNormalProp$g(a, prop, b[prop]);
    }
  return a;
};
var __objRest$5 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$g.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$g)
    for (var prop of __getOwnPropSymbols$g(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$g.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const EditorField = (props) => {
  var _b;
  const _a = props, { label, optional, tooltip, tooltipInteractive, children, width } = _a, fieldProps = __objRest$5(_a, ["label", "optional", "tooltip", "tooltipInteractive", "children", "width"]);
  const styles = ui.useStyles2(React.useCallback((theme) => getStyles$4(theme, width), [width]));
  const childInputId = (fieldProps == null ? void 0 : fieldProps.htmlFor) || ((_b = ui.ReactUtils) == null ? void 0 : _b.getChildId(children));
  const labelEl = /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement("label", { className: styles.label, htmlFor: childInputId }, label, optional && /* @__PURE__ */ React__default["default"].createElement("span", { className: styles.optional }, " - optional"), tooltip && /* @__PURE__ */ React__default["default"].createElement(ui.Tooltip, { placement: "top", content: tooltip, theme: "info", interactive: tooltipInteractive }, /* @__PURE__ */ React__default["default"].createElement(ui.Icon, { tabIndex: 0, name: "info-circle", size: "sm", className: styles.icon }))), /* @__PURE__ */ React__default["default"].createElement(Space, { v: 0.5 }));
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.root }, /* @__PURE__ */ React__default["default"].createElement(ui.Field, __spreadValues$g({ className: styles.field, label: labelEl }, fieldProps), children));
};
const getStyles$4 = (theme, width) => {
  return {
    root: css.css({
      minWidth: theme.spacing(width != null ? width : 0)
    }),
    label: css.css({
      fontSize: 12,
      fontWeight: theme.typography.fontWeightMedium
    }),
    optional: css.css({
      fontStyle: "italic",
      color: theme.colors.text.secondary
    }),
    field: css.css({
      marginBottom: 0
      // GrafanaUI/Field has a bottom margin which we must remove
    }),
    icon: css.css({
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing(1),
      ":hover": {
        color: theme.colors.text.primary
      }
    })
  };
};

const EditorRow = ({ children }) => {
  const styles = ui.useStyles2(getStyles$3);
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.root }, /* @__PURE__ */ React__default["default"].createElement(Stack, { gap: 2 }, children));
};
const getStyles$3 = (theme) => {
  return {
    root: css.css({
      padding: theme.spacing(1),
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.shape.borderRadius(1)
    })
  };
};

const EditorList = React__default["default"].forwardRef(function EditorList2({ items, renderItem, onChange }, ref) {
  const onAddItem = () => {
    const newItems = [...items, {}];
    onChange(newItems);
  };
  const onChangeItem = (itemIndex, newItem) => {
    const newItems = [...items];
    newItems[itemIndex] = newItem;
    onChange(newItems);
  };
  const onDeleteItem = (itemIndex) => {
    const newItems = [...items];
    newItems.splice(itemIndex, 1);
    onChange(newItems);
  };
  return /* @__PURE__ */ React__default["default"].createElement(Stack, null, items.map((item, index) => /* @__PURE__ */ React__default["default"].createElement("div", { key: index }, renderItem(
    item,
    (newItem) => onChangeItem(index, newItem),
    () => onDeleteItem(index)
  ))), /* @__PURE__ */ React__default["default"].createElement(ui.Button, { ref, onClick: onAddItem, variant: "secondary", size: "md", icon: "plus", "aria-label": "Add", type: "button" }));
});

const EditorRows = ({ children }) => {
  return /* @__PURE__ */ React__default["default"].createElement(Stack, { gap: 0.5, direction: "column" }, children);
};

var __defProp$f = Object.defineProperty;
var __getOwnPropSymbols$f = Object.getOwnPropertySymbols;
var __hasOwnProp$f = Object.prototype.hasOwnProperty;
var __propIsEnum$f = Object.prototype.propertyIsEnumerable;
var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$f = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$f.call(b, prop))
      __defNormalProp$f(a, prop, b[prop]);
  if (__getOwnPropSymbols$f)
    for (var prop of __getOwnPropSymbols$f(b)) {
      if (__propIsEnum$f.call(b, prop))
        __defNormalProp$f(a, prop, b[prop]);
    }
  return a;
};
const EditorSwitch = (props) => {
  const styles = getStyles$2();
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.switch }, /* @__PURE__ */ React__default["default"].createElement(ui.Switch, __spreadValues$f({}, props)));
};
const getStyles$2 = () => {
  return {
    switch: css.css({
      display: "flex",
      alignItems: "center",
      minHeight: 30
    })
  };
};

const FlexItem = ({ grow, shrink }) => {
  return /* @__PURE__ */ React__default["default"].createElement("div", { style: { display: "block", flexGrow: grow, flexShrink: shrink } });
};

var __defProp$e = Object.defineProperty;
var __defProps$e = Object.defineProperties;
var __getOwnPropDescs$e = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$e = Object.getOwnPropertySymbols;
var __hasOwnProp$e = Object.prototype.hasOwnProperty;
var __propIsEnum$e = Object.prototype.propertyIsEnumerable;
var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$e = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$e.call(b, prop))
      __defNormalProp$e(a, prop, b[prop]);
  if (__getOwnPropSymbols$e)
    for (var prop of __getOwnPropSymbols$e(b)) {
      if (__propIsEnum$e.call(b, prop))
        __defNormalProp$e(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$e = (a, b) => __defProps$e(a, __getOwnPropDescs$e(b));
var __objRest$4 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$e.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$e)
    for (var prop of __getOwnPropSymbols$e(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$e.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function InlineSelect(_a) {
  var _b = _a, { label: labelProp } = _b, props = __objRest$4(_b, ["label"]);
  const styles = ui.useStyles2(getSelectStyles);
  const [id] = React.useState(() => Math.random().toString(16).slice(2));
  const components = {
    SelectContainer,
    ValueContainer,
    SingleValue: ValueContainer
  };
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.root }, labelProp && /* @__PURE__ */ React__default["default"].createElement("label", { className: styles.label, htmlFor: id }, labelProp, ":", "\xA0"), /* @__PURE__ */ React__default["default"].createElement(ui.Select, __spreadProps$e(__spreadValues$e({ openMenuOnFocus: true, inputId: id }, props), { components })));
}
const SelectContainer = (props) => {
  const { children } = props;
  const styles = ui.useStyles2(getSelectStyles);
  return /* @__PURE__ */ React__default["default"].createElement(ui.SelectContainer, __spreadProps$e(__spreadValues$e({}, props), { className: css.cx(props.className, styles.container) }), children);
};
const ValueContainer = (props) => {
  const { className, children } = props;
  const styles = ui.useStyles2(getSelectStyles);
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: css.cx(className, styles.valueContainer) }, children);
};
const getSelectStyles = (theme) => ({
  root: css.css({
    display: "flex",
    fontSize: 12,
    alignItems: "center"
  }),
  label: css.css({
    color: theme.colors.text.secondary,
    whiteSpace: "nowrap"
  }),
  container: css.css({
    background: "none",
    borderColor: "transparent"
  }),
  valueContainer: css.css({
    display: "flex",
    alignItems: "center",
    flex: "initial",
    color: theme.colors.text.secondary,
    fontSize: 12
  })
});

const InputGroup = ({ children }) => {
  const styles = ui.useStyles2(getStyles$1);
  const modifiedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.props.invalid) {
      return React.cloneElement(child, { className: css.cx(child.props.className, styles.invalidChild) });
    }
    return child;
  });
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.root }, modifiedChildren);
};
const borderPriority = [
  "",
  // lowest priority
  "base",
  "hovered",
  "invalid",
  "focused"
  // highest priority
];
const getStyles$1 = () => ({
  root: css.css({
    display: "flex",
    // Style the direct children of the component
    "> *": {
      "&:not(:first-child)": {
        // Negative margin hides the double-border on adjacent selects
        marginLeft: -1
      },
      "&:first-child": {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      },
      "&:last-child": {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      },
      "&:not(:first-child):not(:last-child)": {
        borderRadius: 0
      },
      //
      position: "relative",
      zIndex: borderPriority.indexOf("base"),
      // Adjacent borders are overlapping, so raise children up when hovering etc
      // so all that child's borders are visible.
      "&:hover": {
        zIndex: borderPriority.indexOf("hovered")
      },
      "&:focus-within": {
        zIndex: borderPriority.indexOf("focused")
      }
    }
  }),
  invalidChild: css.css({
    zIndex: borderPriority.indexOf("invalid")
  })
});

var __defProp$d = Object.defineProperty;
var __defProps$d = Object.defineProperties;
var __getOwnPropDescs$d = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$d = Object.getOwnPropertySymbols;
var __hasOwnProp$d = Object.prototype.hasOwnProperty;
var __propIsEnum$d = Object.prototype.propertyIsEnumerable;
var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$d = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$d.call(b, prop))
      __defNormalProp$d(a, prop, b[prop]);
  if (__getOwnPropSymbols$d)
    for (var prop of __getOwnPropSymbols$d(b)) {
      if (__propIsEnum$d.call(b, prop))
        __defNormalProp$d(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$d = (a, b) => __defProps$d(a, __getOwnPropDescs$d(b));
const DataSourceDescription = ({ dataSourceName, docsLink, hasRequiredFields = true, className }) => {
  const theme = ui.useTheme2();
  const styles = {
    container: css.css({
      p: {
        margin: 0
      },
      "p + p": {
        marginTop: theme.spacing(2)
      }
    }),
    text: css.css(__spreadProps$d(__spreadValues$d({}, theme.typography.body), {
      color: theme.colors.text.secondary,
      a: css.css({
        color: theme.colors.text.link,
        textDecoration: "underline",
        "&:hover": {
          textDecoration: "none"
        }
      })
    }))
  };
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: css.cx(styles.container, className) }, /* @__PURE__ */ React__default["default"].createElement("p", { className: styles.text }, "Before you can use the ", dataSourceName, " data source, you must configure it below or in the config file. For detailed instructions,", " ", /* @__PURE__ */ React__default["default"].createElement("a", { href: docsLink, target: "_blank", rel: "noreferrer" }, "view the documentation"), "."), hasRequiredFields && /* @__PURE__ */ React__default["default"].createElement("p", { className: styles.text }, /* @__PURE__ */ React__default["default"].createElement("i", null, "Fields marked with * are required")));
};

var __defProp$c = Object.defineProperty;
var __defProps$c = Object.defineProperties;
var __getOwnPropDescs$c = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$c = Object.getOwnPropertySymbols;
var __hasOwnProp$c = Object.prototype.hasOwnProperty;
var __propIsEnum$c = Object.prototype.propertyIsEnumerable;
var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$c = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$c.call(b, prop))
      __defNormalProp$c(a, prop, b[prop]);
  if (__getOwnPropSymbols$c)
    for (var prop of __getOwnPropSymbols$c(b)) {
      if (__propIsEnum$c.call(b, prop))
        __defNormalProp$c(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$c = (a, b) => __defProps$c(a, __getOwnPropDescs$c(b));
const GenericConfigSection = ({
  children,
  title,
  description,
  isCollapsible = false,
  isInitiallyOpen = true,
  kind = "section",
  className
}) => {
  const { colors, typography, spacing } = ui.useTheme2();
  const [isOpen, setIsOpen] = React.useState(isCollapsible ? isInitiallyOpen : true);
  const iconName = isOpen ? "angle-up" : "angle-down";
  const isSubSection = kind === "sub-section";
  const collapsibleButtonAriaLabel = `${isOpen ? "Collapse" : "Expand"} section ${title}`;
  const styles = {
    header: css.css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }),
    title: css.css({
      margin: 0
    }),
    subtitle: css.css({
      margin: 0,
      fontWeight: typography.fontWeightRegular
    }),
    descriptionText: css.css(__spreadProps$c(__spreadValues$c({
      marginTop: spacing(isSubSection ? 0.25 : 0.5),
      marginBottom: 0
    }, typography.bodySmall), {
      color: colors.text.secondary
    })),
    content: css.css({
      marginTop: spacing(2)
    })
  };
  return /* @__PURE__ */ React__default["default"].createElement("div", { className }, /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.header }, kind === "section" ? /* @__PURE__ */ React__default["default"].createElement("h3", { className: styles.title }, title) : /* @__PURE__ */ React__default["default"].createElement("h6", { className: styles.subtitle }, title), isCollapsible && /* @__PURE__ */ React__default["default"].createElement(
    ui.IconButton,
    {
      name: iconName,
      onClick: () => setIsOpen(!isOpen),
      type: "button",
      size: "xl",
      "aria-label": collapsibleButtonAriaLabel
    }
  )), description && /* @__PURE__ */ React__default["default"].createElement("p", { className: styles.descriptionText }, description), isOpen && /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.content }, children));
};

var __defProp$b = Object.defineProperty;
var __defProps$b = Object.defineProperties;
var __getOwnPropDescs$b = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$b = Object.getOwnPropertySymbols;
var __hasOwnProp$b = Object.prototype.hasOwnProperty;
var __propIsEnum$b = Object.prototype.propertyIsEnumerable;
var __defNormalProp$b = (obj, key, value) => key in obj ? __defProp$b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$b = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$b.call(b, prop))
      __defNormalProp$b(a, prop, b[prop]);
  if (__getOwnPropSymbols$b)
    for (var prop of __getOwnPropSymbols$b(b)) {
      if (__propIsEnum$b.call(b, prop))
        __defNormalProp$b(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$b = (a, b) => __defProps$b(a, __getOwnPropDescs$b(b));
var __objRest$3 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$b.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$b)
    for (var prop of __getOwnPropSymbols$b(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$b.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const ConfigSection = (_a) => {
  var _b = _a, { children } = _b, props = __objRest$3(_b, ["children"]);
  return /* @__PURE__ */ React__default["default"].createElement(GenericConfigSection, __spreadProps$b(__spreadValues$b({}, props), { kind: "section" }), children);
};

var __defProp$a = Object.defineProperty;
var __defProps$a = Object.defineProperties;
var __getOwnPropDescs$a = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$a = Object.getOwnPropertySymbols;
var __hasOwnProp$a = Object.prototype.hasOwnProperty;
var __propIsEnum$a = Object.prototype.propertyIsEnumerable;
var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$a = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$a.call(b, prop))
      __defNormalProp$a(a, prop, b[prop]);
  if (__getOwnPropSymbols$a)
    for (var prop of __getOwnPropSymbols$a(b)) {
      if (__propIsEnum$a.call(b, prop))
        __defNormalProp$a(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$a = (a, b) => __defProps$a(a, __getOwnPropDescs$a(b));
var __objRest$2 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$a.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$a)
    for (var prop of __getOwnPropSymbols$a(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$a.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const ConfigSubSection = (_a) => {
  var _b = _a, { children } = _b, props = __objRest$2(_b, ["children"]);
  return /* @__PURE__ */ React__default["default"].createElement(GenericConfigSection, __spreadProps$a(__spreadValues$a({}, props), { kind: "sub-section" }), children);
};

var __defProp$9 = Object.defineProperty;
var __defProps$9 = Object.defineProperties;
var __getOwnPropDescs$9 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$9 = Object.getOwnPropertySymbols;
var __hasOwnProp$9 = Object.prototype.hasOwnProperty;
var __propIsEnum$9 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$9 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$9.call(b, prop))
      __defNormalProp$9(a, prop, b[prop]);
  if (__getOwnPropSymbols$9)
    for (var prop of __getOwnPropSymbols$9(b)) {
      if (__propIsEnum$9.call(b, prop))
        __defNormalProp$9(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$9 = (a, b) => __defProps$9(a, __getOwnPropDescs$9(b));
var __objRest$1 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$9.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$9)
    for (var prop of __getOwnPropSymbols$9(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$9.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const CONFIGURED_TEXT$1 = "configured";
const RESET_BUTTON_TEXT$1 = "Reset";
const SecretInput = (_a) => {
  var _b = _a, { isConfigured, onReset } = _b, props = __objRest$1(_b, ["isConfigured", "onReset"]);
  return /* @__PURE__ */ React__namespace.createElement(ui.HorizontalGroup, null, !isConfigured && /* @__PURE__ */ React__namespace.createElement(ui.Input, __spreadProps$9(__spreadValues$9({}, props), { type: "password" })), isConfigured && /* @__PURE__ */ React__namespace.createElement(ui.Input, __spreadProps$9(__spreadValues$9({}, props), { type: "text", disabled: true, value: CONFIGURED_TEXT$1 })), isConfigured && /* @__PURE__ */ React__namespace.createElement(ui.Button, { onClick: onReset, variant: "secondary" }, RESET_BUTTON_TEXT$1));
};

var __defProp$8 = Object.defineProperty;
var __defProps$8 = Object.defineProperties;
var __getOwnPropDescs$8 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$8 = Object.getOwnPropertySymbols;
var __hasOwnProp$8 = Object.prototype.hasOwnProperty;
var __propIsEnum$8 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$8 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$8.call(b, prop))
      __defNormalProp$8(a, prop, b[prop]);
  if (__getOwnPropSymbols$8)
    for (var prop of __getOwnPropSymbols$8(b)) {
      if (__propIsEnum$8.call(b, prop))
        __defNormalProp$8(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$8 = (a, b) => __defProps$8(a, __getOwnPropDescs$8(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$8.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$8)
    for (var prop of __getOwnPropSymbols$8(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$8.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const CONFIGURED_TEXT = "configured";
const RESET_BUTTON_TEXT = "Reset";
const getStyles = (theme) => {
  return {
    configuredStyle: css.css`
      min-height: ${theme.spacing(theme.components.height.md)};
      padding-top: ${theme.spacing(0.5)};
      resize: none;
    `
  };
};
const SecretTextArea = (_a) => {
  var _b = _a, { isConfigured, onReset } = _b, props = __objRest(_b, ["isConfigured", "onReset"]);
  const styles = ui.useStyles2(getStyles);
  return /* @__PURE__ */ React__namespace.createElement(ui.HorizontalGroup, null, !isConfigured && /* @__PURE__ */ React__namespace.createElement(ui.TextArea, __spreadValues$8({}, props)), isConfigured && /* @__PURE__ */ React__namespace.createElement(ui.TextArea, __spreadProps$8(__spreadValues$8({}, props), { rows: 1, disabled: true, value: CONFIGURED_TEXT, className: css.cx(styles.configuredStyle) })), isConfigured && /* @__PURE__ */ React__namespace.createElement(ui.Button, { onClick: onReset, variant: "secondary" }, RESET_BUTTON_TEXT));
};

const useCommonStyles = () => {
  return {
    inlineFieldNoMarginRight: css.css({
      marginRight: 0
    }),
    // This is dirty hack to make configured secret input grow
    inlineFieldWithSecret: css.css({
      '[class$="layoutChildrenWrapper"]:first-child': {
        flexGrow: 1
      }
    })
  };
};

const BasicAuth = ({
  user,
  passwordConfigured,
  userTooltip = "The username of the data source account",
  passwordTooltip = "The password of the data source account",
  onUserChange,
  onPasswordChange,
  onPasswordReset,
  readOnly
}) => {
  const commonStyles = useCommonStyles();
  const styles = {
    lastInlineField: css.css({
      marginBottom: 0
    })
  };
  return /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement(
    ui.InlineField,
    {
      className: commonStyles.inlineFieldNoMarginRight,
      label: "User",
      labelWidth: 24,
      tooltip: userTooltip,
      required: true,
      htmlFor: "basic-auth-user-input",
      interactive: true,
      grow: true,
      disabled: readOnly
    },
    /* @__PURE__ */ React__default["default"].createElement(
      ui.Input,
      {
        id: "basic-auth-user-input",
        placeholder: "User",
        value: user,
        onChange: (e) => onUserChange(e.currentTarget.value),
        required: true
      }
    )
  ), /* @__PURE__ */ React__default["default"].createElement(
    ui.InlineField,
    {
      className: css.cx(
        commonStyles.inlineFieldNoMarginRight,
        commonStyles.inlineFieldWithSecret,
        styles.lastInlineField
      ),
      label: "Password",
      labelWidth: 24,
      tooltip: passwordTooltip,
      required: true,
      htmlFor: "basic-auth-password-input",
      interactive: true,
      grow: true,
      disabled: readOnly
    },
    /* @__PURE__ */ React__default["default"].createElement(
      SecretInput,
      {
        id: "basic-auth-password-input",
        isConfigured: passwordConfigured,
        onReset: readOnly ? () => {
        } : onPasswordReset,
        placeholder: "Password",
        onChange: (e) => onPasswordChange(e.currentTarget.value),
        required: true
      }
    )
  ));
};

var AuthMethod = /* @__PURE__ */ ((AuthMethod2) => {
  AuthMethod2["NoAuth"] = "NoAuth";
  AuthMethod2["BasicAuth"] = "BasicAuth";
  AuthMethod2["OAuthForward"] = "OAuthForward";
  AuthMethod2["CrossSiteCredentials"] = "CrossSiteCredentials";
  return AuthMethod2;
})(AuthMethod || {});

var __defProp$7 = Object.defineProperty;
var __defProps$7 = Object.defineProperties;
var __getOwnPropDescs$7 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$7 = Object.getOwnPropertySymbols;
var __hasOwnProp$7 = Object.prototype.hasOwnProperty;
var __propIsEnum$7 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$7 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$7.call(b, prop))
      __defNormalProp$7(a, prop, b[prop]);
  if (__getOwnPropSymbols$7)
    for (var prop of __getOwnPropSymbols$7(b)) {
      if (__propIsEnum$7.call(b, prop))
        __defNormalProp$7(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$7 = (a, b) => __defProps$7(a, __getOwnPropDescs$7(b));
const defaultOptions = {
  [AuthMethod.BasicAuth]: {
    label: "Basic authentication",
    value: AuthMethod.BasicAuth,
    description: "Authenticate with your data source username and password"
  },
  [AuthMethod.CrossSiteCredentials]: {
    label: "Enable cross-site access control requests",
    value: AuthMethod.CrossSiteCredentials,
    description: "Allow cross-site Access-Control requests with your existing credentials and cookies. This enables the server to authenticate the user and perform authorized requests on their behalf on other domains."
  },
  [AuthMethod.OAuthForward]: {
    label: "Forward OAuth Identity",
    value: AuthMethod.OAuthForward,
    description: "Forward the OAuth access token (and if available: the OIDC ID token) of the user querying to the data source"
  },
  [AuthMethod.NoAuth]: {
    label: "No Authentication",
    value: AuthMethod.NoAuth,
    description: "Data source is available without authentication"
  }
};
const AuthMethodSettings = ({
  selectedMethod,
  mostCommonMethod,
  visibleMethods: visibleMethodsFromProps,
  extendedDefaultOptions,
  customMethods,
  onAuthMethodSelect,
  basicAuth,
  readOnly
}) => {
  var _a, _b, _c, _d;
  const [authMethodChanged, setAuthMethodChanged] = React.useState(false);
  const { colors, spacing } = ui.useTheme2();
  const visibleMethods = React.useMemo(
    () => {
      var _a2;
      return visibleMethodsFromProps != null ? visibleMethodsFromProps : [
        AuthMethod.BasicAuth,
        AuthMethod.OAuthForward,
        AuthMethod.NoAuth,
        ...(_a2 = customMethods == null ? void 0 : customMethods.map((m) => m.id)) != null ? _a2 : []
      ];
    },
    [customMethods, visibleMethodsFromProps]
  );
  const hasSelect = visibleMethods.length > 1;
  const preparedOptions = React.useMemo(() => {
    var _a2;
    const customOptions = (_a2 = customMethods == null ? void 0 : customMethods.reduce((acc, method) => {
      acc[method.id] = {
        label: method.label,
        value: method.id,
        description: method.description
      };
      return acc;
    }, {})) != null ? _a2 : {};
    const preparedDefaultOptions = {};
    let k;
    for (k in defaultOptions) {
      if (extendedDefaultOptions && extendedDefaultOptions[k]) {
        preparedDefaultOptions[k] = __spreadValues$7(__spreadValues$7({}, defaultOptions[k]), extendedDefaultOptions[k]);
      } else {
        preparedDefaultOptions[k] = defaultOptions[k];
      }
    }
    const allOptions = __spreadValues$7(__spreadValues$7({}, customOptions), preparedDefaultOptions);
    return visibleMethods.filter((method) => Boolean(allOptions[method])).map((method) => {
      const option = allOptions[method];
      if (method === mostCommonMethod && hasSelect) {
        return __spreadProps$7(__spreadValues$7({}, option), {
          label: `${option.label} (most common)`
        });
      }
      return option;
    });
  }, [visibleMethods, customMethods, extendedDefaultOptions, mostCommonMethod, hasSelect]);
  let selected = selectedMethod;
  if (!hasSelect) {
    selected = visibleMethods[0];
  } else if (selectedMethod === AuthMethod.NoAuth && mostCommonMethod && !authMethodChanged) {
    selected = mostCommonMethod;
  }
  let AuthFieldsComponent = null;
  if (selected === AuthMethod.BasicAuth && basicAuth) {
    AuthFieldsComponent = /* @__PURE__ */ React__default["default"].createElement(BasicAuth, __spreadProps$7(__spreadValues$7({}, basicAuth), { readOnly }));
  } else if (selected.startsWith("custom-")) {
    AuthFieldsComponent = (_b = (_a = customMethods == null ? void 0 : customMethods.find((m) => m.id === selected)) == null ? void 0 : _a.component) != null ? _b : null;
  }
  const title = hasSelect ? "Authentication methods" : (_c = preparedOptions[0].label) != null ? _c : "";
  const description = hasSelect ? "Choose an authentication method to access the data source" : (_d = preparedOptions[0].description) != null ? _d : "";
  const styles = {
    authMethods: css.css(__spreadValues$7({
      marginTop: spacing(2.5)
    }, hasSelect && {
      padding: spacing(2),
      border: `1px solid ${colors.border.weak}`
    })),
    selectedMethodFields: css.css({
      marginTop: spacing(1.5)
    })
  };
  return /* @__PURE__ */ React__default["default"].createElement(ConfigSubSection, { title, description }, /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.authMethods }, hasSelect && /* @__PURE__ */ React__default["default"].createElement(
    ui.Select,
    {
      options: preparedOptions,
      value: selected,
      onChange: (option) => {
        setAuthMethodChanged(true);
        onAuthMethodSelect(option.value);
      },
      disabled: readOnly
    }
  ), AuthFieldsComponent && /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.selectedMethodFields }, AuthFieldsComponent)));
};

const TLSSettingsSection = ({ children, enabled, label, tooltipText, onToggle, readOnly }) => {
  const { colors, spacing } = ui.useTheme2();
  const styles = {
    container: css.css({
      marginTop: 3
    }),
    checkboxContainer: css.css({
      display: "flex",
      alignItems: "center"
    }),
    infoIcon: css.css({
      marginTop: -2,
      marginLeft: 5,
      color: colors.text.secondary
    }),
    content: css.css({
      margin: spacing(1, 0, 2, 3)
    })
  };
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.container }, /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.checkboxContainer }, /* @__PURE__ */ React__default["default"].createElement(ui.Checkbox, { value: enabled, label, onChange: () => onToggle(!enabled), disabled: readOnly }), /* @__PURE__ */ React__default["default"].createElement(ui.Tooltip, { placement: "top", content: tooltipText, interactive: true }, /* @__PURE__ */ React__default["default"].createElement(ui.Icon, { name: "info-circle", className: styles.infoIcon, size: "sm" }))), enabled && children && /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.content }, children));
};

const SelfSignedCertificate = ({
  enabled,
  certificateConfigured,
  onToggle,
  onCertificateChange,
  onCertificateReset,
  tooltips,
  readOnly
}) => {
  var _a;
  const commonStyles = useCommonStyles();
  return /* @__PURE__ */ React__default["default"].createElement(
    TLSSettingsSection,
    {
      enabled,
      label: "Add self-signed certificate",
      tooltipText: "Add your own Certificate Authority (CA) certificate on top of one generated by the certificate authorities for additional security measures",
      onToggle: (newEnabled) => onToggle(newEnabled),
      readOnly
    },
    /* @__PURE__ */ React__default["default"].createElement(
      ui.InlineField,
      {
        label: "CA Certificate",
        labelWidth: 24,
        tooltip: (_a = tooltips == null ? void 0 : tooltips.certificateLabel) != null ? _a : "Your self-signed certificate",
        required: true,
        htmlFor: "self-signed-certificate-input",
        interactive: true,
        grow: true,
        className: css.cx(commonStyles.inlineFieldNoMarginRight, commonStyles.inlineFieldWithSecret),
        disabled: readOnly
      },
      /* @__PURE__ */ React__default["default"].createElement(
        SecretTextArea,
        {
          id: "self-signed-certificate-input",
          isConfigured: certificateConfigured,
          onChange: (e) => onCertificateChange(e.currentTarget.value),
          onReset: readOnly ? () => {
          } : onCertificateReset,
          placeholder: "Begins with --- BEGIN CERTIFICATE ---",
          rows: 6,
          required: true
        }
      )
    )
  );
};

const TLSClientAuth = ({
  enabled,
  serverName,
  clientCertificateConfigured,
  clientKeyConfigured,
  onToggle,
  onServerNameChange,
  onClientCertificateChange,
  onClientKeyChange,
  onClientCertificateReset,
  onClientKeyReset,
  tooltips,
  readOnly
}) => {
  var _a, _b, _c;
  const commonStyles = useCommonStyles();
  return /* @__PURE__ */ React__default["default"].createElement(
    TLSSettingsSection,
    {
      enabled,
      label: "TLS Client Authentication",
      tooltipText: "Validate using TLS client authentication, in which the server authenticates the client",
      onToggle: (newEnabled) => onToggle(newEnabled),
      readOnly
    },
    /* @__PURE__ */ React__default["default"].createElement(
      ui.InlineField,
      {
        label: "ServerName",
        labelWidth: 24,
        tooltip: (_a = tooltips == null ? void 0 : tooltips.serverNameLabel) != null ? _a : "A Servername is used to verify the hostname on the returned certificate",
        required: true,
        htmlFor: "client-auth-servername-input",
        interactive: true,
        grow: true,
        className: commonStyles.inlineFieldNoMarginRight,
        disabled: readOnly
      },
      /* @__PURE__ */ React__default["default"].createElement(
        ui.Input,
        {
          id: "client-auth-servername-input",
          placeholder: "domain.example.com",
          value: serverName,
          onChange: (e) => onServerNameChange(e.currentTarget.value),
          required: true
        }
      )
    ),
    /* @__PURE__ */ React__default["default"].createElement(
      ui.InlineField,
      {
        label: "Client Certificate",
        labelWidth: 24,
        tooltip: (_b = tooltips == null ? void 0 : tooltips.certificateLabel) != null ? _b : "The client certificate can be generated from a Certificate Authority or be self-signed",
        required: true,
        htmlFor: "client-auth-client-certificate-input",
        interactive: true,
        grow: true,
        className: css.cx(commonStyles.inlineFieldNoMarginRight, commonStyles.inlineFieldWithSecret),
        disabled: readOnly
      },
      /* @__PURE__ */ React__default["default"].createElement(
        SecretTextArea,
        {
          id: "client-auth-client-certificate-input",
          isConfigured: clientCertificateConfigured,
          onChange: (e) => onClientCertificateChange(e.currentTarget.value),
          onReset: readOnly ? () => {
          } : onClientCertificateReset,
          placeholder: "Begins with --- BEGIN CERTIFICATE ---",
          rows: 6,
          required: true
        }
      )
    ),
    /* @__PURE__ */ React__default["default"].createElement(
      ui.InlineField,
      {
        label: "Client Key",
        labelWidth: 24,
        tooltip: (_c = tooltips == null ? void 0 : tooltips.keyLabel) != null ? _c : "The client key can be generated from a Certificate Authority or be self-signed",
        required: true,
        htmlFor: "client-auth-client-key-input",
        interactive: true,
        grow: true,
        className: css.cx(commonStyles.inlineFieldNoMarginRight, commonStyles.inlineFieldWithSecret),
        disabled: readOnly
      },
      /* @__PURE__ */ React__default["default"].createElement(
        SecretTextArea,
        {
          id: "client-auth-client-key-input",
          isConfigured: clientKeyConfigured,
          onChange: (e) => onClientKeyChange(e.currentTarget.value),
          onReset: readOnly ? () => {
          } : onClientKeyReset,
          placeholder: `Begins with --- RSA PRIVATE KEY CERTIFICATE ---`,
          rows: 6,
          required: true
        }
      )
    )
  );
};

const SkipTLSVerification = ({ enabled, onToggle, readOnly }) => {
  return /* @__PURE__ */ React__default["default"].createElement(
    TLSSettingsSection,
    {
      enabled,
      label: "Skip TLS certificate validation",
      tooltipText: "Skipping TLS certificate validation is not recommended unless absolutely necessary or for testing",
      onToggle: (newEnabled) => onToggle(newEnabled),
      readOnly
    }
  );
};

var __defProp$6 = Object.defineProperty;
var __defProps$6 = Object.defineProperties;
var __getOwnPropDescs$6 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$6 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$6.call(b, prop))
      __defNormalProp$6(a, prop, b[prop]);
  if (__getOwnPropSymbols$6)
    for (var prop of __getOwnPropSymbols$6(b)) {
      if (__propIsEnum$6.call(b, prop))
        __defNormalProp$6(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$6 = (a, b) => __defProps$6(a, __getOwnPropDescs$6(b));
const TLSSettings = ({
  selfSignedCertificate,
  TLSClientAuth: TLSClientAuth$1,
  skipTLSVerification,
  readOnly
}) => {
  const { spacing } = ui.useTheme2();
  const styles = {
    container: css.css({
      marginTop: spacing(3)
    })
  };
  return /* @__PURE__ */ React__default["default"].createElement(
    ConfigSubSection,
    {
      className: styles.container,
      title: "TLS settings",
      description: "Additional security measures that can be applied on top of authentication"
    },
    /* @__PURE__ */ React__default["default"].createElement(SelfSignedCertificate, __spreadProps$6(__spreadValues$6({}, selfSignedCertificate), { readOnly })),
    /* @__PURE__ */ React__default["default"].createElement(TLSClientAuth, __spreadProps$6(__spreadValues$6({}, TLSClientAuth$1), { readOnly })),
    /* @__PURE__ */ React__default["default"].createElement(SkipTLSVerification, __spreadProps$6(__spreadValues$6({}, skipTLSVerification), { readOnly }))
  );
};

var __defProp$5 = Object.defineProperty;
var __defProps$5 = Object.defineProperties;
var __getOwnPropDescs$5 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$5 = Object.getOwnPropertySymbols;
var __hasOwnProp$5 = Object.prototype.hasOwnProperty;
var __propIsEnum$5 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$5 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$5.call(b, prop))
      __defNormalProp$5(a, prop, b[prop]);
  if (__getOwnPropSymbols$5)
    for (var prop of __getOwnPropSymbols$5(b)) {
      if (__propIsEnum$5.call(b, prop))
        __defNormalProp$5(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$5 = (a, b) => __defProps$5(a, __getOwnPropDescs$5(b));
const CustomHeader = ({ header, onChange, onBlur, onDelete, readOnly }) => {
  const { spacing } = ui.useTheme2();
  const commonStyles = useCommonStyles();
  const styles = {
    container: css.css({
      alignItems: "center"
    }),
    input: css.css({
      minWidth: "100%"
    }),
    headerNameField: css.css({
      width: "40%",
      marginRight: 0,
      paddingRight: spacing(1)
    }),
    headerValueField: css.css({
      width: "45%",
      marginRight: 0
    }),
    removeHeaderBtn: css.css({
      margin: `0 0 3px 10px`
    })
  };
  return /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement(ui.InlineFieldRow, { className: styles.container }, /* @__PURE__ */ React__default["default"].createElement(
    ui.InlineField,
    {
      label: "Header",
      labelWidth: 9,
      grow: true,
      className: styles.headerNameField,
      htmlFor: `custom-header-${header.id}-name-input`,
      disabled: readOnly
    },
    /* @__PURE__ */ React__default["default"].createElement(
      ui.Input,
      {
        id: `custom-header-${header.id}-name-input`,
        placeholder: "X-Custom-Header",
        value: header.name,
        width: 12,
        onChange: (e) => onChange(__spreadProps$5(__spreadValues$5({}, header), { name: e.currentTarget.value })),
        onBlur,
        className: styles.input
      }
    )
  ), /* @__PURE__ */ React__default["default"].createElement(
    ui.InlineField,
    {
      label: "Value",
      labelWidth: 9,
      grow: true,
      className: css.cx(commonStyles.inlineFieldWithSecret, styles.headerValueField),
      htmlFor: `custom-header-${header.id}-value-input`,
      disabled: readOnly
    },
    /* @__PURE__ */ React__default["default"].createElement(
      SecretInput,
      {
        id: `custom-header-${header.id}-value-input`,
        isConfigured: header.configured,
        placeholder: "Header value",
        value: header.value,
        width: 12,
        onChange: (e) => onChange(__spreadProps$5(__spreadValues$5({}, header), { value: e.currentTarget.value })),
        onReset: readOnly ? () => {
        } : () => onChange(__spreadProps$5(__spreadValues$5({}, header), { configured: false, value: "" })),
        onBlur,
        className: styles.input
      }
    )
  ), /* @__PURE__ */ React__default["default"].createElement(
    ui.IconButton,
    {
      name: "trash-alt",
      tooltip: "Remove header",
      tooltipPlacement: "top",
      className: styles.removeHeaderBtn,
      onClick: onDelete,
      type: "button",
      disabled: readOnly
    }
  )));
};

var __defProp$4 = Object.defineProperty;
var __defProps$4 = Object.defineProperties;
var __getOwnPropDescs$4 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$4 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$4.call(b, prop))
      __defNormalProp$4(a, prop, b[prop]);
  if (__getOwnPropSymbols$4)
    for (var prop of __getOwnPropSymbols$4(b)) {
      if (__propIsEnum$4.call(b, prop))
        __defNormalProp$4(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$4 = (a, b) => __defProps$4(a, __getOwnPropDescs$4(b));
const CustomHeaders = ({ headers: headersFromProps, onChange, readOnly }) => {
  const { spacing } = ui.useTheme2();
  const [headers, setHeaders] = React.useState(
    headersFromProps.map((header) => __spreadProps$4(__spreadValues$4({}, header), {
      id: uniqueId(),
      value: ""
    }))
  );
  React.useEffect(() => {
    setHeaders((headers2) => {
      let changed = false;
      const newHeaders = headers2.map((header) => {
        var _a;
        const configured = (_a = headersFromProps.find((h) => h.name === header.name)) == null ? void 0 : _a.configured;
        if (typeof configured !== "undefined" && header.configured !== configured) {
          changed = true;
          return __spreadProps$4(__spreadValues$4({}, header), { configured });
        }
        return header;
      });
      if (changed) {
        return newHeaders;
      }
      return headers2;
    });
  }, [headersFromProps]);
  const onHeaderAdd = () => {
    setHeaders([...headers, { id: uniqueId(), name: "", value: "", configured: false }]);
  };
  const onHeaderChange = (id, header) => {
    setHeaders(headers.map((h) => h.id === id ? __spreadValues$4({}, header) : h));
  };
  const onHeaderDelete = (id) => {
    const index = headers.findIndex((h) => h.id === id);
    if (index === -1) {
      return;
    }
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
    onChange(
      newHeaders.map(({ name, value, configured }) => ({
        name,
        value,
        configured
      }))
    );
  };
  const onBlur = () => {
    onChange(
      headers.map(({ name, value, configured }) => ({
        name,
        value,
        configured
      }))
    );
  };
  const styles = {
    container: css.css({
      marginTop: spacing(3)
    }),
    addHeaderButton: css.css({
      marginTop: spacing(1.5)
    })
  };
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.container }, /* @__PURE__ */ React__default["default"].createElement(
    ConfigSubSection,
    {
      title: "HTTP headers",
      description: "Pass along additional context and metadata about the request/response",
      isCollapsible: true,
      isInitiallyOpen: headers.length > 0
    },
    /* @__PURE__ */ React__default["default"].createElement("div", null, headers.map((header) => /* @__PURE__ */ React__default["default"].createElement(
      CustomHeader,
      {
        key: header.id,
        header,
        onChange: (header2) => onHeaderChange(header2.id, header2),
        onDelete: () => onHeaderDelete(header.id),
        onBlur,
        readOnly
      }
    ))),
    /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.addHeaderButton }, /* @__PURE__ */ React__default["default"].createElement(ui.Button, { icon: "plus", variant: "secondary", fill: "outline", onClick: onHeaderAdd, disabled: readOnly }, headers.length === 0 ? "Add header" : "Add another header"))
  ));
};
function uniqueId() {
  return Math.random().toString(16).slice(2);
}

var __defProp$3 = Object.defineProperty;
var __defProps$3 = Object.defineProperties;
var __getOwnPropDescs$3 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$3 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$3.call(b, prop))
      __defNormalProp$3(a, prop, b[prop]);
  if (__getOwnPropSymbols$3)
    for (var prop of __getOwnPropSymbols$3(b)) {
      if (__propIsEnum$3.call(b, prop))
        __defNormalProp$3(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$3 = (a, b) => __defProps$3(a, __getOwnPropDescs$3(b));
const Auth = ({
  selectedMethod,
  mostCommonMethod,
  visibleMethods,
  extendedDefaultOptions,
  customMethods,
  onAuthMethodSelect,
  basicAuth,
  TLS,
  customHeaders,
  readOnly = false
}) => {
  const styles = {
    container: css.css({
      maxWidth: 578
    })
  };
  return /* @__PURE__ */ React__default["default"].createElement("div", { className: styles.container }, /* @__PURE__ */ React__default["default"].createElement(ConfigSection, { title: "Authentication" }, /* @__PURE__ */ React__default["default"].createElement(
    AuthMethodSettings,
    {
      selectedMethod,
      mostCommonMethod,
      customMethods,
      visibleMethods,
      extendedDefaultOptions,
      onAuthMethodSelect,
      basicAuth,
      readOnly
    }
  ), TLS && /* @__PURE__ */ React__default["default"].createElement(TLSSettings, __spreadProps$3(__spreadValues$3({}, TLS), { readOnly })), customHeaders && /* @__PURE__ */ React__default["default"].createElement(CustomHeaders, __spreadProps$3(__spreadValues$3({}, customHeaders), { readOnly }))));
};

var __defProp$2 = Object.defineProperty;
var __defProps$2 = Object.defineProperties;
var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2.call(b, prop))
      __defNormalProp$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(b)) {
      if (__propIsEnum$2.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
const headerNamePrefix = "httpHeaderName";
const headerValuePrefix = "httpHeaderValue";
function convertLegacyAuthProps({
  config,
  onChange
}) {
  const props = {
    selectedMethod: getSelectedMethod(config),
    onAuthMethodSelect: getOnAuthMethodSelectHandler(config, onChange),
    basicAuth: getBasicAuthProps(config, onChange),
    TLS: getTLSProps(config, onChange),
    customHeaders: getCustomHeaders(config, onChange),
    readOnly: config.readOnly
  };
  return props;
}
function getSelectedMethod(config) {
  if (config.basicAuth) {
    return AuthMethod.BasicAuth;
  }
  if (config.withCredentials) {
    return AuthMethod.CrossSiteCredentials;
  }
  if (config.jsonData.oauthPassThru) {
    return AuthMethod.OAuthForward;
  }
  return AuthMethod.NoAuth;
}
function getOnAuthMethodSelectHandler(config, onChange) {
  return (method) => {
    onChange(__spreadProps$2(__spreadValues$2({}, config), {
      basicAuth: method === AuthMethod.BasicAuth,
      withCredentials: method === AuthMethod.CrossSiteCredentials,
      jsonData: __spreadProps$2(__spreadValues$2({}, config.jsonData), {
        oauthPassThru: method === AuthMethod.OAuthForward
      })
    }));
  };
}
function getBasicAuthProps(config, onChange) {
  return {
    user: config.basicAuthUser,
    passwordConfigured: config.secureJsonFields.basicAuthPassword,
    onUserChange: (user) => onChange(__spreadProps$2(__spreadValues$2({}, config), { basicAuthUser: user })),
    onPasswordChange: (password) => onChange(__spreadProps$2(__spreadValues$2({}, config), {
      secureJsonData: __spreadProps$2(__spreadValues$2({}, config.secureJsonData), {
        basicAuthPassword: password
      })
    })),
    onPasswordReset: () => onChange(__spreadProps$2(__spreadValues$2({}, config), {
      secureJsonData: __spreadProps$2(__spreadValues$2({}, config.secureJsonData), { basicAuthPassword: "" }),
      secureJsonFields: __spreadProps$2(__spreadValues$2({}, config.secureJsonFields), {
        basicAuthPassword: false
      })
    }))
  };
}
function getTLSProps(config, onChange) {
  return {
    selfSignedCertificate: {
      enabled: Boolean(config.jsonData.tlsAuthWithCACert),
      certificateConfigured: config.secureJsonFields.tlsCACert,
      onToggle: (enabled) => onChange(__spreadProps$2(__spreadValues$2({}, config), {
        jsonData: __spreadProps$2(__spreadValues$2({}, config.jsonData), { tlsAuthWithCACert: enabled })
      })),
      onCertificateChange: (certificate) => onChange(__spreadProps$2(__spreadValues$2({}, config), {
        secureJsonData: __spreadProps$2(__spreadValues$2({}, config.secureJsonData), { tlsCACert: certificate })
      })),
      onCertificateReset: () => onChange(__spreadProps$2(__spreadValues$2({}, config), {
        secureJsonData: __spreadProps$2(__spreadValues$2({}, config.secureJsonData), { tlsCACert: "" }),
        secureJsonFields: __spreadProps$2(__spreadValues$2({}, config.secureJsonFields), { tlsCACert: false })
      }))
    },
    TLSClientAuth: {
      enabled: config.jsonData.tlsAuth,
      serverName: config.jsonData.serverName,
      clientCertificateConfigured: config.secureJsonFields.tlsClientCert,
      clientKeyConfigured: config.secureJsonFields.tlsClientKey,
      onToggle: (enabled) => onChange(__spreadProps$2(__spreadValues$2({}, config), {
        jsonData: __spreadProps$2(__spreadValues$2({}, config.jsonData), { tlsAuth: enabled })
      })),
      onServerNameChange: (serverName) => onChange(__spreadProps$2(__spreadValues$2({}, config), {
        jsonData: __spreadProps$2(__spreadValues$2({}, config.jsonData), { serverName })
      })),
      onClientCertificateChange: (clientCertificate) => onChange(__spreadProps$2(__spreadValues$2({}, config), {
        secureJsonData: __spreadProps$2(__spreadValues$2({}, config.secureJsonData), {
          tlsClientCert: clientCertificate
        })
      })),
      onClientCertificateReset: () => onChange(__spreadProps$2(__spreadValues$2({}, config), {
        secureJsonData: __spreadProps$2(__spreadValues$2({}, config.secureJsonData), {
          tlsClientCert: ""
        }),
        secureJsonFields: __spreadProps$2(__spreadValues$2({}, config.secureJsonFields), {
          tlsClientCert: false
        })
      })),
      onClientKeyChange: (clientKey) => onChange(__spreadProps$2(__spreadValues$2({}, config), {
        secureJsonData: __spreadProps$2(__spreadValues$2({}, config.secureJsonData), {
          tlsClientKey: clientKey
        })
      })),
      onClientKeyReset: () => onChange(__spreadProps$2(__spreadValues$2({}, config), {
        secureJsonData: __spreadProps$2(__spreadValues$2({}, config.secureJsonData), {
          tlsClientKey: ""
        }),
        secureJsonFields: __spreadProps$2(__spreadValues$2({}, config.secureJsonFields), {
          tlsClientKey: false
        })
      }))
    },
    skipTLSVerification: {
      enabled: config.jsonData.tlsSkipVerify,
      onToggle: (enabled) => onChange(__spreadProps$2(__spreadValues$2({}, config), {
        jsonData: __spreadProps$2(__spreadValues$2({}, config.jsonData), { tlsSkipVerify: enabled })
      }))
    }
  };
}
function getCustomHeaders(config, onChange) {
  const headers = Object.keys(config.jsonData).filter((key) => key.startsWith(headerNamePrefix)).sort().map((key) => {
    var _a;
    const index = key.slice(headerNamePrefix.length);
    return {
      name: config.jsonData[key],
      configured: (_a = config.secureJsonFields[`${headerValuePrefix}${index}`]) != null ? _a : false
    };
  });
  return {
    headers,
    onChange: (headers2) => {
      const newJsonData = Object.fromEntries(
        Object.entries(config.jsonData).filter(([key]) => !key.startsWith(headerNamePrefix))
      );
      const newSecureJsonData = Object.fromEntries(
        Object.entries(config.secureJsonData || {}).filter(([key]) => !key.startsWith(headerValuePrefix))
      );
      const newSecureJsonFields = Object.fromEntries(
        Object.entries(config.secureJsonFields).filter(([key]) => !key.startsWith(headerValuePrefix))
      );
      headers2.forEach((header, index) => {
        newJsonData[`${headerNamePrefix}${index + 1}`] = header.name;
        if (header.configured) {
          newSecureJsonFields[`${headerValuePrefix}${index + 1}`] = true;
        } else {
          newSecureJsonData[`${headerValuePrefix}${index + 1}`] = header.value;
        }
      });
      onChange(__spreadProps$2(__spreadValues$2({}, config), {
        jsonData: newJsonData,
        secureJsonData: newSecureJsonData,
        secureJsonFields: newSecureJsonFields
      }));
    }
  };
}

var __defProp$1 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
const ConnectionSettings = ({
  config,
  onChange,
  description,
  urlPlaceholder,
  urlTooltip,
  urlLabel,
  className
}) => {
  const isValidUrl = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(
    config.url
  );
  const styles = {
    container: css.css({
      maxWidth: 578
    })
  };
  return /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement(ConfigSection, { title: "Connection", description, className: css.cx(styles.container, className) }, /* @__PURE__ */ React__default["default"].createElement(
    ui.InlineField,
    {
      htmlFor: "connection-url",
      label: urlLabel || "URL",
      labelWidth: 24,
      tooltip: urlTooltip || /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, "Specify a complete HTTP URL", /* @__PURE__ */ React__default["default"].createElement("br", null), "(for example https://example.com:8080)"),
      grow: true,
      disabled: config.readOnly,
      required: true,
      invalid: !isValidUrl && !config.readOnly,
      error: isValidUrl ? "" : "Please enter a valid URL",
      interactive: true
    },
    /* @__PURE__ */ React__default["default"].createElement(
      ui.Input,
      {
        id: "connection-url",
        "aria-label": "Data source connection URL",
        onChange: (event) => onChange(__spreadProps$1(__spreadValues$1({}, config), {
          url: event.currentTarget.value
        })),
        value: config.url || "",
        placeholder: urlPlaceholder || "URL"
      }
    )
  )));
};

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const AdvancedHttpSettings = ({
  config,
  onChange,
  className
}) => {
  const onCookiesChange = (cookies) => {
    onChange(__spreadProps(__spreadValues({}, config), {
      jsonData: __spreadProps(__spreadValues({}, config.jsonData), {
        keepCookies: cookies
      })
    }));
  };
  const onTimeoutChange = (event) => {
    onChange(__spreadProps(__spreadValues({}, config), {
      jsonData: __spreadProps(__spreadValues({}, config.jsonData), {
        timeout: parseInt(event.currentTarget.value, 10)
      })
    }));
  };
  const styles = {
    container: css.css({
      maxWidth: 578
    })
  };
  return /* @__PURE__ */ React__default["default"].createElement(ConfigSubSection, { title: "Advanced HTTP settings", className: css.cx(styles.container, className) }, /* @__PURE__ */ React__default["default"].createElement(
    ui.InlineField,
    {
      htmlFor: "advanced-http-cookies",
      label: "Allowed cookies",
      labelWidth: 24,
      tooltip: "Grafana proxy deletes forwarded cookies by default. Specify cookies by name that should be forwarded to the data source.",
      disabled: config.readOnly,
      grow: true
    },
    /* @__PURE__ */ React__default["default"].createElement(
      ui.TagsInput,
      {
        id: "advanced-http-cookies",
        placeholder: "New cookie (hit enter to add)",
        tags: config.jsonData.keepCookies,
        onChange: onCookiesChange
      }
    )
  ), /* @__PURE__ */ React__default["default"].createElement(
    ui.InlineField,
    {
      htmlFor: "advanced-http-timeout",
      label: "Timeout",
      labelWidth: 24,
      tooltip: "HTTP request timeout in seconds",
      disabled: config.readOnly,
      grow: true
    },
    /* @__PURE__ */ React__default["default"].createElement(
      ui.Input,
      {
        id: "advanced-http-timeout",
        type: "number",
        min: 0,
        placeholder: "Timeout in seconds",
        "aria-label": "Timeout in seconds",
        value: config.jsonData.timeout,
        onChange: onTimeoutChange
      }
    )
  ));
};

exports.AccessoryButton = AccessoryButton;
exports.AdvancedHttpSettings = AdvancedHttpSettings;
exports.Auth = Auth;
exports.AuthMethod = AuthMethod;
exports.CompletionItemInsertTextRule = CompletionItemInsertTextRule;
exports.CompletionItemKind = CompletionItemKind;
exports.CompletionItemPriority = CompletionItemPriority;
exports.ConfigSection = ConfigSection;
exports.ConfigSubSection = ConfigSubSection;
exports.ConnectionSettings = ConnectionSettings;
exports.DataSourceDescription = DataSourceDescription;
exports.EditorField = EditorField;
exports.EditorFieldGroup = EditorFieldGroup;
exports.EditorHeader = EditorHeader;
exports.EditorList = EditorList;
exports.EditorMode = EditorMode;
exports.EditorRow = EditorRow;
exports.EditorRows = EditorRows;
exports.EditorSwitch = EditorSwitch;
exports.FlexItem = FlexItem;
exports.InlineSelect = InlineSelect;
exports.InputGroup = InputGroup;
exports.LinkedToken = LinkedToken;
exports.MacroType = MacroType;
exports.OperatorType = OperatorType;
exports.SQLEditor = SQLEditor;
exports.SQLEditorTestUtils = SQLEditorTestUtils;
exports.Space = Space;
exports.Stack = Stack;
exports.StatementPosition = StatementPosition;
exports.SuggestionKind = SuggestionKind;
exports.TokenType = TokenType;
exports.convertLegacyAuthProps = convertLegacyAuthProps;
exports.getStandardSQLCompletionProvider = getStandardSQLCompletionProvider;
exports.grafanaStandardSQLLanguage = language;
exports.grafanaStandardSQLLanguageConf = conf;
exports.llms = index;
//# sourceMappingURL=index.js.map
