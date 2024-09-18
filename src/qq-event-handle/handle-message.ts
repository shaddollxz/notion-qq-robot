import { getReferenceMessage, safetyPostMessageToChannel } from "../api";
import { Directives, type ResponseMessage } from "./types";
import { createBookMark } from "../notion-api/book-mark-data-base";
import {
  analyserDirect,
  analyserShareContent,
  likeMessageTemplate,
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
  handleMsg: ResponseMessage,
  messageContent: MessageContentInfo
) {
  notSupportMessageGuardian(handleMsg, messageContent.content);

  const sharedData = analyserShareContent(messageContent.content);

  const bookMark = sharedData ?? {
    title: messageContent.content,
  };

  const { id: notionPageId } = await createBookMark(bookMark);

  return safetyPostMessageToChannel({
    message: likeMessageTemplate.setDate({
      notionPageId,
    }),
    ...handleMsg,
  });
}

async function handleLikeMessage(
  handleMsg: ResponseMessage,
  messageContent: MessageContentInfo
) {
  referenceMessageGuardian(handleMsg);

  const referenceMessage = await getReferenceMessage({
    channelId: handleMsg.channel_id,
    referId: handleMsg.message_reference.message_id,
  });

  notSupportMessageGuardian(handleMsg, referenceMessage.content);

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

  const { id: notionPageId } = await createBookMark(bookMark);

  return safetyPostMessageToChannel({
    message: likeMessageTemplate.setDate({
      notionPageId,
    }),
    ...handleMsg,
  });
}
