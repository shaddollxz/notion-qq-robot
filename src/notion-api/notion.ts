import { Client } from "@notionhq/client";
import { configDotenv } from "dotenv";

configDotenv();

export const notion = new Client({ auth: process.env.NOTION_SECRET });
