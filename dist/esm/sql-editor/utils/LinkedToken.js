import { TokenType } from '../types.js';

class LinkedToken {
  constructor(type, value, range, previous, next) {
    this.type = type;
    this.value = value;
    this.range = range;
    this.previous = previous;
    this.next = next;
  }
  isKeyword() {
    return this.type === TokenType.Keyword;
  }
  isWhiteSpace() {
    return this.type === TokenType.Whitespace;
  }
  isParenthesis() {
    return this.type === TokenType.Parenthesis;
  }
  isIdentifier() {
    return this.type === TokenType.Identifier;
  }
  isString() {
    return this.type === TokenType.String;
  }
  isNumber() {
    return this.type === TokenType.Number;
  }
  isDoubleQuotedString() {
    return this.type === TokenType.Type;
  }
  isVariable() {
    return this.type === TokenType.Variable;
  }
  isFunction() {
    return this.type === TokenType.Function;
  }
  isOperator() {
    return this.type === TokenType.Operator;
  }
  isTemplateVariable() {
    return this.type === TokenType.Variable;
  }
  is(type, value) {
    const isType = this.type === type;
    return value !== void 0 ? isType && compareTokenWithValue(type, this, value) : isType;
  }
  getPreviousNonWhiteSpaceToken() {
    let curr = this.previous;
    while (curr != null) {
      if (!curr.isWhiteSpace()) {
        return curr;
      }
      curr = curr.previous;
    }
    return null;
  }
  getPreviousOfType(type, value) {
    let curr = this.previous;
    while (curr != null) {
      const isType = curr.type === type;
      if (value !== void 0 ? isType && compareTokenWithValue(type, curr, value) : isType) {
        return curr;
      }
      curr = curr.previous;
    }
    return null;
  }
  getPreviousUntil(type, ignoreTypes, value) {
    let tokens = [];
    let curr = this.previous;
    while (curr != null) {
      if (ignoreTypes.some((t) => t === (curr == null ? void 0 : curr.type))) {
        curr = curr.previous;
        continue;
      }
      const isType = curr.type === type;
      if (value !== void 0 ? isType && compareTokenWithValue(type, curr, value) : isType) {
        return tokens;
      }
      if (!curr.isWhiteSpace()) {
        tokens.push(curr);
      }
      curr = curr.previous;
    }
    return tokens;
  }
  getNextUntil(type, ignoreTypes, value) {
    let tokens = [];
    let curr = this.next;
    while (curr != null) {
      if (ignoreTypes.some((t) => t === (curr == null ? void 0 : curr.type))) {
        curr = curr.next;
        continue;
      }
      const isType = curr.type === type;
      if (value !== void 0 ? isType && compareTokenWithValue(type, curr, value) : isType) {
        return tokens;
      }
      if (!curr.isWhiteSpace()) {
        tokens.push(curr);
      }
      curr = curr.next;
    }
    return tokens;
  }
  getPreviousKeyword() {
    let curr = this.previous;
    while (curr != null) {
      if (curr.isKeyword()) {
        return curr;
      }
      curr = curr.previous;
    }
    return null;
  }
  getNextNonWhiteSpaceToken() {
    let curr = this.next;
    while (curr != null) {
      if (!curr.isWhiteSpace()) {
        return curr;
      }
      curr = curr.next;
    }
    return null;
  }
  getNextOfType(type, value) {
    let curr = this.next;
    while (curr != null) {
      const isType = curr.type === type;
      if (value !== void 0 ? isType && compareTokenWithValue(type, curr, value) : isType) {
        return curr;
      }
      curr = curr.next;
    }
    return null;
  }
}
function compareTokenWithValue(type, token, value) {
  return type === TokenType.Keyword || type === TokenType.Operator ? token.value.toLowerCase() === value.toString().toLowerCase() : token.value === value;
}

export { LinkedToken };
//# sourceMappingURL=LinkedToken.js.map
