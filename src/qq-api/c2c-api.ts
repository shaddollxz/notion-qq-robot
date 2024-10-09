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
      throw {
        postUser: false,
        msg: `回复消息失败\n${JSON.stringify(error)}`,
      } as CustomError;
    }
  }
}

async function getReferenceMessage(
  _: Parameters<ClientApi["getReferenceMessage"]>[0]
): ReturnType<ClientApi["getReferenceMessage"]> {
  // FIXME: 私聊中不支持读取引用的信息
  throw { postUser: true, msg: "私聊中不支持读取引用的信息" } as CustomError;
}

export const c2cApi: ClientApi = {
  safetyPostMessage,
  getReferenceMessage,
};
