import Crawler = require('crawler');
const request = require('request'); //request请求库

import { URL } from '../constants';

export const promiseify = (
  uri: string,
  headers?: Crawler.CreateCrawlerOptions['headers']
): Promise<Crawler.CrawlerRequestResponse> => {
  return new Promise((resolve, reject) => {
    const c = new Crawler({
      headers,
      maxConnections: 1,
      // 两次请求之间将闲置1000ms
      rateLimit: 1000,
      // 在每个请求处理完毕后将调用此回调函数
      callback: function (error, res, done) {
        if (error) {
          console.log(error);
        } else {
          console.log();
        }
        done();
      },
    });

    c.queue({
      uri,
      timeout: 20000,
      callback: function (error, res, done) {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
        done();
      },
    });
  });
};

export const http = (text, cursor): Promise<string> => {
  const data = `{"operationName":"SearchRootQuery","variables":{"first":10,"sort":"best","text":"${text}","filterQuery":"","sectionFacetFilterQuery":"","typeFacetFilterQuery":"","sectionFacetActive":false,"typeFacetActive":false,"cursor":"${cursor}"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"36625f535a2f15be8e7bf7165fbc1de88f02a9f7466472360cd0b91480a6c23b"}}}`;

  return new Promise((result, reject) => {
    request(
      {
        url: URL,
        method: 'post', //请求方法 post
        headers: {
          accept: '*/*',
          'accept-language': 'zh-CN,zh;q=0.9',
          'content-type': 'application/json',
          'nyt-app-type': 'project-vi',
          'nyt-app-version': '0.0.5',
          'nyt-token':
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs+/oUCTBmD/cLdmcecrnBMHiU/pxQCn2DDyaPKUOXxi4p0uUSZQzsuq1pJ1m5z1i0YGPd1U1OeGHAChWtqoxC7bFMCXcwnE1oyui9G1uobgpm1GdhtwkR7ta7akVTcsF8zxiXx7DNXIPd2nIJFH83rmkZueKrC4JVaNzjvD+Z03piLn5bHWU6+w+rA+kyJtGgZNTXKyPh6EC6o5N+rknNMG5+CdTq35p8f99WjFawSvYgP9V64kgckbTbtdJ6YhVP58TnuYgr12urtwnIqWP9KSJ1e5vmgf3tunMqWNm6+AnsqNj8mCLdCuc5cEB74CwUeQcP2HQQmbCddBy2y0mEwIDAQAB',
          'sec-ch-ua':
            '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
        body: data,
      },
      (err, res, body: string) => {
        if (err) {
          reject(err);
        } else {
          result(body);
        }
      }
    );
  });
};
