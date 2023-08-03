import { TokenType } from '../types.js';
import { LinkedToken } from './LinkedToken.js';

function linkedTokenBuilder(monaco, model, position, languageId = "sql") {
  var _a;
  let current = null;
  let previous = null;
  const tokensPerLine = monaco.editor.tokenize((_a = model.getValue()) != null ? _a : "", languageId);
  for (let lineIndex = 0; lineIndex < tokensPerLine.length; lineIndex++) {
    const tokens = tokensPerLine[lineIndex];
    if (!tokens.length && previous) {
      const token = {
        offset: 0,
        type: TokenType.Whitespace,
        language: languageId,
        _tokenBrand: void 0
      };
      tokens.push(token);
    }
    for (let columnIndex = 0; columnIndex < tokens.length; columnIndex++) {
      const token = tokens[columnIndex];
      let endColumn = tokens.length > columnIndex + 1 ? tokens[columnIndex + 1].offset + 1 : model.getLineLength(lineIndex + 1) + 1;
      const range = {
        startLineNumber: lineIndex + 1,
        startColumn: token.offset === 0 ? 0 : token.offset + 1,
        endLineNumber: lineIndex + 1,
        endColumn
      };
      const value = model.getValueInRange(range);
      const sqlToken = new LinkedToken(token.type, value, range, previous, null);
      if (monaco.Range.containsPosition(range, position)) {
        current = sqlToken;
      }
      if (previous) {
        previous.next = sqlToken;
      }
      previous = sqlToken;
    }
  }
  return current;
}

export { linkedTokenBuilder };
//# sourceMappingURL=linkedTokenBuilder.js.map
