import { Controller, Get } from '@midwayjs/decorator';
import { appendFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { forEach } from 'lodash';

import {
  CURSOR,
  DIRECTORY,
  DOMAIN,
  FILENAME,
  NEWLINE,
  PAGE,
  SEARCH_TEXT,
  URI,
} from '../constants';
import { http, promiseify } from '../utils/util';

@Controller('/')
export class HomeController {
  getList = async (cursor: string): Promise<any> => {
    const body: string = await http(SEARCH_TEXT, cursor);
    const result = JSON.parse(body);
    return result;
  };

  getEdges = async edges => {
    forEach(edges, async item => {
      const result = await promiseify(item.node.node.url);
      const title = result.$('h1').text();
      const text = result.$('section p').text();
      appendFileSync(
        `${DIRECTORY}/${FILENAME}.txt`,
        `《${title}》${NEWLINE}${text}${NEWLINE}${NEWLINE}`
      );
      return Promise.resolve();
    });
  };

  getCycleList = async (cursor: string): Promise<any> => {
    const result = await this.getList(cursor);
    const { data } = result;
    const { search } = data;
    const { hits } = search;
    const { pageInfo, edges } = hits;
    const { endCursor } = pageInfo;
    return Promise.resolve({ endCursor, edges });
  };

  @Get('/')
  async index() {
    if (existsSync(`${DIRECTORY}/${FILENAME}.txt`)) {
      console.log(
        '%c AT 🥝 DIRECTORY 🥝-48',
        'font-size:13px; background:#de4307; color:#f6d04d;',
        DIRECTORY
      );
      // 存在则删除
      unlinkSync(`${DIRECTORY}/${FILENAME}.txt`);
    }
    if (!existsSync(`${DIRECTORY}`)) {
      // 不存在目录则创建
      mkdirSync(`${DIRECTORY}`);
    }
    await this.first();
    let page = PAGE;
    let cursor = CURSOR;
    while (page > 1) {
      page -= 1;
      const data = await this.getCycleList(cursor);
      cursor = data.endCursor;
      await this.getEdges(data.edges);
    }

    return '恭喜你，成功了';
  }

  first = async () => {
    const res = await promiseify(URI);
    const { $ } = res;
    const tagA = $('ol > li a');
    tagA.each(async item => {
      const href = $(item).attr('href');
      const result = await promiseify(`${DOMAIN}${href}`);
      const title = result.$('h1').text();
      const text = result.$('section p').text();
      appendFileSync(
        `${DIRECTORY}/${FILENAME}.txt`,
        `《${title}》${NEWLINE}${text}${NEWLINE}${NEWLINE}`
      );
    });

    return Promise.resolve();
  };
}

// 1. 获取搜索的列表 ✅
// 2. 获取x页更多
// 3. 将每页的文章内容中 x 不分的文本提取出来保存到 txt 文件中
