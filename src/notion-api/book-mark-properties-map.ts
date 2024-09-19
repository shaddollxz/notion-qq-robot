export interface BookMarkProperties {
  title: string;
  description?: string;
  tags?: Array<string>;
  link?: string;
  from?: string;
}

export interface BookMarkClientProps {
  properties: BookMarkProperties;
  content?: string;
}

// 下面的值对应实际表格的属性，需要同步修改
export const bookMarkPropertiesMap: Record<keyof BookMarkProperties, string> = {
  title: "名称",
  description: "描述",
  tags: "标签",
  link: "链接",
  from: "所属网站",
};
