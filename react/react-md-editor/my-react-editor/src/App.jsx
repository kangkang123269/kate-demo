import React, { useEffect, useState } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import domToImage from "dom-to-image";
import Code from "./Code";
import { getFileContent } from "./func";
import axios from "axios";
import "./markdown.less";

const mdKaTeX = `
~~~mermaid
 sequenceDiagram
 Alice->>John: Hello John, how are you?
 loop Healthcheck
     John->>John: Fight against hypochondria
 end
 Note right of John: Rational thoughts!
 John-->>Alice: Great!
 John->>Bob: How about you?
 Bob-->>John: Jolly good!
~~~
`;

const textToImage = {
  name: "Text To Image",
  keyCommand: "text2image",
  buttonProps: { "aria-label": "downImage" },
  icon: <div>图片预览</div>,
  execute: (state, api) => {
    const dom = document.getElementsByClassName("gooooooooo")[0];
    if (dom) {
      domToImage.toJpeg(dom, {}).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "博客.jpg";
        link.href = dataUrl;
        link.click();
      });
    }
  },
};

const textToMd = {
  name: "Text to markdown",
  keyCommand: "text2markdown",
  buttonProps: {},
  icon: <div>Markdown下载</div>,
  execute: (state, api) => {
    // 要保存的字符串
    const stringData = state.text;
    // dada 表示要转换的字符串数据，type 表示要转换的数据格式
    const blob = new Blob([stringData], {
      type: "text/markdown",
    });
    // 根据 blob生成 url链接
    const objectURL = URL.createObjectURL(blob);

    // 创建一个 a 标签Tag
    const aTag = document.createElement("a");
    // 设置文件的下载地址
    aTag.href = objectURL;
    // 设置保存后的文件名称
    aTag.download = "博客.md";
    // 给 a 标签添加点击事件
    aTag.click();
    // 释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。
    // 当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
    URL.revokeObjectURL(objectURL);
  },
};

export default function App() {
  const blogData = localStorage.getItem("blogData");
  const [value, setValue] = React.useState(blogData ? blogData : mdKaTeX);
  const [isCodePreview, setIsCodePreview] = useState(false);
  const [listDom, setListDom] = useState([]);
  const [isLight, setIsLight] = useState(true);
  const imgReader = (item, targetVal) => {
    var blob = item.getAsFile(),
      reader = new FileReader();

    reader.onload = function (e) {
      let sourceId = new Date().getTime();
      let base64 = e.target.result;
      var rangeData = { text: "", start: 0, end: 0 };
      const selection = document.activeElement; // 获取当前焦点所在元素
      if (!selection) return false;
      rangeData.start = selection.selectionStart;
      rangeData.end = selection.selectionEnd;
      console.log(rangeData);
      console.log(targetVal.substring(0, rangeData.start));
      axios
        .post("http://localhost:3002/uploadBase64", { base64, sourceId })
        .then((res) => {
          console.log(res.data.data);
          const url = `![kangshengshuoImg](http://localhost:3002${res.data.data.url})`;
          rangeData.text =
            targetVal.substring(0, rangeData.start) +
            url +
            targetVal.substring(rangeData.end);

          setValue(rangeData.text);
          const len = rangeData.start + url.length;
        });
    };

    reader.readAsDataURL(blob);
  };
  useEffect(() => {
    const dom = document.getElementsByClassName("w-md-editor-preview")[0];
    console.log(dom);
    if (isCodePreview) {
      dom.style.width = "60%";
      dom.style.margin = "auto";
      dom.style.left = "20%";
    } else {
      dom.style.width = "50%";
      dom.style.margin = "0";
      dom.style.left = "auto";
    }
  }, [isCodePreview]);
  useEffect(() => {
    document.onpaste = pasteLitener;
    const dom = document.getElementsByTagName("preview");
    console.log(dom);
    document.get;
    return () => {
      document.onpaste = null;
    };
  }, []);
  const pasteLitener = (e) => {
    var clipboardData = e.clipboardData,
      i = 0,
      items,
      item,
      types;
    const targetVal = e.target.value;
    if (clipboardData) {
      items = clipboardData.items;

      if (!items) {
        return;
      }

      item = items[0];
      types = clipboardData.types || [];

      for (; i < types.length; i++) {
        if (types[i] === "Files") {
          item = items[i];
          break;
        }
      }

      if (item && item.kind === "file" && item.type.match(/^image\//i)) {
        imgReader(item, targetVal);
      }
    }
  };
  const handleClickToTarget = (top) => {
    const dom = document.getElementsByClassName("w-md-editor-preview")[0];
    dom.scrollTo({
      top: top - 30,
      behavior: "smooth",
    });
  };
  return (
    <div>
      <MDEditor
        className="gooooooooo"
        value={value}
        onChange={setValue}
        fullscreen={true}
        height={400}
        autoFocus={true}
        commands={[
          commands.group(
            [
              commands.title1,
              commands.title2,
              commands.title3,
              commands.title4,
              commands.title5,
              commands.title6,
            ],
            {
              name: "title",
              groupName: "title",
              buttonProps: { "aria-label": "title" },
              icon: <div>标题</div>,
            }
          ),
          commands.divider,
          commands.group([], {
            name: "theme",
            groupName: "theme",
            buttonProps: { "aria-label": "theme" },
            icon: <div>主题</div>,
            children: () => {
              return (
                <div className="themeContainer">
                  <div
                    className="option-button"
                    onClick={() => {
                      document.documentElement.setAttribute(
                        "data-color-mode",
                        "dark"
                      );
                      setIsLight(false);
                    }}
                  >
                    夜间
                  </div>
                  <div
                    className="option-button"
                    onClick={() => {
                      document.documentElement.setAttribute(
                        "data-color-mode",
                        "light"
                      );
                      setIsLight(true);
                    }}
                  >
                    高亮
                  </div>
                </div>
              );
            },
          }),
          commands.divider,
          textToImage,
          commands.divider,
          textToMd,
          commands.divider,
          {
            name: "upload",
            keyCommand: "upload",
            groupName: "upload",
            buttonProps: { "aria-label": "upload" },
            icon: <div>上传</div>,
            execute: ({ state, api }) => {
              let input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", ".md");
              input.onchange = function () {
                let file = this.files[0];
                //file.name 文件名称
                console.log(file, file.name);
                getFileContent(this, function (str) {
                  setValue(str);
                });
              };
              input.click(); // 模拟手动点击
            },
          },
          commands.divider,
          {
            name: "save",
            keyCommand: "save",
            groupName: "save",
            buttonProps: { "aria-label": "save" },
            icon: <div>保存</div>,
            shortcuts: "ctrlcmd+s",
            execute: (state, api) => {
              localStorage.setItem("blogData", state.text);
              console.log("保存成功！");
            },
          },
          commands.divider,
          {
            name: "submit",
            keyCommand: "submit",
            groupName: "submit",
            buttonProps: { "aria-label": "submit" },
            icon: <div>发布</div>,
            execute: (state, api) => {
              // 更新content接口
            },
          },
        ]}
        extraCommands={[
          {
            ...commands.codeEdit,
            execute: (state, api) => {
              setListDom([]);
            },
          },
          {
            ...commands.codeLive,
            execute: (state, api) => {
              setIsCodePreview(false);
              setListDom([]);
            },
          },
          {
            ...commands.codePreview,
            execute: (state, api) => {
              setIsCodePreview(true);
              const titleDom = document.querySelectorAll(".wmde-markdown")[0];
              console.log(titleDom.childNodes);
              let lists = titleDom.childNodes;
              let vaildContentTag = ["H1", "H2", "H3"];
              let domList = [];
              for (let i = 0; i < lists.length; i++) {
                if (vaildContentTag.includes(lists[i].tagName)) {
                  const title = lists[i].tagName;
                  const text = lists[i].innerText;
                  const top = lists[i].offsetTop;
                  domList.push({ key: i, title, text, top });
                }
              }
              console.log(domList);
              setListDom(domList);
            },
          },
          commands.fullscreen,
        ]}
        preview="live"
        previewOptions={{
          components: {
            code: Code,
          },
        }}
      />
      {listDom.length ? (
        <div className={isLight ? "tagContent tagContentLight" : "tagContent tagContentDrak"}>
          <div className="title">目录</div>
          <div className="item">
            {listDom?.map((item) => (
              <div
                className={item.title}
                key={item.key}
                onClick={() => handleClickToTarget(item.top)}
              >
                · {item.text}
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
