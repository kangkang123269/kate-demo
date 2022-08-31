export const getFileContent = function (fileInput, callback) {
  if (
    fileInput.files &&
    fileInput.files.length > 0 &&
    fileInput.files[0].size > 0
  ) {
    //下面这一句相当于JQuery的：var file =$("#upload").prop('files')[0];
    var file = fileInput.files[0];
    if (window.FileReader) {
      var reader = new FileReader();
      reader.onloadend = function (evt) {
        // console.log(evt.target.readyState)
        // ==2 或者 FileReader.DONE
        if (evt.target.readyState == 2) {
          //文件内容
          callback(evt.target.result);
        }
      };
      /*
	         readAsText 方法可以将 Blob 或者 File 对象转根据特殊的编码格式转化为内容(字符串形式)
	         这个方法是异步的，也就是说，只有当执行完成后才能够查看到结果，如果直接查看是无结果的，并返回undefined
	         也就是说必须要挂载 实例下的 onload 或 onloadend 的方法处理转化后的结果
	         */
      // readAsText 第二个参数为指定编码格式
      reader.readAsText(file);
    }
  }
};
