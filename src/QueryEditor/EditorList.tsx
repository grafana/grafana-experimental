import { Button } from '@grafana/ui';
import React from 'react';

import { Stack } from './Stack';

interface EditorListProps {
  items: unknown[];
  renderItem: (
    item: unknown,
    onChangeItem: (item: unknown) => void,
    onDeleteItem: () => void
  ) => React.ReactElement;
  onChange: (items: unknown[]) => void;
}

export const EditorList = React.forwardRef(function EditorList(
  { items, renderItem, onChange }: EditorListProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const onAddItem = () => {
    const newItems = [...items, {}];

    onChange(newItems);
  };

  const onChangeItem = (itemIndex: number, newItem: unknown) => {
    const newItems = [...items];
    newItems[itemIndex] = newItem;
    onChange(newItems);
  };

  const onDeleteItem = (itemIndex: number) => {
    const newItems = [...items];
    newItems.splice(itemIndex, 1);
    onChange(newItems);
  };
  return (
    <Stack>
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(
            item,
            (newItem) => onChangeItem(index, newItem),
            () => onDeleteItem(index)
          )}
        </div>
      ))}
      <Button ref={ref} onClick={onAddItem} variant="secondary" size="md" icon="plus" aria-label="Add" type="button" />
    </Stack>
  );
});
