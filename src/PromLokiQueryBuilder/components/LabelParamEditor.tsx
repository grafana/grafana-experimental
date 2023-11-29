import React, { useState } from 'react';

import { DataQuery, DataSourceApi, SelectableValue, toOption } from '@grafana/data';
import { Select } from '@grafana/ui';

import { getOperationParamId } from '../operationUtils';
import { QueryBuilderLabelFilter, QueryBuilderOperationParamEditorProps, VisualQuery } from '../types';
import { LokiAndPromQueryModellerBase } from '../LokiAndPromQueryModellerBase';

export const LabelParamEditor = ({
  onChange,
  index,
  operationId,
  value,
  query,
  datasource,
  modeller,
}: QueryBuilderOperationParamEditorProps) => {
  const [state, setState] = useState<{
    options?: SelectableValue[];
    isLoading?: boolean;
  }>({});

  return (
    <Select
      inputId={getOperationParamId(operationId, index)}
      autoFocus={value === '' ? true : undefined}
      openMenuOnFocus
      onOpenMenu={async () => {
        setState({ isLoading: true });
        const options = await loadGroupByLabels(query, datasource, modeller);
        setState({ options, isLoading: undefined });
      }}
      isLoading={state.isLoading}
      allowCustomValue
      noOptionsMessage="No labels found"
      loadingMessage="Loading labels"
      options={state.options}
      value={toOption(value as string)}
      onChange={(value) => onChange(index, value.value!)}
    />
  );
}

async function loadGroupByLabels(query: VisualQuery<DataQuery>, datasource: DataSourceApi, modeller: LokiAndPromQueryModellerBase): Promise<SelectableValue[]> {
  let labels: QueryBuilderLabelFilter[] = query.labels;

  // This function is used by both Prometheus and Loki and this the only difference.
  if (datasource.type === 'prometheus') {
    labels = [{ label: '__name__', op: '=', value: query.metric ?? '' }, ...query.labels];
  }

  const expr = modeller.renderLabels(labels);
  const result = await datasource.languageProvider.fetchSeriesLabels(expr);

  return Object.keys(result).map((x) => ({
    label: x,
    value: x,
  }));
}
