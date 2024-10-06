import { client } from "./qq-client";
import type { ClientApi } from "./types";

async function safetyPostMessage({
  message,
  contextId,
  referId,
}: Parameters<ClientApi["safetyPostMessage"]>[0]) {
  try {
    await client.c2cApi.postMessage(contextId, {
      msg_type: 0,
      content: message,
      msg_id: referId,
      // FIXME: 私聊中不支持回复时带上引用信息
      // @ts-ignore
      message_reference: undefined,
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

async function getReferenceMessage(
  _: Parameters<ClientApi["getReferenceMessage"]>[0]
): ReturnType<ClientApi["getReferenceMessage"]> {
  // FIXME: 私聊中不支持读取引用的信息
  throw new Error("私聊中不支持读取引用的信息");
}

export const c2cApi: ClientApi = {
  safetyPostMessage,
  getReferenceMessage,
};
