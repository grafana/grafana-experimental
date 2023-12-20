import { uniqBy } from 'lodash';
import React, { useState } from 'react';

import { SelectableValue, toOption } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { InlineField, Select } from '@grafana/ui';

import { QueryBuilderLabelFilter } from '../types';
import { InputGroup } from '../../QueryEditor/InputGroup';
import { AccessoryButton } from '../../QueryEditor/AccessoryButton';

export interface Props {
  defaultOp: string;
  item: Partial<QueryBuilderLabelFilter>;
  items: Array<Partial<QueryBuilderLabelFilter>>;
  onChange: (value: QueryBuilderLabelFilter) => void;
  onGetLabelNames: (forLabel: Partial<QueryBuilderLabelFilter>) => Promise<SelectableValue[]>;
  onGetLabelValues: (forLabel: Partial<QueryBuilderLabelFilter>) => Promise<SelectableValue[]>;
  onDelete: () => void;
  invalidLabel?: boolean;
  invalidValue?: boolean;
}

export function LabelFilterItem({
  item,
  items,
  defaultOp,
  onChange,
  onDelete,
  onGetLabelNames,
  onGetLabelValues,
  invalidLabel,
  invalidValue,
}: Props) {
  const [state, setState] = useState<{
    labelNames?: SelectableValue[];
    labelValues?: SelectableValue[];
    isLoadingLabelNames?: boolean;
    isLoadingLabelValues?: boolean;
  }>({});
  // there's a bug in react-select where the menu doesn't recalculate its position when the options are loaded asynchronously
  // see https://github.com/grafana/grafana/issues/63558
  // instead, we explicitly control the menu visibility and prevent showing it until the options have fully loaded
  const [labelNamesMenuOpen, setLabelNamesMenuOpen] = useState(false);
  const [labelValuesMenuOpen, setLabelValuesMenuOpen] = useState(false);
  const CONFLICTING_LABEL_FILTER_ERROR_MESSAGE = 'You have conflicting label filters';

  const isMultiSelect = (operator = item.op) => {
    return operators.find((op) => op.label === operator)?.isMultiValue;
  };

  const getSelectOptionsFromString = (item?: string): string[] => {
    if (item) {
      if (item.indexOf('|') > 0) {
        return item.split('|');
      }
      return [item];
    }
    return [];
  };

  const getOptions = (): SelectableValue[] => {
    const labelValues = state.labelValues ? [...state.labelValues] : [];
    const selectedOptions = getSelectOptionsFromString(item?.value).map(toOption);

    // Remove possible duplicated values
    return uniqBy([...selectedOptions, ...labelValues], 'value');
  };

  const isConflicting = isConflictingLabelFilter(item, items);

  return (
    <div data-testid="prometheus-dimensions-filter-item">
      <InlineField error={CONFLICTING_LABEL_FILTER_ERROR_MESSAGE} invalid={isConflicting ? true : undefined}>
        <InputGroup>
          <Select
            placeholder="Select label"
            aria-label={selectors.components.QueryBuilder.labelSelect}
            inputId="prometheus-dimensions-filter-item-key"
            width="auto"
            value={item.label ? toOption(item.label) : null}
            allowCustomValue
            onOpenMenu={async () => {
              setState({ isLoadingLabelNames: true });
              const labelNames = await onGetLabelNames(item);
              setLabelNamesMenuOpen(true);
              setState({ labelNames, isLoadingLabelNames: undefined });
            }}
            onCloseMenu={() => {
              setLabelNamesMenuOpen(false);
            }}
            isOpen={labelNamesMenuOpen}
            isLoading={state.isLoadingLabelNames}
            options={state.labelNames}
            onChange={(change) => {
              if (change.label) {
                onChange({
                  ...item,
                  op: item.op ?? defaultOp,
                  label: change.label,
                } as unknown as QueryBuilderLabelFilter);
              }
            }}
            invalid={isConflicting || invalidLabel}
          />

          <Select
            aria-label={selectors.components.QueryBuilder.matchOperatorSelect}
            value={toOption(item.op ?? defaultOp)}
            options={operators}
            width="auto"
            onChange={(change) => {
              if (change.value != null) {
                onChange({
                  ...item,
                  op: change.value,
                  value: isMultiSelect(change.value) ? item.value : getSelectOptionsFromString(item?.value)[0],
                } as unknown as QueryBuilderLabelFilter);
              }
            }}
            invalid={isConflicting}
          />

          <Select
            placeholder="Select value"
            aria-label={selectors.components.QueryBuilder.valueSelect}
            inputId="prometheus-dimensions-filter-item-value"
            width="auto"
            value={
              isMultiSelect()
                ? getSelectOptionsFromString(item?.value).map(toOption)
                : getSelectOptionsFromString(item?.value).map(toOption)[0]
            }
            allowCustomValue
            onOpenMenu={async () => {
              setState({ isLoadingLabelValues: true });
              const labelValues = await onGetLabelValues(item);
              setState({
                ...state,
                labelValues,
                isLoadingLabelValues: undefined,
              });
              setLabelValuesMenuOpen(true);
            }}
            onCloseMenu={() => {
              setLabelValuesMenuOpen(false);
            }}
            isOpen={labelValuesMenuOpen}
            isMulti={isMultiSelect()}
            isLoading={state.isLoadingLabelValues}
            options={getOptions()}
            onChange={(change) => {
              if (change.value) {
                onChange({
                  ...item,
                  value: change.value,
                  op: item.op ?? defaultOp,
                } as unknown as QueryBuilderLabelFilter);
              } else {
                const changes = change
                  .map((change: any) => {
                    return change.label;
                  })
                  .join('|');
                onChange({ ...item, value: changes, op: item.op ?? defaultOp } as unknown as QueryBuilderLabelFilter);
              }
            }}
            invalid={isConflicting || invalidValue}
          />
          <AccessoryButton aria-label="remove" icon="times" variant="secondary" onClick={onDelete} />
        </InputGroup>
      </InlineField>
    </div>
  );
}

const operators = [
   { label: '=', value: '=', description: 'Equals', isMultiValue: false },
   { label: '!=', value: '!=', description: 'Does not equal', isMultiValue: false },
   { label: '=~', value: '=~', description: 'Matches regex', isMultiValue: true },
   { label: '!~', value: '!~', description: 'Does not match regex', isMultiValue: true },
]


export function isConflictingLabelFilter(
  newLabel: Partial<QueryBuilderLabelFilter>,
  labels: Array<Partial<QueryBuilderLabelFilter>>
): boolean {
  if (!newLabel.label || !newLabel.op || !newLabel.value) {
    return false;
  }

  if (labels.length < 2) {
    return false;
  }

  const operationIsNegative = newLabel.op.toString().startsWith('!');

  const candidates = labels.filter(
    (label) => label.label === newLabel.label && label.value === newLabel.value && label.op !== newLabel.op
  );

  const conflict = candidates.some((candidate) => {
    if (operationIsNegative && candidate?.op?.toString().startsWith('!') === false) {
      return true;
    }
    if (operationIsNegative === false && candidate?.op?.toString().startsWith('!')) {
      return true;
    }
    return false;
  });

  return conflict;
}
