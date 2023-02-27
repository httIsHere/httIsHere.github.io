/*
 * @Author: Tina Huang
 * @Date: 2022-09-09 20:04:15
 * @LastEditors: Tina Huang
 * @LastEditTime: 2023-02-16 16:06:22
 * @Description:
 */
"use strict";

const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const lodash = require("lodash");
const Queue = require("queue");
const filenamify = require("filenamify");
const NotionClient = require("./notion");
const { isPost } = require('./util');
const out = require("./out");

const cwd = process.cwd();

// 需要提取的文章属性字段
const PICK_PROPERTY = [
  "id",
  "title",
  "description",
  "created_at",
  "updated_at",
  "published_at",
  "last_editor",
  "slug",
];

/**
 * Constructor 下载器
 *
 * @prop {Object} client 语雀 client
 * @prop {Object} config 知识库配置
 * @prop {String} cachePath 下载的文章缓存的 JSON 文件
 * @prop {String} postBasicPath 下载的文章最终生成 markdown 的目录
 * @prop {Array} _cachedArticles 文章列表
 *
 */
class Downloader {
  constructor(config) {
    this.client = new NotionClient(config);
    this.config = config;
    this.cachePath = path.join(cwd, config.cachePath);
    this.postBasicPath = path.join(cwd, config.postPath);
    this.lastGeneratePath = config.lastGeneratePath
      ? path.join(cwd, config.lastGeneratePath)
      : "";
    this._cachedArticles = [];
    this.fetchArticle = this.fetchArticle.bind(this);
    this.generatePost = this.generatePost.bind(this);
    this.lastGenerate = 0;
    if (this.lastGeneratePath !== "") {
      try {
        this.lastGenerate = Number(
          fs.readFileSync(this.lastGenerate).toString()
        );
      } catch (error) {
        out.warn(`get last generate time err: ${error}`);
      }
    }
  }

  /**
   * 下载文章详情
   *
   * @param {Object} item 文章概要
   * @param {Number} index 所在缓存数组的下标
   *
   * @return {Promise} data
   */
  fetchArticle(item, index) {
    const { client, _cachedArticles } = this;
    return function () {
      out.info(`download article body: ${item.title}`);
      return client.getArticle(item.id).then((article) => {
        console.log("format article", article)
        _cachedArticles[index] = article;
      });
    };
  }

  /**
   * 下载所有文章
   * 并根据文章是否有更新来决定是否需要重新下载文章详情
   *
   * @return {Promise} queue
   */
  async fetchArticles() {
    const { client, config, _cachedArticles } = this;
    const articles = await client.getArticles();
    if (!Array.isArray(articles)) {
      throw new Error(
        `fail to fetch article list, response: ${JSON.stringify(articles)}`
      );
    }
    out.info(`article amount: ${articles.length}`);
    const realArticles = articles.map((article) =>
      lodash.pick(article, PICK_PROPERTY)
    );
    const queue = new Queue({ concurrency: config.concurrency });

    let article;
    let cacheIndex;
    let cacheArticle;
    let cacheAvaliable;

    const findIndexFn = function (item) {
      return item.slug === article.slug;
    };

    for (let i = 0; i < realArticles.length; i++) {
      article = realArticles[i];
      cacheIndex = _cachedArticles.findIndex(findIndexFn);
      if (cacheIndex < 0) {
        // 未命中缓存，新增一条
        cacheIndex = _cachedArticles.length;
        _cachedArticles.push(article);
        queue.push(this.fetchArticle(article, cacheIndex));
      } else {
        cacheArticle = _cachedArticles[cacheIndex];
        cacheAvaliable =
          +new Date(article.updated_at) === +new Date(cacheArticle.updated_at);
        // 文章有变更，更新缓存
        if (!cacheAvaliable) {
          queue.push(this.fetchArticle(article, cacheIndex));
        }
      }
    }
    return new Promise((resolve, reject) => {
      queue.start(function (err) {
        if (err) return reject(err);
        out.info("download articles done!");
        resolve();
      });
    });
  }

  /**
   * 读取Notion的文章缓存 json 文件
   */
  readNotionCache() {
    const { cachePath } = this;
    out.info(`reading from notion.json: ${cachePath}`);
    try {
      const articles = require(cachePath);
      if (Array.isArray(articles)) {
        this._cachedArticles = articles;
        console.log("reading done!")
        return;
      }
    } catch (error) {
      out.warn(error.message);
      // Do noting
    }
    this._cachedArticles = [];
  }

  /**
   * 写入语雀的文章缓存 json 文件
   */
  writeYuqueCache() {
    const { cachePath, _cachedArticles } = this;
    out.info(`writing to local file: ${cachePath}`);
    fs.writeFileSync(cachePath, JSON.stringify(_cachedArticles, null, 2), {
      encoding: "UTF8",
    });
  }

  /**
   * 生成一篇 markdown 文章
   *
   * @param {Object} post 文章详情
   */
  generatePost(post) {
    if (!isPost(post)) {
      out.error(`invalid post: ${post}`);
      return;
    }

    if (new Date(post.published_at).getTime() < this.lastGenerate) {
      out.info(`post not updated skip: ${post.title}`);
      return;
    }

    const { postBasicPath } = this;
    const { mdNameFormat, adapter } = this.config;
    const fileName = filenamify(post[mdNameFormat]);
    const postPath = path.join(postBasicPath, `${fileName}.md`);
    let transform;
    try {
      transform = require(path.join(__dirname, "./adapter", adapter));
    } catch (error) {
      out.error(`adpater (${adapter}) is invalid.`);
      process.exit(-1);
    }
    out.info(`generate post file: ${postPath}`);
    const text = transform(post);
    fs.writeFileSync(postPath, text, {
      encoding: "UTF8",
    });
  }

  /**
   * 全量生成所有 markdown 文章
   */
  generatePosts() {
    const { _cachedArticles, postBasicPath } = this;
    mkdirp.sync(postBasicPath);
    out.info(`create posts directory (if it not exists): ${postBasicPath}`);
    _cachedArticles.forEach(this.generatePost);
  }

  // 文章下载 => 增量更新文章到缓存 json 文件 => 全量生成 markdown 文章
  async autoUpdate() {
    this.readNotionCache();
    await this.fetchArticles();
    this.writeYuqueCache();
    this.generatePosts();
    if (this.lastGeneratePath) {
      fs.writeFileSync(this.lastGeneratePath, new Date().getTime());
    }
  }
}

module.exports = Downloader;
