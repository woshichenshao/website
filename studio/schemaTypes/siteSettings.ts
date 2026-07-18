import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "站点设置",
  type: "document",
  fields: [
    defineField({ name: "title", title: "站点名称", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "tagline", title: "定位语", type: "string" }),
    defineField({ name: "description", title: "SEO 默认描述", type: "text", rows: 3 }),
  ],
});
