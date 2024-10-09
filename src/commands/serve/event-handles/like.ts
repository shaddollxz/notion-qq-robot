import type { ClientApi } from "@/qq-api";

import {
  notSupportMessageGuardian,
  referenceMessageGuardian,
  type MessageContentInfo,
  type MessageContext,
} from "../utils";
import { likeMessageTemplate } from "../constants";
import { starCommand } from "@/commands";

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

  referenceMessageGuardian(context);

  const referenceMessage = await getReferenceMessage({
    contextId: context.contextId,
    referId: context.messageReference.message_id,
  });

  notSupportMessageGuardian(referenceMessage.content);

  const notionPageId = await starCommand(referenceMessage.content, {
    content: referenceMessage.content,
    properties: {
      description: messageContent.content,
    },
  });

  await safetyPostMessage({
    message: likeMessageTemplate.setDate({
      notionPageId,
    }),
    contextId: context.contextId,
    referId: context.messageId,
  });

  return notionPageId;
}
