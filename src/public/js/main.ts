
interface ModalArg {
  type: string;
  name: string;
  id: string;
  child?: string[];
}
interface UserForm {
  id: string;
  title: string;
  confirmBtn: string;
  arg: ModalArg[];
  submit: Function;
  url: string;
  formEntype: string;
}
interface UserFormRow {
  _id?: string;
  username?: string;
}
$(document).ready(function() {
  // Place JavaScript code here...
  let userFormMsg = {
    id: "addUser",
    title: "新增用户",
    confirmBtn: "添加",
    url: "/controller/register",
    formEntype: "application/x-www-form-urlencoded",
    arg: [
      {type : "text", name: "用户名", id: "username" },
      {type : "text", name: "密码", id: "password" },
    ],
    submit: addUserReq
  };
  let editUserFormRow = {
    id: "editUser",
    title: "编辑用户",
    confirmBtn: "编辑",
    url: "/controller/updateUser",
    arg: [
      {type : "text", name: "id", id: "_id" },
      {type : "text", name: "用户名", id: "username" },
      {type : "text", name: "密码", id: "password" },
    ],
    formEntype: "application/x-www-form-urlencoded",
    submit: addUserReq
  };
  let editFileForm = {
      id: "editFile",
      title: "修改文章",
      confirmBtn: "编辑",
      url: "",
      formEntype: "multipart/form-data",
      arg: [
        {type : "text", name: "id", id: "_id" },
        {type : "text", name: "标题", id: "title" },
        {type : "text", name: "描述", id: "subtitle" },
        {type : "select", name: "分类", id: "language", child: ["java", "javascript", "mysql", "mongodb", "linux", "other"] },
        {type : "file", name: "上传文章", id: "modify-file" },
      ],
      submit: addUserReq
  };
  tableInit();
  tableFile();
  useModals(userFormMsg);
  useModals(editUserFormRow);
  useModals(editFileForm);


  /**
   * 修改文章 fileInput初始化
   */
  $("#modify-file").fileinput({
    language: "zh", // 设置语言
    uploadUrl: "/controller/uploadFile", // 上传的地址
    allowedFileExtensions : ["md"], // 接收的文件后缀
    showUpload: true, // 是否显示上传按钮
    showCaption: false, // 是否显示标题
    browseClass: "btn btn-primary", // 按钮样式
    previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
    uploadExtraData: () => {
        let data = {
            title: $("#myeditFile input[name='title']").val(),
            subtitle: $("#myeditFile input[name='subtitle']").val(),
            language: $("#myeditFile select option[selected]").val(),
            createTime: new Date()
        };
        return data;
    }
  });
});
let addUserReq = function() {
  console.log(123);
};
// bootstrap-table参数封装
let tableConfig = function (url: string, params: object, columns: object[], toolbarEl: string) {
  return {
    url: url,
    toolbarAlign: "left",
    columns: columns,
    queryParamsType: "limit",
    method: "get",
    showColumns: false, // 列显示隐藏操作按钮
    // clickToSelect: true, // 点击行选中
    cache: false, // 缓存
    showRefresh: true, // 显示刷新按钮
    pagination: true, // 分页
    striped: true, // 斑马纹
    height: "700px", // 高度
    pageNumber: 1,   // 初始化加载第一页
    sortable: true, // 排序
    sidePagination: "client",
    pageSize: "10",
    search: true,
    searchTimeOut: 600,
    showPaginationSwitch: true, // 是否关闭分页
    showToggle: true, // Set true to show the toggle button to toggle table / card view.
    showFullscreen: true, // 全屏按钮
    escape: true, // Escapes a string for insertion into HTML, replacing &, <, >, “, `, and ‘ characters.
    clickToSelect: true, // 选择的checkbox
    toolbar: toolbarEl,
    onLoadSuccess: function (res: any) {
      console.log(res, "加载成功");
    }
  };
};

let tableInit = function() {
    let url = "/controller/adminUserList";
    let params = {};
    let columns = [
      {
        checkbox: true,
      }, {
        field: "_id",
        title: "id",
        align: "center"
      }, {
        field: "username",
        title: "用户名",
        align: "center"
      }, {
        title: "操作",
        align: "center",
        formatter: (value: any, row: any, index: number) => {
          return "<button  class='modifyUser btn-in-table btn btn-info btn-sm' data-toggle='modal' data-target='#editUser'>修改</button>  " +
          "<button  class='deleteUser btn-in-table btn btn-danger btn-sm'>删除</button>";
        },
        events: {
          "click .modifyUser": function(e: any, value: any, row: any, index: any) {
            console.log(row);
            let len = $("#editUser ").find("input").length as Number;
            for ( let k in row) {
              for (let i = 0; i < len; i++) {
                if (k == $("#editUser ").find("input").eq(i).attr("name")) {
                  $("#editUser ").find("input").eq(i).val(row[k]);
                }
              }
            }
          },
          "click .deleteUser": function(e: any, value: any, row: any, index: any) {
            console.log(row , index);
            $.get("/controller/deleteUser", {"id": row["_id"] }, function( data) {
                if (data.errorCode == 200) {
                  $("#userForm").find("tr").eq(index).remove();
                }
            });
          }
        }

      }
    ];
    $("#userForm").bootstrapTable(tableConfig(url, params, columns, ".addUser"));
};

let tableFile = function() {
  let url = "/controller/selectFile";
  let params = {};
  let columns = [
    {checkbox: true},
    {
      field: "_id",
      title: "id",
      align: "center"
    },
    {
      field: "title",
      title: "标题",
      align: "center"
    },
    {
      field: "subtitle",
      title: "描述",
      align: "center"
    },
    {
      field: "language",
      title: "分类",
      align: "center"
    },
    {
      field: "content",
      title: "内容",
      align: "center"
    },
    {
      title: "操作",
      align: "center",
      formatter: (value: any, row: any, index: number) => {
        return "<button  class='modifyFile btn-in-table btn btn-info btn-sm' data-toggle='modal' data-target='#editFile'>修改</button>  " +
        "<button  class='deleteFile btn-in-table btn btn-danger btn-sm'>删除</button>";
      },
      events: {
        "click .modifyFile": function(e: any, value: any, row: any, index: any) {
          let len = $("#editFile ").find("input").length as Number;
          for ( let k in row) {
            for (let i = 0; i < len; i++) {
              if (k == $("#editFile ").find("input").eq(i).attr("name")) {

                $("#editFile ").find("input").eq(i).val(row[k]);
              }
            }
          }
        },
        "click .deleteFile": function(e: any, value: any, row: any, index: any) {
          console.log(row , index);
          $.get("/controller/deleteFile", {"id": row["_id"] }, function( data) {
              if (data.errorCode == 200) {
                $("#fileForm").find("tr").eq(index).remove();
              }
          });
        }
      }
    }
  ];
  $("#fileForm").bootstrapTable(tableConfig(url, params, columns, ".addFile"));
  $(".addFile").on("click", function() {
    window.location.href = "/addFile?name=file";
  });

};

// bootstrap模态框简单封装
let useModals = function (arg: UserForm) {
    let str = "";
    arg.arg.map( (item, i) => {
      switch (item.type) {
        case "file":
            str += "<div class='form-group'><label for=" + item.id + " class='control-label'></label><input type='file' name='file' class='file' id=" + item.id + "></div>";
          break;
        case "text":
            if (item.name == "id") {
              str += "<div class='form-group'><label for=" + item.id + " class='control-label'>" + item.name + "</label><input type='text' readonly class='form-control' name=" + item.id + "></div>";

            } else {
              str += "<div class='form-group'><label for=" + item.id + " class='control-label'>" + item.name + "</label><input type='text' class='form-control' name=" + item.id + "></div>";
            }
          break;
        case "select":
            let op = "";
            item.child.map( result => {
                op += "<option>" + result + "</option>";
            });
            str += "<div class='form-group'><label for=" + item.id + " class='control-label'>" + item.name + "</label><select  class='form-control' id=" + item.id + "><option selected disabled>请选择<option> " + op + " </select></div>";
          break;
      }
    });
    let actionUrl ;

    if (arg.url != "") {
      actionUrl = " action=" + arg.url;
    } else {
      actionUrl = "";
    }
    let myModalLabel = "my" + arg.id;
    let modalsBody = " <div class='modal-body'><form enctype=" + arg.formEntype + " id=Form" + arg.id + actionUrl +  " method='POST'>" + str + "</form></div>";
    let footers = "<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>关闭</button>" +
    "<button type='button' class='btn btn-primary " + myModalLabel + " ' >" + arg.confirmBtn + "</button></div>";
    let box = "<div class='modal fade bs-example-modal-md' id=" + arg.id + " tabindex='-1' role='dialog' aria-labelledby=" + myModalLabel + "><div class='modal-dialog modal-md' role='document'>" +
    "<div class='modal-content'> <div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
    "<h4 class='modal-title' id=" + myModalLabel + ">" + arg.title + "</h4></div>" + modalsBody + footers +
    "</div></div>";

    $("body").append(box);
    $("." + myModalLabel).click(function() {
      arg.submit();
      $("#Form" + arg.id).submit();
    });
};


