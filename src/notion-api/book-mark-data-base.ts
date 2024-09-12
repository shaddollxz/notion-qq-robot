import type { PartialDatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "./notion";
import {
  bookMarkPropertiesMap,
  type BookMarkRow,
} from "./book-mark-properties-map";
import { createRow } from "./utils";

const { results } = await notion.search({
  query: process.env.NOTION_BOOKMARK_NAME,
  filter: {
    property: "object",
    value: "database",
  },
});

const bookMarkDataBase = results[0] as PartialDatabaseObjectResponse;

export async function createBookMark(data: BookMarkRow) {
  return await notion.pages.create({
    parent: { type: "database_id", database_id: bookMarkDataBase.id },
    properties: createRow(
      data,
      bookMarkDataBase.properties,
      bookMarkPropertiesMap
    ),
  });
}

// TODO: 更新数据列
