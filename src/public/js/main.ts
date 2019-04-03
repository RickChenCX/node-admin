

$(document).ready(function() {
  // Place JavaScript code here...
  tableInit();
});


let tableConfig = function (url: string, params: object, columns: object[]) {
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
      }, {
        field: "username",
        title: "用户名",
      }, {
        title: "操作",
        formatter: (value: any, row: any, index: number) => {
          return "<a href='javascript:;' class='modify btn-in-table'>修改</a>";
        }

      }
    ];
    $("#userForm").bootstrapTable(tableConfig(url, params, columns));
};