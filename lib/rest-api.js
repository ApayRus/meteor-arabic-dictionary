import { Articles } from "/imports/api/articles.js";
import { arabicWordToRegExPattern } from "/imports/regexPatterns";

if (Meteor.isServer) {
  // Global API configuration
  var Api = new Restivus({
    useDefaultAuth: false,
    prettyJson: true
  });
  // Maps to: /api/articles/:id
  Api.addRoute(
    "article/:id",
    { authRequired: false },
    {
      get: function() {
        return Articles.findOne(this.urlParams.id, {
          fields: { words: 1, translations: 1 }
        });
      }
    }
  );
  Api.addRoute(
    "search/:searchFor",
    { authRequired: false },
    {
      get: function() {
        let searchFor = arabicWordToRegExPattern(this.urlParams.searchFor);
        return Articles.find(
          {
            "words.word": searchFor,
            deleted: { $ne: true },
            published: { $ne: false }
          },
          { fields: { words: 1, translations: 1 } }
        ).fetch();
      }
    }
  );
}
