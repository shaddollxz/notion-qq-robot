import { getReferenceMessage, safetyPostMessageToChannel } from "../api";
import { Directives, type ResponseMessage } from "./types";
import { createBookMark } from "../notion-api/book-mark-data-base";
import {
  analyserDirect,
  analyserShareContent,
  notSupportMessageGuardian,
  referenceMessageGuardian,
  type MessageContentInfo,
} from "./utils";

export async function handleMessage({
  msg,
}: {
  eventType: string;
  eventId: string;
  msg: ResponseMessage;
}) {
  const messageContent = analyserDirect(msg.content);

  try {
    switch (messageContent.direct) {
      case Directives.Like: {
        return await handleLikeMessage(msg, messageContent);
      }
      case Directives.AutoLike: {
        return await handleAutoLikeMessage(msg, messageContent);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function handleAutoLikeMessage(
  { channel_id: channelId }: ResponseMessage,
  messageContent: MessageContentInfo
) {
  notSupportMessageGuardian(channelId, messageContent.content);

  const sharedData = analyserShareContent(messageContent.content);

  const bookMark = sharedData ?? {
    title: messageContent.content,
  };

  const { id } = await createBookMark(bookMark);

  return safetyPostMessageToChannel({
    message: `接受到消息
指令: auto_like
已创建收藏: ${id}`,
    channelId,
  });
}

async function handleLikeMessage(
  { channel_id: channelId, message_reference }: ResponseMessage,
  messageContent: MessageContentInfo
) {
  referenceMessageGuardian(channelId, message_reference);

  const referenceMessage = await getReferenceMessage({
    channelId,
    referId: message_reference.message_id,
  });

  notSupportMessageGuardian(channelId, referenceMessage.content);

  const sharedData = analyserShareContent(referenceMessage.content);

  const bookMark = sharedData
    ? {
        ...sharedData,
        description: messageContent.content || sharedData.description,
      }
    : {
        title: referenceMessage.content,
        description: messageContent.content,
      };

  const { id } = await createBookMark(bookMark);

  return safetyPostMessageToChannel({
    message: `接受到消息
指令: like
已创建收藏: ${id}`,
    channelId,
  });
}
