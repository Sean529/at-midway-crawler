# at-midway-crawler

### 安装依赖

- 安装 nodejs，版本 v16.13.0 及以上
- 执行 `npm install`，安装项目依赖

### 启动项目

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 核心代码

[home.ts](./src/controller/home.ts)

### 修改搜索文本和页数

搜索文本和页数在 [constants/index.ts](./src/constants/index.ts) 文件中修改。

```javascript
SEARCH_TEXT; // 标识要所搜的文本
PAGE; // 标识页码，每页10条，默认设置了10，10*10 = 100篇文章
```

### 爬取的文件位置

保存在 [dist 目录下](./dist/)，[TheNewYork.txt](./dist/TheNewYork.txt)。
