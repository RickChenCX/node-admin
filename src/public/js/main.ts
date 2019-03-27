$(document).ready(function() {
  // Place JavaScript code here...
  let nav = new Nav();
  nav.navClick();
});

class Nav {
  constructor() {
  }
  navClick() {
    $("#tabList a").click(function (e) {
      e.preventDefault();
      $(this).tab("show");
    });
  }
}