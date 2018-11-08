FlowRouter.route("/", {
  name: "home",
  action: function() {
    BlazeLayout.render("MainLayout", { main: "Search" });
  }
});

FlowRouter.route("/article/add", {
  name: "article-add",
  action: function() {
    BlazeLayout.render("MainLayout", { main: "ArticleUpdate" });
  }
});

FlowRouter.route("/article/edit/:id", {
  name: "article-edit",
  action: function(params, queryParams) {
    BlazeLayout.render("MainLayout", { main: "ArticleUpdate" });
  }
});

FlowRouter.route("/article/:id", {
  name: "article",
  action: function(params, queryParams) {
    BlazeLayout.render("MainLayout", { main: "ArticlePage" });
  }
});

FlowRouter.route("/articles/:startIndex/:endIndex", {
  name: "articles",
  action: function(params, queryParams) {
    BlazeLayout.render("MainLayout", { main: "ArticlesPage" });
  }
});

FlowRouter.route("/corrections/:startIndex/:endIndex", {
  name: "corrections",
  action: function(params, queryParams) {
    BlazeLayout.render("MainLayout", { main: "ArticlesCorrectionsPage" });
  }
});

FlowRouter.route("/search/:searchFor", {
  name: "search",
  action: function(params, queryParams) {
    BlazeLayout.render("MainLayout", { main: "Search" });
  }
});

FlowRouter.route("/about", {
  name: "about",
  action() {
    BlazeLayout.render("MainLayout", { main: "About" });
  }
});

FlowRouter.route("/users", {
  name: "users",
  action: function() {
    BlazeLayout.render("MainLayout", { main: "UsersList" });
    console.log("users list ");
  }
});

FlowRouter.route("/events/:startIndex/:endIndex", {
  name: "events",
  action: function(params, queryParams) {
    BlazeLayout.render("MainLayout", { main: "EventsPage" });
  }
});

FlowRouter.route("/subject/:subjectId", {
  name: "articlesBySubject",
  action: function(params, queryParams) {
    BlazeLayout.render("MainLayout", { main: "ArticlesBySubject" });
  }
});

FlowRouter.route("/morphologies", {
  name: "morphologies",
  action: function(params, queryParams) {
    BlazeLayout.render("MainLayout", { main: "MorphologyList" });
  }
});
