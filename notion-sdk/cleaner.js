/*
 * @Author: Tina Huang
 * @Date: 2022-09-10 19:26:55
 * @LastEditors: Tina Huang
 * @LastEditTime: 2022-09-10 19:30:51
 * @Description:
 */
"use strict";

const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const config = require("./config");
const out = require("./out");

const cwd = process.cwd();

const cleaner = {
  // clear directory of generated posts
  cleanPosts() {
    const { postPath } = config;
    const dist = path.join(cwd, postPath);
    out.info(`remove notion posts: ${dist}`);
    rimraf.sync(dist);
  },

  // clear cache of posts' data
  clearCache() {
    const cachePath = path.join(cwd, "notion.json");
    try {
      out.info(`remove notion.json: ${cachePath}`);
      fs.unlinkSync(cachePath);
    } catch (error) {
      out.warn(`remove empty notion.json: ${error.message}`);
    }
  },

  // clear last generated timestamp file
  clearLastGenerate() {
    const { lastGeneratePath } = config;
    if (!lastGeneratePath) {
      return;
    }
    const dist = path.join(cwd, lastGeneratePath);
    out.info(`remove last generated timestamp: ${dist}`);
    rimraf.sync(dist);
  },
};

if (!config) {
  process.exit(0);
}
cleaner.cleanPosts();
cleaner.clearCache();
cleaner.clearLastGenerate();
out.info("notion clean done!");
