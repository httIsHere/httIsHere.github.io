/*
 * @Author: Tina Huang
 * @Date: 2022-09-09 20:01:39
 * @LastEditors: Tina Huang
 * @LastEditTime: 2023-02-16 16:06:45
 * @Description: 
 */
'use strict';

const Command = require('common-bin');
const Downloader = require('./Downloader');
const out = require('./out');
const config = require('./config'); // 初始化 config

class SyncCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: npm run sync-notion';
  }

  async run() {
    // get articles from yuque or cache
    const downloader = new Downloader(config);
    console.log("downloader ready...")
    await downloader.autoUpdate();
    out.info('sync notion done!');
  }
}

const sc = new SyncCommand;
sc.run()

module.exports = SyncCommand;
