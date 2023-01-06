/*
 * @Author: Tina Huang
 * @Date: 2022-09-09 19:27:29
 * @LastEditors: Tina Huang
 * @LastEditTime: 2022-09-10 19:44:04
 * @Description:
 */

const config = require("./config"); // 初始化 config
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

const notion = new Client({ auth: config.token });
const n2m = new NotionToMarkdown({ notionClient: notion });
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
    const res = results.map((page) => {
      // console.log(page.properties.slug)
      return this.formatPage(page);
    });
    return res;
  }
  async getArticle(id) {
    const pageId = id;
    const page = await notion.pages.retrieve({ page_id: pageId });
    let cover = page.cover ? page.cover.external.url : null;

    let tags = page.properties.tags.multi_select.map(tag => {
        return tag.name
    })
    let categories = page.properties.categories.multi_select.map(tag => {
        return tag.name
    })

    // tags: [Daily]<br />categories: [Daily, Sass]\n\n---\n\n\n

    let prefix = `tags: [${tags.join(",")}]<br />categories: [${categories.join(",")}]<br />cover: ${cover}\n\n---\n\n`

    return this.getBlocks(pageId).then((block) => {
      return this.formatPage(page, `${prefix}${block}`);
    });
  }
  async getBlocks(id) {
    const blockId = id;
    const mdblocks = await n2m.pageToMarkdown(blockId);
    const mdString = n2m.toMarkdownString(mdblocks);
    return mdString;
  }

  async getComments(id) {
    const blockId = id;
    const { results } = await notion.comments.list({ block_id: blockId });
    console.log(results[0].rich_text);
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
    let cover = page.cover ? page.cover.external.url : null;
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
// n.getComments("7d23c850f4fa4200b859d0d4ab0d6294");

module.exports = NotionClient;
