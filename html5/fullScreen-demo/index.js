class fullScreen {
  constructor(fn) {
    // fn是失败的回调函数
    this.prefixName = ''; // 浏览器前缀
    this.isFullscreenData = true; // 浏览器支持全屏
    this.isFullscreen(fn);
  }
  /**
   * @description: 是否支持全屏+判断浏览器前缀
   * @param {Function} fn 不支持全屏的回调函数 这里设了一个默认值
   */
  isFullscreen(fn) {
    let fullscreenEnabled; // 是否支持全屏
    // 判断浏览器前缀
    if (document.fullscreenEnabled) {
      fullscreenEnabled = document.fullscreenEnabled;
    } else if (document.webkitFullscreenEnabled) {
      fullscreenEnabled = document.webkitFullscreenEnabled;
      this.prefixName = 'webkit';
    } else if (document.mozFullScreenEnabled) {
      fullscreenEnabled = document.mozFullScreenEnabled;
      this.prefixName = 'moz';
    } else if (document.msFullscreenEnabled) {
      fullscreenEnabled = document.msFullscreenEnabled;
      this.prefixName = 'ms';
    }
    if (!fullscreenEnabled) {
      if (fn !== undefined) fn(); // 执行不支持全屏的回调
      this.isFullscreenData = false;
    }
  }

  /**
   * @description: 将传进来的元素全屏
   * @param {String} domName 要全屏的dom名称
   */
  Fullscreen(element) {
    const methodName =
      this.prefixName === ''
        ? 'requestFullscreen'
        : `${this.prefixName}RequestFullScreen`; // API前缀
    element[methodName](); // 调用全屏
  }

  // 退出全屏
  exitFullscreen() {
    const methodName =
      this.prefixName === ''
        ? 'exitFullscreen'
        : `${this.prefixName}ExitFullscreen`; // API 前缀
    document[methodName](); // 调用
  }

  /**
   * @description: 检测有没有元素处于全屏状态
   * @return 布尔值
   */
  isElementFullScreen() {
    const fullscreenElement =
      document.fullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement; // 有前缀的f是大写，没前缀是小写
    if (fullscreenElement === null) {
      return false; // 当前没有元素在全屏状态
    } else {
      return true; // 有元素在全屏状态
    }
  }

  /**
   * @description: 监听进入/离开全屏
   * @param {Function} enter 进入全屏的回调
   *  @param {Function} quit 离开全屏的回调
   */
  screenChange(enter, quit) {
    if (!this.isFullscreenData) return;
    const methodName = `on${this.prefixName}fullscreenchange`;
    document[methodName] = (e) => {
      console.log(e);
      if (this.isElementFullScreen()) {
        enter && enter(); // 进入全屏回调
      } else {
        quit && quit(); // 离开全屏的回调
      }
    };
  }

  /**
   * @description: 浏览器无法进入全屏时触发
   * @param {Function} enterErrorFn 回调
   */
  screenError(enterErrorFn) {
    const methodName = `on${this.prefixName}fullscreenerror`;
    document[methodName] = (e) => {
      enterErrorFn && enterErrorFn(e);
    };
  }
}

let full = new fullScreen(() => {
  console.log('不支持');
});

const iframe = {
  enter: function (element) {
    element.style.display = 'block';
  },
  quit: function (element) {
    element.style.display = 'none';
  },
};

function iframeScreen() {
  const element = document.querySelector('#iframe-one');
  full.Fullscreen(element);
  full.screenChange(
    () => iframe.enter(element),
    () => iframe.quit(element)
  );
}
