import type { PartialDatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notionClient } from "./notion-client";
import {
  bookMarkPropertiesMap,
  type BookMarkClientProps,
} from "./book-mark-properties-map";
import { createRow } from "./utils";
import type { CustomError } from "../types";

const { results } = await notionClient.search({
  query: process.env.NOTION_BOOKMARK_NAME,
  filter: {
    property: "object",
    value: "database",
  },
});

const bookMarkDataBase = results[0] as PartialDatabaseObjectResponse;

export async function createBookMark({
  properties,
  content,
}: BookMarkClientProps) {
  try {
    return await notionClient.pages.create({
      parent: { type: "database_id", database_id: bookMarkDataBase.id },
      icon: { type: "emoji", emoji: "✨" },
      properties: createRow(
        properties,
        bookMarkDataBase.properties,
        bookMarkPropertiesMap
      ),
      children: content
        ? [
            {
              paragraph: {
                rich_text: [{ type: "text", text: { content } }],
              },
              type: "paragraph",
              object: "block",
            },
          ]
        : undefined,
    });
  } catch (error) {
    throw {
      postUser: true,
      msg: "创建 notion 数据失败",
      reason: error,
    } as CustomError;
  }
}
