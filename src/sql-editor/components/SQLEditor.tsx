import { Registry } from '@grafana/data';
import { CodeEditor, Monaco, monacoTypes } from '@grafana/ui';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import standardSQL from 'sql-editor/standardSql/defintion';
import { v4 } from 'uuid';

import { getStandardSuggestions } from '../standardSql/getStandardSuggestions';
import { getStatementPosition } from '../standardSql/getStatementPosition';
import {
  initFunctionsRegistry,
  initMacrosRegistry,
  initOperatorsRegistry,
  initStandardSuggestions,
} from '../standardSql/standardSuggestionsRegistry';
import { initStatementPositionResolvers } from '../standardSql/statementPositionResolversRegistry';
import { initSuggestionsKindRegistry, SuggestionKindRegistyItem } from '../standardSql/suggestionsKindRegistry';
import {
  FunctionsRegistryItem,
  MacrosRegistryItem,
  OperatorsRegistryItem,
  StatementPositionResolversRegistryItem,
  SuggestionsRegistyItem,
} from '../standardSql/types';
import {
  CompletionItemKind,
  CompletionItemPriority,
  CustomSuggestion,
  PositionContext,
  SQLCompletionItemProvider,
  SQLLanguageDefinition,
  SQLMonarchLanguage,
  StatementPosition,
  SuggestionKind,
} from '../types';
import { TRIGGER_SUGGEST } from '../utils/commands';
import { sqlEditorLog } from '../utils/debugger';
import { getSuggestionKinds } from '../utils/getSuggestionKind';
import { LinkedToken } from '../utils/LinkedToken';
import { linkedTokenBuilder } from '../utils/linkedTokenBuilder';
import { getTableToken } from '../utils/tokenUtils';

const STANDARD_SQL_LANGUAGE = 'sql';




interface SQLEditorProps {
  query: string;
  /**
   * Use for inspecting the query as it changes. I.e. for validation.
   */
  onChange?: (q: string, processQuery: boolean) => void;
  language?: SQLLanguageDefinition;
  children? : (props: {formatQuery: () => void}) => React.ReactNode;
}

const defaultTableNameParser = (t: LinkedToken) => t.value;

interface LanguageRegistries {
  functions: Registry<FunctionsRegistryItem>;
  operators: Registry<OperatorsRegistryItem>;
  suggestionKinds: Registry<SuggestionKindRegistyItem>;
  positionResolvers: Registry<StatementPositionResolversRegistryItem>;
  macros: Registry<MacrosRegistryItem>;
}

const LANGUAGES_CACHE = new Map<string, LanguageRegistries>();
const INSTANCE_CACHE = new Map<string, Registry<SuggestionsRegistyItem>>();

export const SQLEditor: React.FC<SQLEditorProps> = ({ children, onChange, query, language = { id: STANDARD_SQL_LANGUAGE } }) => {
  const monacoRef = useRef<monacoTypes.editor.IStandaloneCodeEditor>(null);
  const langUid = useRef<string>();
  // create unique language id for each SQLEditor instance
  const id = useMemo(() => {
    const uid = v4();
    const id =  `${language.id}-${uid}`;
    langUid.current = id;
    return id;
  }, [language.id]);

  useEffect(() => {
    return () => {
      INSTANCE_CACHE.delete(langUid.current);
      sqlEditorLog(`Removing instance cache ${langUid.current}`, false, INSTANCE_CACHE);
    }
  }, [])

  const formatQuery = useCallback(() => {
    if(monacoRef.current) {
      monacoRef.current.getAction('editor.action.formatDocument').run();
    }
  },[]);
 

  return (
    <>
      <CodeEditor
        height={'240px'}
        language={id}
        value={query}
        onBlur={(v) => onChange && onChange(v, false)}
        showMiniMap={false}
        showLineNumbers={true}
        // Using onEditorDidMount instead of onBeforeEditorMount to support Grafana < 8.2.x
        onEditorDidMount={(editor, m) => {
          monacoRef.current = editor;
          editor.onDidChangeModelContent((e) => {
            const text = editor.getValue();
            if(onChange) {
              onChange(text, false);
            }
          })

          editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.Enter, () => {
            const text = editor.getValue();
            if (onChange) {
              onChange(text, true);
            }
          });


      editor.onDidFocusEditorText(() => editor.trigger(TRIGGER_SUGGEST.id, TRIGGER_SUGGEST.id, {}));
      
          registerLanguageAndSuggestions(m, language, id);
        }}
      />
      {children && children({formatQuery})}
    </>
  );
};

export const registerLanguageAndSuggestions = async (monaco: Monaco, l: SQLLanguageDefinition, lid: string) => {
  let languageLoader = standardSQL.loader //getSQLLangConf;

  if(l.loader){
    sqlEditorLog(`Loading custom SQL dialect ${l.id}/${lid}`, false);
    languageLoader =  l.loader;
  }
    
  const { language, conf } = await languageLoader(monaco);
  monaco.languages.register({ id: lid });
  monaco.languages.setMonarchTokensProvider(lid, { ...language });
  monaco.languages.setLanguageConfiguration(lid, { ...conf });

  if (l.formatter) {
    monaco.languages.registerDocumentFormattingEditProvider(lid, {
      provideDocumentFormattingEdits: (model) => {
        var formatted = l.formatter(model.getValue());
        return [
          {
            range: model.getFullModelRange(),
            text: formatted
          }
        ];
      }
    });
  }
  
  if (l.completionProvider) {
    const customProvider = l.completionProvider(monaco);
    extendStandardRegistries(language, lid, customProvider);
    const languageSuggestionsRegistries = LANGUAGES_CACHE.get(l.id)!;
    const instanceSuggestionsRegistry = INSTANCE_CACHE.get(lid)!;

    const completionProvider: monacoTypes.languages.CompletionItemProvider['provideCompletionItems'] = async (
      model,
      position,
      context,
      token
    ) => {
      const currentToken = linkedTokenBuilder(monaco, model, position, 'sql');
      const statementPosition = getStatementPosition(currentToken, languageSuggestionsRegistries.positionResolvers);
      const kind = getSuggestionKinds(statementPosition, languageSuggestionsRegistries.suggestionKinds);
      
      sqlEditorLog('Statement position', false, statementPosition);
      sqlEditorLog('Suggestion kinds', false, kind);

      const ctx: PositionContext = {
        position,
        currentToken,
        statementPosition,
        kind,
        range: monaco.Range.fromPositions(position),
      };

      // // Completely custom suggestions - hope this won't we needed
      // let ci;
      // if (customProvider.provideCompletionItems) {
      //   ci = customProvider.provideCompletionItems(model, position, context, token, ctx);
      // }

      const stdSuggestions = await getStandardSuggestions(
        monaco,
        currentToken,
        kind,
        ctx,
        instanceSuggestionsRegistry
      );

      return {
        // ...ci,
        suggestions: stdSuggestions,
      };
    };

    monaco.languages.registerCompletionItemProvider(lid, {
      ...customProvider,
      provideCompletionItems: completionProvider,
    });
  }
};

function extendStandardRegistries(lang: SQLMonarchLanguage, lid: string, customProvider: SQLCompletionItemProvider) {
  if (!LANGUAGES_CACHE.has(lang.id)) {
    initializeLanguageRegistries(lang);
  }

  const languageRegistries = LANGUAGES_CACHE.get(lang.id)!;

  if (!INSTANCE_CACHE.has(lid)) {
    INSTANCE_CACHE.set(
      lid,
      new Registry(initStandardSuggestions(languageRegistries.functions, languageRegistries.operators, languageRegistries.macros))
    );
  }

  const instanceSuggestionsRegistry = INSTANCE_CACHE.get(lid)!;

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
        languageRegistries.operators.register({ ...op, name: op.id });
      }
    }
  }

  if (customProvider.supportedMacros) {
    for (const macro of customProvider.supportedMacros()) {
      const exists = languageRegistries.macros.getIfExists(macro.id);
      if (!exists) {
        languageRegistries.macros.register({ ...macro, name: macro.id });
      }
    }
  }

  if (customProvider.customStatementPlacement) {
    for (const placement of customProvider.customStatementPlacement()) {
      const exists = languageRegistries.positionResolvers.getIfExists(placement.id);
      if (!exists) {
        languageRegistries.positionResolvers.register({
          ...placement,
          id: placement.id as StatementPosition,
          name: placement.id,
        });
        languageRegistries.suggestionKinds.register({
          id: placement.id as StatementPosition,
          name: placement.id,
          kind: [],
        });
      } else {
        // Allow extension to the built-in placement resolvers
        const origResolve = exists.resolve;
        exists.resolve = (...args) => {
          const ext = placement.resolve(...args);
          if(placement.overrideDefault){
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
      kind.applyTo?.forEach((applyTo) => {
        const exists = languageRegistries.suggestionKinds.getIfExists(applyTo);
        if (exists) {
          // avoid duplicates
          if (exists.kind.indexOf(kind.id as SuggestionKind) === -1) {
            exists.kind.push(kind.id as SuggestionKind);
          }
        }
      });

      instanceSuggestionsRegistry.register({
        id: kind.id as SuggestionKind,
        name: kind.id,
        suggestions: kind.suggestionsResolver,
      });
    }
  }

  if (customProvider.tables) {
    const stbBehaviour = instanceSuggestionsRegistry.get(SuggestionKind.Tables);
    const s = stbBehaviour!.suggestions;
    stbBehaviour!.suggestions = async (ctx, m) => {
      const o = await s(ctx, m);
      const oo = (await customProvider.tables!.resolve!()).map((x) => ({
        label: x.name,
        insertText: x.completion ?? x.name,
        command: TRIGGER_SUGGEST,
        kind: CompletionItemKind.Field,
        sortText: CompletionItemPriority.High,
      }));
      return [...o, ...oo];
    };
  }

  if (customProvider.columns) {
    const stbBehaviour = instanceSuggestionsRegistry.get(SuggestionKind.Columns);
    const s = stbBehaviour!.suggestions;
    stbBehaviour!.suggestions = async (ctx, m) => {
      const o = await s(ctx, m);
      const tableToken = getTableToken(ctx.currentToken);
      let table = '';
      const tableNameParser = customProvider.tables?.parseName ?? defaultTableNameParser;

      if (tableToken && tableToken.value) {
        table = tableNameParser(tableToken).trim();
      }

      let oo: CustomSuggestion[] = [];
      if (table) {
        const columns = await customProvider.columns?.resolve!(table);
        oo = columns
          ? columns.map<CustomSuggestion>((x) => ({
              label: x.name,
              insertText: x.completion ?? x.name,
              kind: CompletionItemKind.Field,
              sortText: CompletionItemPriority.High,
              detail: x.type,
              documentation: x.description
            }))
          : [];
      }
      return [...o, ...oo];
    };
  }
}

/**
 * Initializes language specific registries that are treated as singletons
 */
function initializeLanguageRegistries(lang: SQLMonarchLanguage) {
  if (!LANGUAGES_CACHE.has(lang.id)) {
    LANGUAGES_CACHE.set(lang.id, {
      functions: new Registry(() => initFunctionsRegistry(lang)),
      operators: new Registry(initOperatorsRegistry),
      suggestionKinds: new Registry(initSuggestionsKindRegistry),
      positionResolvers: new Registry(initStatementPositionResolvers),
      macros: new Registry(initMacrosRegistry),
    });
  }

  return LANGUAGES_CACHE.get(lang.id)!;
}

// async function getSQLLangConf(monaco: Monaco) : Promise<SQLLanguage> {
//   const allLangs = monaco.languages.getLanguages();
//   const langObj = allLangs.find(({ id }) => id === 'sql');

//   if (langObj) {
//     // @ts-ignore : Ain't public API :/ https://github.com/microsoft/monaco-editor/issues/2123#issuecomment-694197340
//     return await langObj.loader();
//   }

//   return Promise.resolve({ conf: null, language: null });
// }
