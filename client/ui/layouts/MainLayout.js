Template.MainLayout.onRendered(function() {
  Tracker.autorun(() => {
    document.title = FlowRouter.getRouteName();
    //console.log('Template.MainLayout.onRendered', this)
  });
});