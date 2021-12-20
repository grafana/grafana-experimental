import { attachDebugger, createLogger } from "@grafana/ui";

export const sqlEditorLogger = createLogger('SQLEditor');
export const sqlEditorLog = sqlEditorLogger.logger;
attachDebugger('sqleditor', undefined, sqlEditorLogger);