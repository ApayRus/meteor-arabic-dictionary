FlowRouter.route('/', {
    name: "home", 
    action: function() {
        BlazeLayout.render('MainLayout', { main: "Search" });
    }
});

FlowRouter.route('/articles/add', {
    name: "article-add", 
    action: function() {
        BlazeLayout.render('MainLayout', { main: "ArticleUpdate" });
    }
});

FlowRouter.route('/articles/edit/:id', {
    name: "article-edit", 
    action: function(params, queryParams) {
        BlazeLayout.render('MainLayout', { main: "ArticleUpdate" });
    }
});

FlowRouter.route('/articles/:id', {
    name: "articles", 
    action: function(params, queryParams) {
        BlazeLayout.render('MainLayout', { main: "ArticlePage"});
    }
});

FlowRouter.route('/search/:searchFor', {
    name: "search", 
    action: function(params, queryParams) {
        BlazeLayout.render('MainLayout', { main: "Search"});
    }
});

FlowRouter.route('/users', {
    name: "users", 
    action: function() {
        BlazeLayout.render('MainLayout', { main: "UsersList"});
        console.log("users list ")
    }
});