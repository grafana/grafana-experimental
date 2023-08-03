import { attachDebugger, createLogger } from '@grafana/ui';

let sqlEditorLogger = { logger: () => {
} };
let sqlEditorLog = () => {
};
if (attachDebugger && createLogger) {
  sqlEditorLogger = createLogger("SQLEditor");
  sqlEditorLog = sqlEditorLogger.logger;
  attachDebugger("sqleditor", void 0, sqlEditorLogger);
}

export { sqlEditorLog, sqlEditorLogger };
//# sourceMappingURL=debugger.js.map
