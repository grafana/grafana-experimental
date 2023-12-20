/**
 * Shared types that can be reused by Loki and other data sources
 */

import { FunctionComponent } from 'react';

import { DataSourceApi, RegistryItem, SelectableValue, TimeRange } from '@grafana/data';

export interface QueryBuilderLabelFilter {
  label: string;
  op: string;
  value: string;
}

export interface QueryBuilderOperation {
  id: string;
  params: QueryBuilderOperationParamValue[];
}

export interface QueryBuilderOperationDef<T = any> extends RegistryItem {
  documentation?: string;
  params: QueryBuilderOperationParamDef[];
  defaultParams: QueryBuilderOperationParamValue[];
  category: string;
  hideFromList?: boolean;
  alternativesKey?: string;
  /** Can be used to control operation placement when adding a new operations, lower are placed first */
  orderRank?: number;
  renderer: QueryBuilderOperationRenderer;
  addOperationHandler: QueryBuilderAddOperationHandler<T>;
  paramChangedHandler?: QueryBuilderOnParamChangedHandler;
  explainHandler?: QueryBuilderExplainOperationHandler;
  changeTypeHandler?: (op: QueryBuilderOperation, newDef: QueryBuilderOperationDef<T>) => QueryBuilderOperation;
}

type QueryBuilderAddOperationHandler<T> = (
  def: QueryBuilderOperationDef,
  query: T,
  modeller: VisualQueryModeller
) => T;

type QueryBuilderExplainOperationHandler = (op: QueryBuilderOperation, def?: QueryBuilderOperationDef) => string;

type QueryBuilderOnParamChangedHandler = (
  index: number,
  operation: QueryBuilderOperation,
  operationDef: QueryBuilderOperationDef
) => QueryBuilderOperation;

type QueryBuilderOperationRenderer = (
  model: QueryBuilderOperation,
  def: QueryBuilderOperationDef,
  innerQuery: string
) => string;

export type QueryBuilderOperationParamValue = string | number | boolean;

export interface QueryBuilderOperationParamDef {
  name: string;
  type: 'string' | 'number' | 'boolean';
  options?: string[] | number[] | Array<SelectableValue<string>>;
  hideName?: boolean;
  restParam?: boolean;
  optional?: boolean;
  placeholder?: string;
  description?: string;
  minWidth?: number;
  editor?: FunctionComponent<QueryBuilderOperationParamEditorProps>;
  runQueryOnEnter?: boolean;
}

export interface QueryBuilderOperationParamEditorProps {
  value?: QueryBuilderOperationParamValue;
  paramDef: QueryBuilderOperationParamDef;
  /** Parameter index */
  index: number;
  operation: QueryBuilderOperation;
  operationId: string;
  query: any;
  datasource: DataSourceApi;
  timeRange?: TimeRange;
  onChange: (index: number, value: QueryBuilderOperationParamValue) => void;
  onRunQuery: () => void;
  queryModeller: VisualQueryModeller;
}

export enum QueryEditorMode {
  Code = 'code',
  Builder = 'builder',
}

export type QueryStats = {
  bytes: number;
  // The error message displayed in the UI when we cant estimate the size of the query.
  message?: string;
}

export interface VisualQueryModeller {
  getOperationsForCategory(category: string): QueryBuilderOperationDef[];
  getAlternativeOperations(key: string): QueryBuilderOperationDef[];
  getCategories(): string[];
  getOperationDef(id: string): QueryBuilderOperationDef | undefined;
  renderQuery(query: VisualQuery, nested?: boolean): string
  renderLabels(labels: QueryBuilderLabelFilter[]): string;
}

export interface VisualQueryBinary<T> {
  operator: string;
  vectorMatchesType?: 'on' | 'ignoring';
  vectorMatches?: string;
  query: T;
}

export const BINARY_OPERATIONS_KEY = 'Binary operations'

export interface VisualQuery {
  metric?: string;
  labels: QueryBuilderLabelFilter[];
  operations: QueryBuilderOperation[];
  binaryQueries?: Array<VisualQueryBinary<VisualQuery>>;
}