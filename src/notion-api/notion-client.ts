import { Client } from "@notionhq/client";

let notionClient: Client;

export function initialNotionClient(secret: string) {
  return (notionClient = new Client({ auth: secret }));
}

export function getNotionClient() {
  if (!notionClient) throw new Error("first initial Notion Client");

  return notionClient;
}
