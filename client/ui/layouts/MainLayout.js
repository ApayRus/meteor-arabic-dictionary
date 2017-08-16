Template.MainLayout.onRendered(function() {
  Tracker.autorun(() => {
    document.title = FlowRouter.getRouteName();
  });
});