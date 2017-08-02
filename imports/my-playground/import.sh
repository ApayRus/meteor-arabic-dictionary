mongoimport --host localhost --port 3001 --db meteor --collection articles --upsert --file imports/my-playground/articles-my.json

mongoexport --host localhost --port 3001 --db meteor --collection articles --out articles.json
