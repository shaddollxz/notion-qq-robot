import type { CustomError } from "@/types";
import { getQQClient } from "./qq-client";
import type { ClientApi } from "./types";

async function safetyPostMessage({
  message,
  contextId,
  referId,
}: Parameters<ClientApi["safetyPostMessage"]>[0]) {
  const client = getQQClient();

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
      throw {
        postUser: false,
        msg: `回复消息失败\n${JSON.stringify(error)}`,
      } as CustomError;
    }
  }
}

async function getReferenceMessage({
  contextId,
  referId: messageId,
}: Parameters<ClientApi["getReferenceMessage"]>[0]): ReturnType<
  ClientApi["getReferenceMessage"]
> {
  const client = getQQClient();

  const { data } = await client.messageApi.message(contextId, messageId);

  return data.message;
}

export const guildApi: ClientApi = {
  safetyPostMessage,
  getReferenceMessage,
};
