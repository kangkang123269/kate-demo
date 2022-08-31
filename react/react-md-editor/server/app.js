const koa =  require("koa");
const cors =  require("koa-cors");
const router = require("./router.js");
const staticFiles =  require("koa-static");
const koaBody = require("koa-body");

const path =  require("path");

const _dirname = path.resolve();
const app = new koa();

app.use(
  cors({
    // 指定一个或多个可以跨域的域名
    origin: function (ctx) {
      // 设置允许来自指定域名请求
      if (ctx.url === "/") {
        return "*"; // 允许来自所有域名请求, 这个不管用
      }
      // return 'http://localhost:8000'; // 这样就能只允许 http://localhost:8000 这个域名的请求了
      return "*"; // 这样就能只允许 http://localhost:8000 这个域名的请求了
    },
    maxAge: 5, // 指定本次预检请求的有效期，单位为秒。
    credentials: true, // 是否允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept"], // 设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], // 设置获取其他自定义字段
  })
);

app.use(
  koaBody({
    multipart: true,
    formidable: {
      //上传文件存储目录
      uploadDir: path.join(_dirname, `/public/uploads/`),
      //允许保留后缀名
      keepExtensions: true,
      multipart: true,
    },
    jsonLimit: "10mb",
    formLimit: "10mb",
    textLimit: "10mb",
  })
); //解析formdata过来的数据
app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticFiles(_dirname + "/public"));

app.listen("3002");
console.log("项目启动,访问：", "localhost:3002");
