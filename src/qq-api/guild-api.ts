import { client } from "./qq-client";
import type { ClientApi } from "./types";

async function safetyPostMessage({
  message,
  contextId,
  referId,
}: Parameters<ClientApi["safetyPostMessage"]>[0]) {
  try {
    await client.messageApi.postMessage(contextId, {
      content: message,
      msg_id: referId,
      message_reference: referId
        ? {
            message_id: referId,
          }
        : undefined,
    });
  } catch (error) {
    if (
      (error as { code: string; message: string }).code !== "304023" &&
      (error as { code: string; message: string }).message !==
        "push message is waiting for audit now"
    ) {
      console.error(`回复消息失败\n${JSON.stringify(error)}`);
    }
  }
}

async function getReferenceMessage({
  contextId,
  referId: messageId,
}: Parameters<ClientApi["getReferenceMessage"]>[0]): ReturnType<
  ClientApi["getReferenceMessage"]
> {
  const { data } = await client.messageApi.message(contextId, messageId);
  return data.message;
}

export const guildApi: ClientApi = {
  safetyPostMessage,
  getReferenceMessage,
};
