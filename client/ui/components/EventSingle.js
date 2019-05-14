import moment from "moment";

Template.EventSingle.helpers({
  date() {
    return moment(this.happenedAt).format("DD.MM.YYYY, HH:mm");
  }
});
