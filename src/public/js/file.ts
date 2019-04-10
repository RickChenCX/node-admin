$("#file-input").fileinput({
    language: "zh", // 设置语言
    uploadUrl: "/controller/uploadFile", // 上传的地址
    allowedFileExtensions : ["md"], // 接收的文件后缀
    showUpload: true, // 是否显示上传按钮
    showCaption: false, // 是否显示标题
    browseClass: "btn btn-primary", // 按钮样式
    previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
    uploadExtraData: () => {
        let data = {
            title: $("#file-title").val(),
            subtitle: $("#file-describe").val(),
            language: $("#file-language option:selected").val(),
            createTime: new Date()
        };
        return data;
    }
  });
$("#submit-file").click(() => {
    $("#file-input").fileinput("upload");
});
$("#file-input").on("fileuploaded", function(event, data, previewId, index) {
    if (data.response.errorCode == 200) {
        window.location.href = "/file?name=file";
    }
});
// $("#file-input").on("filebatchselected", function(event, files) {
//     console.log(event);
//     $("#file-input").fileinput("upload");
// });