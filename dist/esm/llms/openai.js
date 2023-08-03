import { LiveChannelScope, isLiveChannelMessageEvent } from '@grafana/data';
import { getBackendSrv, getGrafanaLiveSrv, logDebug } from '@grafana/runtime';
import { pipe } from 'rxjs';
import { filter, map, scan, takeWhile } from 'rxjs/operators';

const LLM_PLUGIN_ID = "grafana-llm-app";
const LLM_PLUGIN_ROUTE = `/api/plugins/${LLM_PLUGIN_ID}`;
const OPENAI_CHAT_COMPLETIONS_PATH = "openai/v1/chat/completions";
function isContentMessage(message) {
  return message.content != null;
}
function isDoneMessage(message) {
  return message.done !== void 0;
}
function extractContent() {
  return pipe(
    filter((response) => isContentMessage(response.choices[0].delta)),
    // The type assertion is needed here because the type predicate above doesn't seem to propagate.
    map((response) => response.choices[0].delta.content)
  );
}
function accumulateContent() {
  return pipe(
    extractContent(),
    scan((acc, curr) => acc + curr, "")
  );
}
async function chatCompletions(request) {
  const response = await getBackendSrv().post("/api/plugins/grafana-llm-app/resources/openai/v1/chat/completions", request, {
    headers: { "Content-Type": "application/json" }
  });
  return response;
}
function streamChatCompletions(request) {
  const channel = {
    scope: LiveChannelScope.Plugin,
    namespace: LLM_PLUGIN_ID,
    path: OPENAI_CHAT_COMPLETIONS_PATH,
    data: request
  };
  const messages = getGrafanaLiveSrv().getStream(channel).pipe(filter((event) => isLiveChannelMessageEvent(event)));
  return messages.pipe(
    takeWhile((event) => !isDoneMessage(event.message.choices[0].delta)),
    map((event) => event.message)
  );
}
let loggedWarning = false;
const enabled = async () => {
  var _a, _b;
  try {
    const settings = await getBackendSrv().get(`${LLM_PLUGIN_ROUTE}/settings`, void 0, void 0, {
      showSuccessAlert: false,
      showErrorAlert: false
    });
    return settings.enabled && ((_b = (_a = settings == null ? void 0 : settings.secureJsonFields) == null ? void 0 : _a.openAIKey) != null ? _b : false);
  } catch (e) {
    if (!loggedWarning) {
      logDebug(String(e));
      logDebug("Failed to check if OpenAI is enabled. This is expected if the Grafana LLM plugin is not installed, and the above error can be ignored.");
      loggedWarning = true;
    }
    return false;
  }
};

export { accumulateContent, chatCompletions, enabled, extractContent, isContentMessage, isDoneMessage, streamChatCompletions };
//# sourceMappingURL=openai.js.map
