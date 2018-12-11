//scenario is like so:
// 1) Split examples from translations (then hand control)
// 2) Replace ~ "tilda" (then hand control)
// 3) Commit to dictionary

// 1) отделяем переводы друг от друга, и примеры от переводов
export function preformatArticle1(text) {
  translations0 = text.split(/\d+\s*?\)|\d+\./g); //raw array with translations: begins with 1) or 1.
  var exampleBeginning = /;([\s]*[!?*~)(.\s…]*[\u0621-\u064A])/gi; //\u0621-\u064A - arabic symbols
  var preformatedText = translations0.map((elem, index) => {
    return elem.trim().replace(exampleBeginning, ";\n$1");
  });
  return preformatedText.join("\n\n").trim();
}

//2) отделяем примеры от их переводов, переставляем тильду и знаки препинания
export function preformatArticle2(text, word) {
  var word = word.replace(/[ًٌٍٍَُِّْ]/gi, ""); //removes all diacritics
  var translationsArray = text.split("\n\n");
  var translationAndExamplesText = translationsArray
    .map(elem => {
      var translationAndExamples = elem.split("\n");
      // var translation = translationAndExamples[0];
      var examples = translationAndExamples.map(exAndTr => {
        var trBeginIndex = exAndTr.search(/\(?[\u0400-\u04FF]/); //\u0400-\u04FF - cyrillic symbols

        var example = exAndTr.substring(0, trBeginIndex);

        //в исходной базе арабский и русский текст перемешаны,
        //и чтобы знаки препинания выглядели нормально, они стоят наоборот - в начале арабской фразы
        var punctMarksAtBeginingPattern = /^([!?*)(.;:"\s…]+)/; //вырезаем знаки препинания вначале строки
        var puncMarksBegining = getSymbols(example, punctMarksAtBeginingPattern);
        example = example.replace(punctMarksAtBeginingPattern, "");
        example = reverseAndReplaceTilda(example, word);
        example = `${example}${puncMarksBegining}`; //вставляем вырезанные знаки в конце
        var translation = exAndTr.substring(trBeginIndex).trim();
        return `${example.trim()} اا ${translation.trim()}`;
        // благодаря этим Алифам в конце арабского текста,
        // знаки пунктуации в конце example отображаются правильно
      });
      // examples.shift();
      examples[0] = examples[0].replace(" اا ", ""); // 0 element is translation, not example
      //console.log("examples", examples);
      return examples.join("\n");
    })
    .join("\n\n");
  return translationAndExamplesText;
}

//3) текст статьи превращаем в объект
export function preformatArticle3(text) {
  var translationsArray = text.split("\n\n");
  var translations = translationsArray.map(elem => {
    var translationAndExamples = elem.split("\n");
    // var translation = translationAndExamples[0];
    var examples = translationAndExamples.map(exAndTr => {
      exAndTrArray = exAndTr.split(" اا ");
      example = exAndTrArray[0];
      translation = exAndTrArray[1];
      return { example, translation };
    });

    var translation = examples.shift().example; //1-я строка блока - это перевод, мы вырезали её

    return { translation, examples };
  });

  return translations;
}

var example_translation = {
  translations: [
    {
      translation: "translation1",
      examples: [
        { example: "exmpl1", translation: "exmpl1-tr1" },
        { example: "exmpl2", translation: "exmpl2-tr1" }
      ]
    },
    {
      translation: "translation2",
      examples: [
        { example: "exmpl1", translation: "exmpl1-tr2" },
        { example: "exmpl2", translation: "exmpl2-tr2" }
      ]
    }
  ]
};

//в исходной базе словаря тильда стоит "зеркально",
//её надо переместить из начала в конец и наоборот и заменить основным словом статьи
function reverseAndReplaceTilda(str, word) {
  var tildaAtBeginingPattern = /^(\s*~\s*)/;
  var tildaAtEndPattern = /(\s*~\s*)$/;
  var tildaBegining = getSymbols(str, tildaAtBeginingPattern)
    .split("")
    .reverse()
    .join(""); //нашли и отобразили зеркально
  var tildaEnd = getSymbols(str, tildaAtEndPattern)
    .split("")
    .reverse()
    .join("");
  var outputText = str.replace(tildaAtBeginingPattern, "").replace(tildaAtEndPattern, "");
  outputText = `${tildaEnd}${outputText}${tildaBegining}`;
  outputText = outputText.replace(/~/g, word).replace(/ـ+?/g, "");
  return outputText;
}

function getSymbols(text, regex) {
  const match = text.match(regex);
  // найденные символы надо зеркально переставить
  return match
    ? match[0]
        .split("")
        .reverse()
        .join("")
    : "";
}
