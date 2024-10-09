import type { ClientApi } from "@/qq-api";
import {
  notSupportMessageGuardian,
  type MessageContentInfo,
  type MessageContext,
} from "../utils";
import { likeMessageTemplate } from "../constants";
import { starCommand } from "@/commands";

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

  notSupportMessageGuardian(messageContent.content);

  const notionPageId = await starCommand(messageContent.content, {
    properties: {
      title: messageContent.content,
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
