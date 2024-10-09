#!/usr/bin/env bun

import { $, argv } from "bun";
import { initialQQClient } from "./qq-api";
import { initialNotionClient } from "./notion-api";
import { Command } from "commander";
import { serve, starCommand } from "./commands";

const program = new Command();

program
  .name(Bun.env.PROGRAM_NAME || "notion-qq-robot")
  .version(Bun.env.PROGRAM_VERSION || "v0.0.0")
  .description(
    Bun.env.PROGRAM_DESCRIPTION ||
      "Let notion bookmark the app's page via qq bots and the app's share feature"
  );

export const options = program.opts<{
  robotAppId: string;
  robotToken: string;
  notionSecret: string;
  notionBookmark: string;
}>();

// start QQ robot serve
program
  .command("serve")
  .description("Turn on the service of QQ robot")
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

      serve();
    }
  );

// star directive
program
  .command("star [shared]")
  .description("Analyze the share link and star it")
  .requiredOption("--notion-secret <notion-secret>", "required: notion secret")
  .requiredOption(
    "--notion-bookmark <notion-bookmark>",
    "required: notion star database id"
  )
  .action(
    async (
      shared: string,
      options: { notionSecret: string; notionBookmark: string }
    ) => {
      if (!shared) {
        if (await Bun.stdin.exists()) {
          shared = await Bun.stdin.text();
        } else {
          throw "error: missing required argument 'shared'";
        }
      }

      initialNotionClient(options.notionSecret);

      const notionPageId = await starCommand(shared);

      await $`echo ${notionPageId}`;
    }
  );

program.parse(argv);
