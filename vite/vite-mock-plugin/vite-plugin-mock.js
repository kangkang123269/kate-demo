import path from 'path';

let mockRouteMap = {};

function matchRoute(req) {
  let url = req.url;
  let method = req.method.toLowerCase();
  let routeList = mockRouteMap[method];

  return routeList && routeList.find((item) => item.path === url);
}

function createRoute(mockConfList) {
  mockConfList.forEach((mockConf) => {
    let method = mockConf.type || 'get';
    let path = mockConf.url;
    let handler = mockConf.response;
    // 路由对象
    let route = { path, method: method.toLowerCase(), handler };
    if (!mockRouteMap[method]) {
      mockRouteMap[method] = [];
    }
    console.log('create mock api: ', route.method, route.path);
    // 存入映射对象中
    mockRouteMap[method].push(route);
  });
}

// 实现一个send方法，可以设置：
// 1. Content-Length
// 2. content-type
// 3. status
// 4. response
function send(body) {
  let chunk = JSON.stringify(body);
  // Content-Length
  if (chunk) {
    chunk = Buffer.from(chunk, 'utf-8');
    this.setHeader('Content-Length', chunk.length);
  }
  // content-type
  this.setHeader('Content-Type', 'application/json');
  // status
  this.statusCode = 200;
  // response
  this.end(chunk, 'utf8');
}
export default function (options = {}) {
  // 获取mock文件入口，默认index
  options.entry = options.entry || './mock/index.js';

  // 转换为绝对路径
  if (!path.isAbsolute(options.entry)) {
    options.entry = path.resolve(process.cwd(), options.entry);
  }

  return {
    configureServer: async function ({ middlewares: app }) {
      // 定义路由表
      const mockObj = { ...(await import(options.entry)) }.default;
      // 创建路由表
      createRoute(mockObj);

      // 定义中间件：路由匹配
      const middleware = (req, res, next) => {
        // 1. 执行匹配过程
        let route = matchRoute(req);
        
        // 2. 存在匹配，则这个是一个mock请求
        if (route) {
          console.log('mock request', route.method, route.path);
          res.send = send;
          // 执行匹配的数据
          route.handler(req, res);
        } else {
          next();
        }
      };
      app.use(middleware);
    },
  };
}
