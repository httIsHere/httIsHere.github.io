/*
 * @Author: Tina Huang
 * @Date: 2022-09-09 19:27:29
 * @LastEditors: HTT httishere0728@gmail.com
 * @LastEditTime: 2023-07-15 21:06:39
 * @Description:
 */

const config = require("./config"); // 初始化 config
const { Client, LogLevel } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

const notion = new Client({
  auth: config.token,
  logLevel: LogLevel.DEBUG,
  // baseUrl: config.baseUrl
});
const n2m = new NotionToMarkdown({
  notionClient: notion,
});
const database_id = config.database;

class NotionClient {
  async getArticles() {
    const { results } = await notion.databases.query({
      database_id,
      filter: {
        and: [
          {
            property: "publish",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });
    console.log(results);
    const res = results.map((page) => {
      // console.log(page.properties.slug)
      return this.formatPage(page);
    });
    return res;
  }
  async getArticle(id) {
    const pageId = id;
    const page = await notion.pages.retrieve({ page_id: pageId });
    let cover = page.cover
      ? page.cover.external
        ? page.cover.external.url
        : page.cover.file
        ? page.cover.file.url
        : null
      : null;

    let tags = page.properties.tags.multi_select.map((tag) => {
      return tag.name;
    });
    let categories = page.properties.categories.multi_select.map((tag) => {
      return tag.name;
    });

    // tags: [Daily]<br />categories: [Daily, Sass]\n\n---\n\n\n

    let prefix = `tags: [${tags.join(",")}]<br />categories: [${categories.join(
      ","
    )}]<br />cover: ${cover}\n\n---\n\n`;

    return this.getBlocks(pageId).then((block) => {
      return this.formatPage(page, `${prefix}${block}`);
    });
  }
  async getBlocks(id) {
    const blockId = id;
    const mdblocks = await n2m.pageToMarkdown(blockId);
    const mdString = n2m.toMarkdownString(mdblocks);
    return mdString.parent;
  }

  async getComments(id) {
    const blockId = id;
    const { results } = await notion.comments.list({ block_id: blockId });
  }

  formatPage(page, body = null) {
    let icon = page.icon
      ? page.icon.type === "emoji"
        ? page.icon.emoji
        : page.icon.type === "file"
        ? page.icon.file.url
        : page.icon.type === "external"
        ? page.icon.external.url
        : null
      : null;
    let cover = page.cover
      ? page.cover.external
        ? page.cover.external.url
        : page.cover.file
        ? page.cover.file.url
        : null
      : null;
    let title = page.properties.title.title[0];
    let description = page.properties.description.rich_text[0];
    return {
      id: page.id,
      slug: page.properties.slug.formula.string,
      icon: page.icon,
      cover,
      url: page.url,
      title: title ? title.plain_text : null,
      format: "lake",
      description: description ? description.plain_text : null,
      updated_at: page.properties.updated_at.last_edited_time,
      created_at: page.properties.created_at.created_time,
      published_at: page.properties.created_at.created_time,
      last_editor: "httishere",
      body,
    };
  }
}

// const n = new NotionClient();
// n.getArticle("29fcc85925db44cea8b38cc4120c4b0f");
// n.getComments("29fcc85925db44cea8b38cc4120c4b0f");

module.exports = NotionClient;
