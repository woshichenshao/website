import { defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "作者资料",
  type: "document",
  fields: [
    defineField({ name: "name", title: "笔名", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "bio", title: "简介", type: "text", rows: 4 }),
    defineField({ name: "email", title: "联系邮箱", type: "string" }),
  ],
});
