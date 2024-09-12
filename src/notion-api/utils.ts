import type {
  CreatePageParameters,
  PartialDatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export function createRow(
  data: object,
  properties: PartialDatabaseObjectResponse["properties"],
  fieldMap: Record<string, string>
) {
  return Object.fromEntries(
    Object.entries(data).flatMap(([key, value]) => {
      const field = properties[fieldMap[key as keyof typeof fieldMap]];

      let body: CreatePageParameters["properties"][string] | undefined;

      switch (field.type) {
        case "title": {
          body = {
            type: "title",
            title: [{ type: "text", text: { content: value } }],
          };
          break;
        }
        case "url": {
          body = {
            type: "url",
            url: value,
          };
          break;
        }
        case "rich_text": {
          body = {
            type: "rich_text",
            rich_text: [{ type: "text", text: { content: value } }],
          };
          break;
        }
        // TODO: 多选和单选
      }

      if (!body) return [];

      return [[field.name, body] as const];
    })
  ) as CreatePageParameters["properties"];
}
