import { AvailableIntentsEventsEnum } from "qq-guild-bot";
import { createOpenAPI, createWebsocket } from "qq-guild-bot";

let client: ReturnType<typeof createOpenAPI>;

let ws: ReturnType<typeof createWebsocket>;

// 创建 client
export function initialQQClient({
  appID,
  token,
}: {
  appID: string;
  token: string;
}) {
  const testConfig = {
    appID, // 申请机器人时获取到的机器人 BotAppID
    token, // 申请机器人时获取到的机器人 BotToken
    intents: [
      // 参考 https://bot.q.qq.com/wiki/develop/nodesdk/wss/model.html
      AvailableIntentsEventsEnum.GUILD_MESSAGES, // 任何发送的消息的监听 需要为私域机器人才能开启
      AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT,
    ], // 事件订阅,用于开启可接收的消息类型
    sandbox: true, // 沙箱支持，可选，默认false. v2.7.0+
  };

  client = createOpenAPI(testConfig);
  ws = createWebsocket(testConfig);

  return {
    client,
    ws,
  };
}

export function getQQWebStock() {
  if (!ws) throw new Error("first initial QQ Client");

  return ws;
}

export function getQQClient() {
  if (!client) throw new Error("first initial QQ Client");

  return client;
}
