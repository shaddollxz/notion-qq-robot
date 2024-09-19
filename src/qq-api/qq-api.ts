import { formatDateStr } from "../utils";
import { client } from "./qq-client";
import type { IMessage } from "qq-guild-bot";
import type { ResponseMessage } from "./types";

export async function safetyPostMessageToChannel({
  message,
  channel_id,
  id,
}: ResponseMessage & {
  message: string;
}) {
  try {
    await client.messageApi.postMessage(channel_id, {
      content: message,
      msg_id: id,
      message_reference: {
        message_id: id,
      },
    });
  } catch (error) {
    if (
      (error as { code: string; message: string }).code !== "304023" &&
      (error as { code: string; message: string }).message !==
        "push message is waiting for audit now"
    ) {
      console.error(
        `[${formatDateStr()}] 回复消息失败\n${JSON.stringify(error)}`
      );
    }
  }
}

export async function getReferenceMessage({
  channelId,
  referId: messageId,
}: {
  referId: string;
  channelId: string;
}) {
  const { data } = await client.messageApi.message(channelId, messageId);
  return data.message as IMessage;
}
