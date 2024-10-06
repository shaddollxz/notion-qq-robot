import type { ClientApi } from "../../qq-api";
import { createBookMark } from "../../notion-api";
import {
  analyserShareContent,
  likeMessageTemplate,
  notSupportMessageGuardian,
  referenceMessageGuardian,
  type MessageContentInfo,
  type MessageContext,
} from "../utils";
import type { BookMarkClientProps } from "../../notion-api/book-mark-properties-map";

export async function handleLikeMessage({
  messageContent,
  clientApi,
  context,
}: {
  context: MessageContext;
  clientApi: ClientApi;
  messageContent: MessageContentInfo;
}) {
  const { getReferenceMessage, safetyPostMessage } = clientApi;

  referenceMessageGuardian(context, clientApi);

  const referenceMessage = await getReferenceMessage({
    contextId: context.contextId,
    referId: context.messageReference.message_id,
  });

  notSupportMessageGuardian(context, referenceMessage.content, clientApi);

  const sharedData = analyserShareContent(referenceMessage.content);

  const bookMark: BookMarkClientProps = {
    properties: {
      ...sharedData.properties,
      description: messageContent.content || sharedData.properties.description,
    },
    content: referenceMessage.content,
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
