import React, { useEffect, useState } from 'react';

import { SelectableValue } from '@grafana/data';

import { QueryBuilderLabelFilter } from '../types';

import { EditorField, } from '../../QueryEditor/EditorField';
import { EditorFieldGroup } from '../../QueryEditor/EditorFieldGroup';
import { EditorList } from '../../QueryEditor/EditorList';
import { LabelFilterItem } from './LabelFilterItem';
import { isEqual } from 'lodash';

export const MISSING_LABEL_FILTER_ERROR_MESSAGE = 'Select at least 1 label filter (label and value)';

interface Props {
  labelsFilters: QueryBuilderLabelFilter[];
  onChange: (labelFilters: QueryBuilderLabelFilter[]) => void;
  onGetLabelNames: (forLabel: Partial<QueryBuilderLabelFilter>) => Promise<SelectableValue[]>;
  onGetLabelValues: (forLabel: Partial<QueryBuilderLabelFilter>) => Promise<SelectableValue[]>;
  /** If set to true, component will show error message until at least 1 filter is selected */
  labelFilterRequired?: boolean;
  multiValueSeparator?: string;
}

export const LabelFilters = ({
  labelsFilters,
  onChange,
  onGetLabelNames,
  onGetLabelValues,
  labelFilterRequired,
  multiValueSeparator,
}: Props) => {
  const defaultOperator = '=';
  const [items, setItems] = useState<Array<Partial<QueryBuilderLabelFilter>>>([{ operator: defaultOperator }]);

  useEffect(() => {
    if (labelsFilters.length > 0) {
      setItems(labelsFilters);
    } else {
      setItems([{ operator: defaultOperator }]);
    }
  }, [labelsFilters]);

  const onLabelsChange = (newItems: Array<Partial<QueryBuilderLabelFilter>>) => {
    setItems(newItems);

    // Extract full label filters with both label & value
    const newLabels = newItems.filter((x) => x.label != null && x.value != null);
    
    if (!isEqual(newLabels, labelsFilters)) {
      onChange(newLabels as QueryBuilderLabelFilter[]);
    }
  };

  const hasLabelFilter = items.some((item) => item.label && item.value);

  return (
    <EditorFieldGroup>
      <EditorField
        label="Label filters"
        error={MISSING_LABEL_FILTER_ERROR_MESSAGE}
        invalid={labelFilterRequired && !hasLabelFilter}
      >
        <EditorList
          items={items}
          onChange={onLabelsChange}
          renderItem={(item: Partial<QueryBuilderLabelFilter>, onChangeItem, onDelete) => (
            <LabelFilterItem
              item={item}
              items={items}
              defaultOperator={defaultOperator}
              onChange={onChangeItem}
              onDelete={onDelete}
              onGetLabelNames={onGetLabelNames}
              onGetLabelValues={onGetLabelValues}
              invalidLabel={labelFilterRequired && !item.label}
              invalidValue={labelFilterRequired && !item.value}
              multiValueSeparator={multiValueSeparator}
            />
          )}
        />
      </EditorField>
    </EditorFieldGroup>
  );
}