import { Registry } from '@grafana/data';

import { BINARY_OPERATIONS_KEY, VisualQuery, VisualQueryBinary, QueryBuilderLabelFilter, QueryBuilderOperation, QueryBuilderOperationDef, VisualQueryModeller } from './types';

export abstract class QueryModellerBase implements VisualQueryModeller {
  protected operationsRegistry: Registry<QueryBuilderOperationDef>;
  private categories: string[] = [];

  constructor(getOperations: () => QueryBuilderOperationDef[]) {
    this.operationsRegistry = new Registry<QueryBuilderOperationDef>(getOperations);
  }

  protected setOperationCategories(categories: string[]) {
    this.categories = categories;
  }

  abstract renderOperations(queryString: string, operations: QueryBuilderOperation[]): string;

  abstract renderBinaryQueries(queryString: string, binaryQueries?: Array<VisualQueryBinary<VisualQuery>>): string

  abstract renderLabels(labels: QueryBuilderLabelFilter[]): string;

  abstract renderQuery(query: VisualQuery, nested?: boolean): string

  getOperationsForCategory(category: string) {
    return this.operationsRegistry.list().filter((op) => op.category === category && !op.hideFromList);
  }

  getAlternativeOperations(key: string) {
    return this.operationsRegistry.list().filter((op) => op.alternativesKey && op.alternativesKey === key);
  }

  getCategories() {
    return this.categories;
  }

  getOperationDef(id: string): QueryBuilderOperationDef | undefined {
    return this.operationsRegistry.getIfExists(id);
  }

  hasBinaryOp(query: VisualQuery): boolean {
    return (
      query.operations.find((op) => {
        const def = this.getOperationDef(op.id);
        return def?.category === BINARY_OPERATIONS_KEY;
      }) !== undefined
    );
  }
}
