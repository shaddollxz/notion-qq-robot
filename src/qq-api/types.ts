import type { IMessage, MessageReference } from "qq-guild-bot";

export type ResponseMessage = IMessage & {
  message_reference?: MessageReference;
};

export type ClientApi = {
  safetyPostMessage: (ctx: {
    message: string;
    contextId: string;
    // 回复的 id，如果没有则是主动发起的消息
    referId?: string;
  }) => Promise<void>;

  getReferenceMessage: (referData: {
    referId: string;
    // 频道里是 channelId 私聊里是 userId 群组里是 groupId
    contextId: string;
  }) => Promise<IMessage>;
};
