import React, { useCallback } from 'react';
import { LanguageCompletionProvider } from '../types';
import { SQLEditor } from './SQLEditor';
import { getTestProvider } from '../mocks/testProvider';

export default {
  title: 'SQLEditor',
  component: SQLEditor,
};

const getSqlCompletionProvider = () : LanguageCompletionProvider => {
  return getTestProvider();
}

export const basic = () => {
  const width = 800;
  const height = 400;
  const query = 'foo'

  const onRawQueryChange = useCallback(
    (rawSql: string, processQuery: boolean) => {
    },
    []
  );

  return (
    <SQLEditor
      width={width}
      height={height}
      query={query}
      onChange={onRawQueryChange}
      language={{ id: 'sql', completionProvider: getSqlCompletionProvider(), formatter: (q) => q }}
    >
        {({ formatQuery }) => {
          return (
            <div>
            </div>
          );
        }}
    </SQLEditor>
  );
};
