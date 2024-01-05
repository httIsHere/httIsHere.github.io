/*
 * @Author: Tina Huang
 * @Date: 2022-09-09 19:27:29
 * @LastEditors: Tina Huang
 * @LastEditTime: 2023-03-01 21:29:53
 * @Description:
 */

const config = require("./config"); // 初始化 config
const { Client, LogLevel, APIErrorCode, ClientErrorCode } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

const notion = new Client({ auth: config.token, logLevel: LogLevel.DEBUG });
const n2m = new NotionToMarkdown({ notionClient: notion });
const database_id = config.database;

class NotionClient {
  async getArticles() {
    try {
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
        return this.formatPage(page);
      });
      return res;
    } catch (error) {
      if(error.code === ClientErrorCode.RequestTimeout) {
        console.log('timeout')
      }
      if (error.code === APIErrorCode.ObjectNotFound) {
        //
        // For example: handle by asking the user to select a different database
        //
      } else {
        // Other error handling code
        console.error(error)
      }
      // return [];
    }
  }
  async getArticle(id) {
    const pageId = id;
    try {
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

      let prefix = `tags: [${tags.join(
        ","
      )}]<br />categories: [${categories.join(
        ","
      )}]<br />cover: ${cover}\n\n---\n\n`;
      // return this.formatPage(page, `${prefix}${block}`);
      return this.getBlocks(pageId).then((block) => {
        console.log(block)
        return this.formatPage(page, `${prefix}${block}`);
      });
    } catch (error) {
      console.error(error);
      return null;
    }
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
    // console.log(page);
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
      title: title ? `${icon} ${title.plain_text}` : null,
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
