import { css, cx } from '@emotion/css';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useId } from 'react-use-id-hook';

import { DataSourceApi, GrafanaTheme2, SelectableValue, TimeRange, toOption } from '@grafana/data';
import { AutoSizeInput, Button, Checkbox, Icon, InlineField, Select, Tooltip, useStyles2, useTheme2 } from '@grafana/ui';

import { OperationHeader } from './OperationHeader';
import {
  QueryBuilderOperation,
  QueryBuilderOperationDef,
  QueryBuilderOperationParamDef,
  QueryBuilderOperationParamEditorProps,
  QueryBuilderOperationParamValue,
  VisualQuery,
  VisualQueryModeller
} from '../types';
import { Stack } from '../../QueryEditor/Stack';

interface Props {
  operation: QueryBuilderOperation;
  index: number;
  query: VisualQuery;
  datasource: DataSourceApi;
  onChange: (index: number, update: QueryBuilderOperation) => void;
  onRemove: (index: number) => void;
  onRunQuery: () => void;
  flash?: boolean;
  highlight?: boolean;
  isConflictingFilter?: boolean;
  queryModeller: VisualQueryModeller;
  timeRange?: TimeRange;
}

export function OperationEditor({
  operation,
  index,
  onRemove,
  onChange,
  onRunQuery,
  query,
  datasource,
  flash,
  highlight,
  queryModeller,
  isConflictingFilter = false,
  timeRange,
}: Props) {
  const def = queryModeller.getOperationDef(operation.id);
  const shouldFlash = useFlash(flash);
  const id = useId();

  const theme = useTheme2();
  const styles = getStyles(theme, isConflictingFilter);

  if (!def) {
    return <span>Operation {operation.id} not found</span>;
  }

  const onParamValueChanged = (paramIdx: number, value: QueryBuilderOperationParamValue) => {
    const update: QueryBuilderOperation = { ...operation, params: [...operation.params] };
    update.params[paramIdx] = value;
    callParamChangedThenOnChange(def, update, index, paramIdx, onChange);
  };

  const onAddRestParam = () => {
    const update: QueryBuilderOperation = { ...operation, params: [...operation.params, ''] };
    callParamChangedThenOnChange(def, update, index, operation.params.length, onChange);
  };

  const onRemoveRestParam = (paramIdx: number) => {
    const update: QueryBuilderOperation = {
      ...operation,
      params: [...operation.params.slice(0, paramIdx), ...operation.params.slice(paramIdx + 1)],
    };
    callParamChangedThenOnChange(def, update, index, paramIdx, onChange);
  };

  const operationElements: React.ReactNode[] = [];

  for (let paramIndex = 0; paramIndex < operation.params.length; paramIndex++) {
    const paramDef = def.params[Math.min(def.params.length - 1, paramIndex)];
    const Editor = getOperationParamEditor(paramDef);

    operationElements.push(
      <div className={styles.paramRow} key={`${paramIndex}-1`}>
        {!paramDef.hideName && (
          <div className={styles.paramName}>
            <label htmlFor={getOperationParamId(id, paramIndex)}>{paramDef.name}</label>
            {paramDef.description && (
              <Tooltip placement="top" content={paramDef.description} theme="info">
                <Icon name="info-circle" size="sm" className={styles.infoIcon} />
              </Tooltip>
            )}
          </div>
        )}
        <div className={styles.paramValue}>
          <Stack gap={0.5} direction="row" alignItems="center">
            <Editor
              index={paramIndex}
              paramDef={paramDef}
              value={operation.params[paramIndex]}
              operation={operation}
              operationId={id}
              onChange={onParamValueChanged}
              onRunQuery={onRunQuery}
              query={query}
              datasource={datasource}
              queryModeller={queryModeller}
              timeRange={timeRange}
            />
            {paramDef.restParam && (operation.params.length > def.params.length || paramDef.optional) && (
              <Button
                data-testid={`operations.${index}.remove-rest-param`}
                size="sm"
                fill="text"
                icon="times"
                variant="secondary"
                title={`Remove ${paramDef.name}`}
                onClick={() => onRemoveRestParam(paramIndex)}
              />
            )}
          </Stack>
        </div>
      </div>
    );
  }

  // Handle adding button for rest params
  let restParam: React.ReactNode | undefined;
  if (def.params.length > 0) {
    const lastParamDef = def.params[def.params.length - 1];
    if (lastParamDef.restParam) {
      restParam = renderAddRestParamButton(lastParamDef, onAddRestParam, index, operation.params.length, styles);
    }
  }

  const isInvalid = (isDragging: boolean) => {
    if (isDragging) {
      return undefined;
    }

    return isConflictingFilter ? true : undefined;
  };

  return (
    <Draggable draggableId={`operation-${index}`} index={index}>
      {(provided, snapshot) => (
        <InlineField
          error={'You have conflicting label filters'}
          invalid={isInvalid(snapshot.isDragging)}
          className={cx(styles.error, styles.cardWrapper)}
        >
          <div
            className={cx(
              styles.card,
              (shouldFlash || highlight) && styles.cardHighlight,
              isConflictingFilter && styles.cardError
            )}
            ref={provided.innerRef}
            {...provided.draggableProps}
            data-testid={`operations.${index}.wrapper`}
          >
            <OperationHeader
              operation={operation}
              dragHandleProps={provided.dragHandleProps}
              def={def}
              index={index}
              onChange={onChange}
              onRemove={onRemove}
              queryModeller={queryModeller}
            />
            <div className={styles.body}>{operationElements}</div>
            {restParam}
            {index < query.operations.length - 1 && (
              <div className={styles.arrow}>
                <div className={styles.arrowLine} />
                <div className={styles.arrowArrow} />
              </div>
            )}
          </div>
        </InlineField>
      )}
    </Draggable>
  );
}

/**
 * When flash is switched on makes sure it is switched of right away, so we just flash the highlight and then fade
 * out.
 * @param flash
 */
function useFlash(flash?: boolean) {
  const [keepFlash, setKeepFlash] = useState(true);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (flash) {
      t = setTimeout(() => {
        setKeepFlash(false);
      }, 1000);
    } else {
      setKeepFlash(true);
    }

    return () => clearTimeout(t);
  }, [flash]);

  return keepFlash && flash;
}

function renderAddRestParamButton(
  paramDef: QueryBuilderOperationParamDef,
  onAddRestParam: () => void,
  operationIndex: number,
  paramIndex: number,
  styles: OperationEditorStyles
) {
  return (
    <div className={styles.restParam} key={`${paramIndex}-2`}>
      <Button
        size="sm"
        icon="plus"
        title={`Add ${paramDef.name}`}
        variant="secondary"
        onClick={onAddRestParam}
        data-testid={`operations.${operationIndex}.add-rest-param`}
      >
        {paramDef.name}
      </Button>
    </div>
  );
}

function callParamChangedThenOnChange(
  def: QueryBuilderOperationDef,
  operation: QueryBuilderOperation,
  operationIndex: number,
  paramIndex: number,
  onChange: (index: number, update: QueryBuilderOperation) => void
) {
  if (def.paramChangedHandler) {
    onChange(operationIndex, def.paramChangedHandler(paramIndex, operation, def));
  } else {
    onChange(operationIndex, operation);
  }
}

const getStyles = (theme: GrafanaTheme2, isConflicting: boolean) => {
  return {
    cardWrapper: css({
      alignItems: 'stretch',
    }),
    error: css({
      marginBottom: theme.spacing(1),
    }),
    card: css({
      background: theme.colors.background.primary,
      border: `1px solid ${theme.colors.border.medium}`,
      cursor: 'grab',
      borderRadius: theme.shape.radius.default,
      position: 'relative',
      transition: 'all 0.5s ease-in 0s',
      height: isConflicting ? 'auto' : '100%',
    }),
    cardError: css({
      boxShadow: `0px 0px 4px 0px ${theme.colors.warning.main}`,
      border: `1px solid ${theme.colors.warning.main}`,
    }),
    cardHighlight: css({
      boxShadow: `0px 0px 4px 0px ${theme.colors.primary.border}`,
      border: `1px solid ${theme.colors.primary.border}`,
    }),
    infoIcon: css({
      marginLeft: theme.spacing(0.5),
      color: theme.colors.text.secondary,
      ':hover': {
        color: theme.colors.text.primary,
      },
    }),
    body: css({
      margin: theme.spacing(1, 1, 0.5, 1),
      display: 'table',
    }),
    paramRow: css({
      label: 'paramRow',
      display: 'table-row',
      verticalAlign: 'middle',
    }),
    paramName: css({
      display: 'table-cell',
      padding: theme.spacing(0, 1, 0, 0),
      fontSize: theme.typography.bodySmall.fontSize,
      fontWeight: theme.typography.fontWeightMedium,
      verticalAlign: 'middle',
      height: '32px',
    }),
    paramValue: css({
      label: 'paramValue',
      display: 'table-cell',
      verticalAlign: 'middle',
    }),
    restParam: css({
      padding: theme.spacing(0, 1, 1, 1),
    }),
    arrow: css({
      position: 'absolute',
      top: '0',
      right: '-18px',
      display: 'flex',
    }),
    arrowLine: css({
      height: '2px',
      width: '8px',
      backgroundColor: theme.colors.border.strong,
      position: 'relative',
      top: '14px',
    }),
    arrowArrow: css({
      width: 0,
      height: 0,
      borderTop: `5px solid transparent`,
      borderBottom: `5px solid transparent`,
      borderLeft: `7px solid ${theme.colors.border.strong}`,
      position: 'relative',
      top: '10px',
    }),
  };
};

type OperationEditorStyles = ReturnType<typeof getStyles>;

export function getOperationParamEditor(
  paramDef: QueryBuilderOperationParamDef
): FunctionComponent<QueryBuilderOperationParamEditorProps> {
  if (paramDef.editor) {
    return paramDef.editor;
  }

  if (paramDef.options) {
    return SelectInputParamEditor;
  }

  switch (paramDef.type) {
    case 'boolean':
      return BoolInputParamEditor;
    case 'number':
    case 'string':
    default:
      return SimpleInputParamEditor;
  }
}

function SimpleInputParamEditor(props: QueryBuilderOperationParamEditorProps) {
  const { paramDef, operationId, index, value, onRunQuery, onChange } = props;
  return (
    <AutoSizeInput
      id={getOperationParamId(operationId, index)}
      defaultValue={value?.toString()}
      minWidth={paramDef.minWidth}
      placeholder={paramDef.placeholder}
      title={paramDef.description}
      maxWidth={(paramDef.minWidth || 20) * 3}
      onCommitChange={(evt) => {
        onChange(index, evt.currentTarget.value);
        if (paramDef.runQueryOnEnter && evt.type === 'keydown') {
          onRunQuery();
        }
      }}
    />
  );
}

function BoolInputParamEditor(props: QueryBuilderOperationParamEditorProps) {
  const { index, operationId, value, onChange } = props;
  return (
    <Checkbox
      id={getOperationParamId(operationId, index)}
      value={Boolean(value)}
      onChange={(evt) => onChange(props.index, evt.currentTarget.checked)}
    />
  );
}

function SelectInputParamEditor({
  paramDef,
  value,
  index,
  operationId,
  onChange,
}: QueryBuilderOperationParamEditorProps) {
  const styles = useStyles2(getParamEditorStyles);
  let selectOptions = paramDef.options as SelectableValue[];

  if (!selectOptions[0]?.label) {
    selectOptions = paramDef.options!.map((option) => ({
      label: option.toString(),
      value: option,
    }));
  }

  let valueOption = selectOptions.find((x) => x.value === value) ?? toOption(value as string);

  // If we have optional options param and don't have value, we want to render button with which we add optional options.
  // This makes it easier to understand what needs to be selected and what is optional.
  if (!value && paramDef.optional) {
    return (
      <div className={styles.optionalParam}>
        <Button
          size="sm"
          variant="secondary"
          title={`Add ${paramDef.name}`}
          icon="plus"
          onClick={() => onChange(index, selectOptions[0].value)}
        >
          {paramDef.name}
        </Button>
      </div>
    );
  }

  return (
    <Stack gap={0.5} direction="row" alignItems="center">
      <Select
        id={getOperationParamId(operationId, index)}
        value={valueOption}
        options={selectOptions}
        placeholder={paramDef.placeholder}
        allowCustomValue={true}
        onChange={(value) => onChange(index, value.value!)}
        width={paramDef.minWidth || 'auto'}
      />
      {paramDef.optional && (
        <Button
          data-testid={`operations.${index}.remove-param`}
          size="sm"
          fill="text"
          icon="times"
          variant="secondary"
          title={`Remove ${paramDef.name}`}
          onClick={() => onChange(index, '')}
        />
      )}
    </Stack>
  );
}

const getParamEditorStyles = (theme: GrafanaTheme2) => {
  return {
    optionalParam: css({
      marginTop: theme.spacing(1),
    }),
  };
};

export function getOperationParamId(operationId: string, paramIndex: number) {
  return `operations.${operationId}.param.${paramIndex}`;
}