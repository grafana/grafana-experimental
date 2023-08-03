import { Registry } from '@grafana/data';
import { getMonacoMock } from '../mocks/Monaco.js';
import { TextModel } from '../mocks/TextModel.js';
import { getStatementPosition } from '../standardSql/getStatementPosition.js';
import { linkedTokenBuilder } from '../utils/linkedTokenBuilder.js';

function assertPosition(query, position, expected, monacoMock, resolversRegistry) {
  const testModel = TextModel(query);
  const current = linkedTokenBuilder(monacoMock, testModel, position);
  const statementPosition = getStatementPosition(current, resolversRegistry);
  expect(statementPosition).toContain(expected);
}
const testStatementPosition = (expected, cases, resolvers) => {
  describe(`${expected}`, () => {
    let MonacoMock;
    let statementPositionResolversRegistry;
    beforeEach(() => {
      const mockQueries = /* @__PURE__ */ new Map();
      cases.forEach((c) => mockQueries.set(c.query.query, c.query.tokens));
      MonacoMock = getMonacoMock(mockQueries);
      statementPositionResolversRegistry = new Registry(() => {
        return resolvers().map((r) => ({
          id: r.id,
          name: r.name || r.id,
          resolve: r.resolve
        }));
      });
    });
    cases.forEach((c) => {
      test(`${c.query.query}`, () => {
        assertPosition(
          c.query.query,
          { lineNumber: c.position.line, column: c.position.column },
          expected,
          MonacoMock,
          statementPositionResolversRegistry
        );
      });
    });
  });
};

export { testStatementPosition };
//# sourceMappingURL=statementPosition.js.map
