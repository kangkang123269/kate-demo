const Router = require("koa-router");
const fs = require("fs");
const path = require("path");

let dirname = path.resolve();
let arr = dirname.split("\\");
dirname = arr.join("/");
const _dirname = dirname;

const router = new Router();

const uploadBase64 = async (ctx) => {
  let { base64, sourceId } = ctx.request.body;
  base64 = base64.replace(/^data:image\/\w+;base64,/, "");
  let buffer = Buffer.from(base64, "base64");
  await fs.writeFileSync(`./public/uploads/${sourceId}.png`, buffer);
  ctx.body = {
    code: 200,
    data: { url: `/uploads/${sourceId}.png` },
    msg: "",
  };
};

router.post("/uploadBase64", uploadBase64);

router.get("/", (ctx) => {
  ctx.body = {
    msg: "hello word!",
  };
});

module.exports = router;
