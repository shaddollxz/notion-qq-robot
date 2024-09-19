import type { PartialDatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notionClient } from "./notion-client";
import {
  bookMarkPropertiesMap,
  type BookMarkRow,
} from "./book-mark-properties-map";
import { createRow } from "./utils";

const { results } = await notionClient.search({
  query: process.env.NOTION_BOOKMARK_NAME,
  filter: {
    property: "object",
    value: "database",
  },
});

const bookMarkDataBase = results[0] as PartialDatabaseObjectResponse;

export async function createBookMark(data: BookMarkRow) {
  return await notionClient.pages.create({
    parent: { type: "database_id", database_id: bookMarkDataBase.id },
    properties: createRow(
      data,
      bookMarkDataBase.properties,
      bookMarkPropertiesMap
    ),
  });
}
