/*
 * @Author: Tina Huang
 * @Date: 2022-09-10 10:40:32
 * @LastEditors: Tina Huang
 * @LastEditTime: 2022-09-10 18:47:25
 * @Description:
 */

const path = require("path");
const lodash = require("lodash");
const out = require("./out");

const cwd = process.cwd();

const defaultConfig = {
  postPath: "source/_posts/notion",
  cachePath: "notion.json",
  lastGeneratePath: "",
  mdNameFormat: "slug",
  baseUrl: "https://api.notion.com/v1/databases/",
  adapter: "hexo",
  concurrency: 5,
  onlyPublished: false,
  onlyPublic: false,
};

function loadConfig() {
  const pkg = loadJson();
  if (!pkg) {
    out.error("current directory should have a package.json");
    return null;
  }
  const { notionConfig } = pkg;
  if (!lodash.isObject(notionConfig)) {
    out.error("package.yueConfig should be an object.");
    return null;
  }
  const config = Object.assign({}, defaultConfig, notionConfig);
  return config;
}

function loadJson() {
  const pkgPath = path.join(cwd, "package.json");
  // out.info(`loading config: ${pkgPath}`);
  try {
    const pkg = require(pkgPath);
    return pkg;
  } catch (error) {
    // do nothing
  }
}

module.exports = loadConfig();