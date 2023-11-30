import {
  QueryBuilderLabelFilter,
} from './types';

export function isConflictingSelector(
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

export function getOperationParamId(operationId: string, paramIndex: number) {
  return `operations.${operationId}.param.${paramIndex}`;
}