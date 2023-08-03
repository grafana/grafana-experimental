import { Button } from '@grafana/ui';
import React__default from 'react';
import { Stack } from './Stack.js';

const EditorList = React__default.forwardRef(function EditorList2({ items, renderItem, onChange }, ref) {
  const onAddItem = () => {
    const newItems = [...items, {}];
    onChange(newItems);
  };
  const onChangeItem = (itemIndex, newItem) => {
    const newItems = [...items];
    newItems[itemIndex] = newItem;
    onChange(newItems);
  };
  const onDeleteItem = (itemIndex) => {
    const newItems = [...items];
    newItems.splice(itemIndex, 1);
    onChange(newItems);
  };
  return /* @__PURE__ */ React__default.createElement(Stack, null, items.map((item, index) => /* @__PURE__ */ React__default.createElement("div", { key: index }, renderItem(
    item,
    (newItem) => onChangeItem(index, newItem),
    () => onDeleteItem(index)
  ))), /* @__PURE__ */ React__default.createElement(Button, { ref, onClick: onAddItem, variant: "secondary", size: "md", icon: "plus", "aria-label": "Add", type: "button" }));
});

export { EditorList };
//# sourceMappingURL=EditorList.js.map
