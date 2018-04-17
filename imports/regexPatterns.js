export function arabicWordToRegExPattern(word) {
  const haracats = ["َ", "ِ", "ُ", "ً", "ٍ", "ٌ", "ْ"];
  const haracat = "[" + haracats.join("") + "]?";
  const tashdid = "[" + "ّ" + "]?";

  let regexp_template = word
    .split("")
    .map(function(letter, index) {
      //if next simbol or current is haracat we don't need to add [haracat] to regexp
      if (
        haracats.indexOf(word[index + 1]) > -1 ||
        haracats.indexOf(word[index]) > -1
      ) {
        return letterAlternatives(letter);
      } else
        //we add [haracat] only if after this letter going letter too
        return letterAlternatives(letter) + tashdid + haracat;
    })
    .join("");

  regexp_template = new RegExp("^" + regexp_template + "$");

  return regexp_template;
}

//some arabic letters may have alternatives, like alif ا : إ أ آ  and we should change it to group of alts
export function letterAlternatives(letter) {
  const alifs = ["ا", "أ", "إ", "آ", "ى"];
  const alif = "[" + alifs.join("") + "]";

  if (letter == "ا") return alif;
  else return letter;
}
