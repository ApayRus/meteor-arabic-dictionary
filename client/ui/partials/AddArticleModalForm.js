Template.AddArticleModalForm.helpers({
  article() {
    const emptyArticle = {};
    emptyArticle.words = [{ note: "", word: "" }];
    emptyArticle.translations = [{ translation: "" }];
    emptyArticle.roots = [];
    emptyArticle.synonyms = [];
    emptyArticle.subjects = [];
    return emptyArticle;
  }
});
