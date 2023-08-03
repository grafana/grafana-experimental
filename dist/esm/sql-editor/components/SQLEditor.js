import { CodeEditor } from '@grafana/ui';
import React__default, { useRef, useMemo, useEffect, useCallback } from 'react';
import { getStatementPosition } from '../standardSql/getStatementPosition.js';
import { getStandardSuggestions } from '../standardSql/getStandardSuggestions.js';
import { initSuggestionsKindRegistry } from '../standardSql/suggestionsKindRegistry.js';
import { SuggestionKind, CompletionItemKind, CompletionItemPriority, CompletionItemInsertTextRule } from '../types.js';
import { getSuggestionKinds } from '../utils/getSuggestionKind.js';
import { linkedTokenBuilder } from '../utils/linkedTokenBuilder.js';
import { getTableToken, defaultTableNameParser } from '../utils/tokenUtils.js';
import { TRIGGER_SUGGEST } from '../utils/commands.js';
import { v4 } from 'uuid';
import { Registry } from '@grafana/data';
import { initStandardSuggestions } from '../standardSql/standardSuggestionsRegistry.js';
import { initStatementPositionResolvers } from '../standardSql/statementPositionResolversRegistry.js';
import { sqlEditorLog } from '../utils/debugger.js';
import standardSQLLanguageDefinition from '../standardSql/definition.js';
import { getStandardSQLCompletionProvider } from '../standardSql/standardSQLCompletionItemProvider.js';

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
  const monacoRef = useRef(null);
  const langUid = useRef();
  const id = useMemo(() => {
    const uid = v4();
    const id2 = `${language.id}-${uid}`;
    langUid.current = id2;
    return id2;
  }, [language.id]);
  useEffect(() => {
    return () => {
      if (langUid.current) {
        INSTANCE_CACHE.delete(langUid.current);
      }
      sqlEditorLog(`Removing instance cache ${langUid.current}`, false, INSTANCE_CACHE);
    };
  }, []);
  const formatQuery = useCallback(() => {
    if (monacoRef.current) {
      monacoRef.current.getAction("editor.action.formatDocument").run();
    }
  }, []);
  return /* @__PURE__ */ React__default.createElement("div", { style: { width } }, /* @__PURE__ */ React__default.createElement(
    CodeEditor,
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
    return __spreadValues(__spreadValues({ completionProvider: getStandardSQLCompletionProvider }, custom), languageDefinitionProp);
  }
  return __spreadValues(__spreadValues({}, standardSQLLanguageDefinition), languageDefinitionProp);
};
const registerLanguageAndSuggestions = async (monaco, l, lid) => {
  const languageDefinition = resolveLanguage(monaco, l);
  if (!languageDefinition.loader) {
    return;
  }
  const { language, conf } = await languageDefinition.loader(monaco);
  monaco.languages.register({ id: lid });
  monaco.languages.setMonarchTokensProvider(lid, __spreadValues({}, language));
  monaco.languages.setLanguageConfiguration(lid, __spreadValues({}, conf));
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
    monaco.languages.registerCompletionItemProvider(lid, __spreadProps(__spreadValues({}, customProvider), {
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
      new Registry(
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
        languageRegistries.operators.register(__spreadProps(__spreadValues({}, op), { name: op.id }));
      }
    }
  }
  if (customProvider.supportedMacros) {
    for (const macro of customProvider.supportedMacros()) {
      const exists = languageRegistries.macros.getIfExists(macro.id);
      if (!exists) {
        languageRegistries.macros.register(__spreadProps(__spreadValues({}, macro), { name: macro.id }));
      }
    }
  }
  if (customProvider.customStatementPlacement) {
    for (const placement of customProvider.customStatementPlacement()) {
      const exists = languageRegistries.positionResolvers.getIfExists(placement.id);
      if (!exists) {
        languageRegistries.positionResolvers.register(__spreadProps(__spreadValues({}, placement), {
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
      functions: new Registry(),
      operators: new Registry(),
      suggestionKinds: new Registry(initSuggestionsKindRegistry),
      positionResolvers: new Registry(initStatementPositionResolvers),
      macros: new Registry()
    });
  }
  return LANGUAGES_CACHE.get(id);
}

export { SQLEditor, registerLanguageAndSuggestions };
//# sourceMappingURL=SQLEditor.js.map
