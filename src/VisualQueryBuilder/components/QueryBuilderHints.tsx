import { css } from '@emotion/css';
import React, { useState, useEffect } from 'react';

import { DataQuery, DataSourceApi, GrafanaTheme2, PanelData, QueryHint } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { Button, Tooltip, useStyles2 } from '@grafana/ui';

import { QueryModellerBase } from '../QueryModellerBase';
import { VisualQuery } from '../types';

interface Props<T extends VisualQuery, Q extends DataQuery> {
  query: T;
  datasource: DataSourceApi;
  queryModeller: QueryModellerBase;
  buildVisualQueryFromString: (queryString: string) => { query: T };
  onChange: (update: T) => void;
  data?: PanelData;
  buildDataQueryFromString: (queryString: string) => Q;
}

export const QueryBuilderHints = <T extends VisualQuery, Q extends DataQuery>({
  datasource,
  query: visualQuery,
  onChange,
  data,
  queryModeller,
  buildVisualQueryFromString,
  buildDataQueryFromString,
}: Props<T, Q>) => {
  const [hints, setHints] = useState<QueryHint[]>([]);
  const styles = useStyles2(getStyles);

  useEffect(() => {
    const query = buildDataQueryFromString(queryModeller.renderQuery(visualQuery))
    // For now show only actionable hints)
    const hints = datasource.getQueryHints?.(query, data?.series || []).filter((hint) => hint.fix?.action);
    setHints(hints ?? []);
  }, [datasource, visualQuery, data, queryModeller]);

  return (
    <>
      {hints.length > 0 && (
        <div className={styles.container}>
          {hints.map((hint) => {
            return (
              <Tooltip content={`${hint.label} ${hint.fix?.label}`} key={hint.type}>
                <Button
                  onClick={() => {
                    reportInteraction('grafana_query_builder_hints_clicked', {
                      hint: hint.type,
                      datasourceType: datasource.type,
                    });
                    if (hint?.fix?.action) {
                      // This is Loki/Prom specific logic that should be updated
                      const query = buildDataQueryFromString(queryModeller.renderQuery(visualQuery))
                      const newQuery = datasource.modifyQuery?.(query, hint.fix.action);
                      if (newQuery && datasource.getQueryDisplayText) {
                        const newVisualQuery = buildVisualQueryFromString(datasource.getQueryDisplayText(newQuery) ?? '');
                        return onChange(newVisualQuery.query);
                      }
                    }
                  }}
                  fill="outline"
                  size="sm"
                  className={styles.hint}
                >
                  hint: {hint.fix?.title || hint.fix?.action?.type.toLowerCase().replace('_', ' ')}
                </Button>
              </Tooltip>
            );
          })}
        </div>
      )}
    </>
  );
};

QueryBuilderHints.displayName = 'QueryBuilderHints';

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      align-items: start;
    `,
    hint: css`
      margin-right: ${theme.spacing(1)};
    `,
  };
};
