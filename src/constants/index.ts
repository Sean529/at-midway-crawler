export const SEARCH_TEXT = 'Russia-Ukraine+war'; // 搜索的文本
export const PAGE = 10; // 多少页

export const DOMAIN = 'https://www.nytimes.com';
export const URI = `${DOMAIN}/search?query=${SEARCH_TEXT}`;
export const URL = 'https://samizdat-graphql.nytimes.com/graphql/v2';
export const CURSOR = 'YXJyYXljb25uZWN0aW9uOjk='; // 第二页标识

// \r\n 【windows】; \n【linux】 ; \r【mac】
export const NEWLINE = '\n'; // 换行符
