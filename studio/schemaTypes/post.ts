import { defineArrayMember, defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "文章",
  type: "document",
  fields: [
    defineField({ name: "title", title: "标题", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "网址标识",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "summary", title: "摘要", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "publishedAt", title: "发布日期", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "readTime", title: "阅读分钟数", type: "number", initialValue: 8 }),
    defineField({ name: "featured", title: "首页精选", type: "boolean", initialValue: false }),
    defineField({
      name: "body",
      title: "正文",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "正文", value: "normal" },
            { title: "二级标题", value: "h2" },
            { title: "引用", value: "blockquote" },
          ],
        }),
        defineArrayMember({
          name: "codeBlock",
          title: "代码块",
          type: "object",
          fields: [
            defineField({ name: "language", title: "语言", type: "string" }),
            defineField({ name: "code", title: "代码", type: "text", rows: 12 }),
          ],
          preview: { select: { title: "language", subtitle: "code" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "publishedAt" } },
});
