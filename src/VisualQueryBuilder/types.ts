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

export interface QueryWithOperations {
  operations: QueryBuilderOperation[];
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

export type QueryBuilderAddOperationHandler<T> = (
  def: QueryBuilderOperationDef,
  query: T,
  modeller: VisualQueryModeller
) => T;

export type QueryBuilderExplainOperationHandler = (op: QueryBuilderOperation, def?: QueryBuilderOperationDef) => string;

export type QueryBuilderOnParamChangedHandler = (
  index: number,
  operation: QueryBuilderOperation,
  operationDef: QueryBuilderOperationDef
) => QueryBuilderOperation;

export type QueryBuilderOperationRenderer = (
  model: QueryBuilderOperation,
  def: QueryBuilderOperationDef,
  innerExpr: string
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

export interface QueryBuilderOperationEditorProps {
  operation: QueryBuilderOperation;
  index: number;
  query: any;
  datasource: DataSourceApi;
  queryModeller: VisualQueryModeller;
  onChange: (index: number, update: QueryBuilderOperation) => void;
  onRemove: (index: number) => void;
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

export interface VisualQueryModeller {
  getOperationsForCategory(category: string): QueryBuilderOperationDef[];
  getAlternativeOperations(key: string): QueryBuilderOperationDef[];
  getCategories(): string[];
  getOperationDef(id: string): QueryBuilderOperationDef | undefined;
  renderQuery(query: VisualQuery, nested?: boolean): string
  renderLabels(labels: QueryBuilderLabelFilter[]): string;
}


export enum LokiOperationId {
  Json = 'json',
  Logfmt = 'logfmt',
  Regexp = 'regexp',
  Pattern = 'pattern',
  Unpack = 'unpack',
  LineFormat = 'line_format',
  LabelFormat = 'label_format',
  Decolorize = 'decolorize',
  Drop = 'drop',
  Keep = 'keep',
  Rate = 'rate',
  RateCounter = 'rate_counter',
  CountOverTime = 'count_over_time',
  SumOverTime = 'sum_over_time',
  AvgOverTime = 'avg_over_time',
  MaxOverTime = 'max_over_time',
  MinOverTime = 'min_over_time',
  FirstOverTime = 'first_over_time',
  LastOverTime = 'last_over_time',
  StdvarOverTime = 'stdvar_over_time',
  StddevOverTime = 'stddev_over_time',
  QuantileOverTime = 'quantile_over_time',
  BytesRate = 'bytes_rate',
  BytesOverTime = 'bytes_over_time',
  AbsentOverTime = 'absent_over_time',
  Sum = 'sum',
  Avg = 'avg',
  Min = 'min',
  Max = 'max',
  Stddev = 'stddev',
  Stdvar = 'stdvar',
  Count = 'count',
  TopK = 'topk',
  BottomK = 'bottomk',
  LineContains = '__line_contains',
  LineContainsNot = '__line_contains_not',
  LineContainsCaseInsensitive = '__line_contains_case_insensitive',
  LineContainsNotCaseInsensitive = '__line_contains_not_case_insensitive',
  LineMatchesRegex = '__line_matches_regex',
  LineMatchesRegexNot = '__line_matches_regex_not',
  LineFilterIpMatches = '__line_filter_ip_matches',
  LabelFilter = '__label_filter',
  LabelFilterNoErrors = '__label_filter_no_errors',
  LabelFilterIpMatches = '__label_filter_ip_marches',
  Unwrap = 'unwrap',
  SumBy = '__sum_by',
  SumWithout = '__sum_without',
  // Binary ops
  Addition = '__addition',
  Subtraction = '__subtraction',
  MultiplyBy = '__multiply_by',
  DivideBy = '__divide_by',
  Modulo = '__modulo',
  Exponent = '__exponent',
  NestedQuery = '__nested_query',
  EqualTo = '__equal_to',
  NotEqualTo = '__not_equal_to',
  GreaterThan = '__greater_than',
  LessThan = '__less_than',
  GreaterOrEqual = '__greater_or_equal',
  LessOrEqual = '__less_or_equal',
}

export interface PromVisualQuery {
  metric: string;
  labels: QueryBuilderLabelFilter[];
  operations: QueryBuilderOperation[];
  binaryQueries?: PromVisualQueryBinary[];
  // metrics explorer additional settings
  useBackend?: boolean;
  disableTextWrap?: boolean;
  includeNullMetadata?: boolean;
  fullMetaSearch?: boolean;
}

export type PromVisualQueryBinary = VisualQueryBinary<PromVisualQuery>;

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
