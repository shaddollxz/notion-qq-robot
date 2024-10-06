import { configDotenv } from "dotenv";
import { AvailableIntentsEventsEnum } from "qq-guild-bot";
import { createOpenAPI, createWebsocket } from "qq-guild-bot";

configDotenv();

const { ROBOT_APP_ID, ROBOT_TOKEN } = process.env;

const testConfig = {
  appID: ROBOT_APP_ID!, // 申请机器人时获取到的机器人 BotAppID
  token: ROBOT_TOKEN!, // 申请机器人时获取到的机器人 BotToken
  intents: [
    // 参考 https://bot.q.qq.com/wiki/develop/nodesdk/wss/model.html
    AvailableIntentsEventsEnum.GUILD_MESSAGES, // 任何发送的消息的监听 需要为私域机器人才能开启
    AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT,
  ], // 事件订阅,用于开启可接收的消息类型
  sandbox: true, // 沙箱支持，可选，默认false. v2.7.0+
};

// 创建 client
export const client = createOpenAPI(testConfig);

export const ws = createWebsocket(testConfig);
