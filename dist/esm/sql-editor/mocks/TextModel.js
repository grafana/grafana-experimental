function TextModel(value) {
  return {
    getValue: function(eol, preserveBOM) {
      return value;
    },
    getValueInRange: function(range, eol) {
      const lines = value.split("\n");
      const line = lines[range.startLineNumber - 1];
      return line.trim().slice(range.startColumn === 0 ? 0 : range.startColumn - 1, range.endColumn - 1);
    },
    getLineLength: function(lineNumber) {
      const lines = value.split("\n");
      return lines[lineNumber - 1].trim().length;
    }
  };
}

export { TextModel };
//# sourceMappingURL=TextModel.js.map
