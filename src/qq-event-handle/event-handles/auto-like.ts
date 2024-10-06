import type { ClientApi } from "../../qq-api";
import { createBookMark } from "../../notion-api";
import {
  analyserShareContent,
  likeMessageTemplate,
  notSupportMessageGuardian,
  type MessageContentInfo,
  type MessageContext,
} from "../utils";

export async function handleAutoLikeMessage({
  messageContent,
  clientApi,
  context,
}: {
  context: MessageContext;
  clientApi: ClientApi;
  messageContent: MessageContentInfo;
}) {
  const { safetyPostMessage } = clientApi;

  notSupportMessageGuardian(context, messageContent.content, clientApi);

  const sharedData = analyserShareContent(messageContent.content);

  const bookMark = sharedData ?? {
    title: messageContent.content,
  };

  const { id: notionPageId } = await createBookMark(bookMark);

  return safetyPostMessage({
    message: likeMessageTemplate.setDate({
      notionPageId,
    }),
    contextId: context.contextId,
    referId: context.messageId,
  });
}
