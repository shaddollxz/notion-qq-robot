#!/usr/bin/env bun

import { argv } from "bun";
import { AvailableIntentsEventsEnum } from "qq-guild-bot";
import { initialQQClient, getQQWebStock } from "./qq-api";
import { handleMessage } from "./qq-event-handle";
import { formatDateStr } from "./utils";
import { initialNotionClient } from "./notion-api";
import { Command } from "commander";

const program = new Command();

program
  .name(Bun.env.PROGRAM_NAME || "notion-qq-robot")
  .version(Bun.env.PROGRAM_VERSION || "v0.0.0")
  .description(
    Bun.env.PROGRAM_DESCRIPTION ||
      "Let notion bookmark the app's page via qq bots and the app's share feature"
  );

program
  .requiredOption("--robot-app-id <robot-app-id>", "required: qq robot app id")
  .requiredOption("--robot-token <robot-token>", "required: qq robot token")
  .requiredOption("--notion-secret <notion-secret>", "required: notion secret")
  .requiredOption(
    "--notion-bookmark <notion-bookmark>",
    "required: notion star database id"
  )
  .action(
    (options: {
      robotAppId: string;
      robotToken: string;
      notionSecret: string;
      notionBookmark: string;
    }) => {
      initialNotionClient(options.notionSecret);
      initialQQClient({ appID: options.robotAppId, token: options.robotToken });

      main();
    }
  );

program.parse(argv);

export const values = program.opts<{
  robotAppId: string;
  robotToken: string;
  notionSecret: string;
  notionBookmark: string;
}>();

function main() {
  const ws = getQQWebStock();

  // 频道中的子频道发送任意非机器人消息触发
  // @ts-ignore
  ws.on(AvailableIntentsEventsEnum.GUILD_MESSAGES, (data) => {
    console.log(
      `${formatDateStr()} [GUILD_MESSAGES] 事件接收 :`,
      JSON.stringify(data)
    );
    handleMessage(data);
  });

  // 群组和私聊的信息触发
  // @ts-ignore
  ws.on("GROUP_AND_C2C_EVENT", (data) => {
    console.log(
      `${formatDateStr()} [GROUP_AND_C2C_EVENT] 事件接收 :`,
      JSON.stringify(data)
    );
    handleMessage(data);
  });
}
