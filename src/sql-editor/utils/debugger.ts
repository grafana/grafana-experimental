import { attachDebugger, createLogger } from "@grafana/ui";

let sqlEditorLogger = { logger : () => {}}
let sqlEditorLog = () => {}

if (attachDebugger && createLogger) {
     sqlEditorLogger = createLogger('SQLEditor');
     sqlEditorLog = sqlEditorLogger.logger;
     attachDebugger('sqleditor', undefined, sqlEditorLogger as any);
}

export { sqlEditorLog, sqlEditorLogger };
