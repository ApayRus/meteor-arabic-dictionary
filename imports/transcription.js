export function transcription(text){

    var a = new Array(); //алфавит


    a["ا"] = "";
    a["إ"] = "\'";
    a["أ"] = "\'";
    a["ؤ"] = "\'";
    a["ئ"] = "\'";
    a["ء"] = "\'";
    a["آ"] = "\'аа"
    a["ب"] = "б";
    a["ت"] = "т";
    a["ة"] = "т";
    a["ث"] = "с̱";
    a["ج"] = "ж̣";
    a["ح"] = "х̣";
    a["خ"] = "х̮";
    a["د"] = "д";
    a["ذ"] = "з̱";
    a["ر"] = "р";
    a["ز"] = "з";
    a["س"] = "с";
    a["ش"] = "ш";
    a["ص"] = "с̣";
    a["ض"] = "д̣";
    a["ط"] = "т̣";
    a["ظ"] = "з̣";
    a["ع"] = "ʿ";
    a["غ"] = "г̣";
    a["ف"] = "ф";
    a["ق"] = "к̣";
    a["ك"] = "к";
    a["ل"] = "л";
    a["م"] = "м";
    a["ن"] = "н";
    a["ه"] = "h";
    a["ي"] = "й";
    a["و"] = "в̮";
    a["َ"] = "а";
    a["ِ"] = "и";	
    a["ُ"] = "у";
    a["ْ"] = "";	
    a["ٌ"] = "ун";
    a["ً"] = "ан";	
    a["ٍ"] = "ин";
    a[" "] = " ";	
    a["ى"] = "";
    a["ّ"] = "";
    a["ـ"] = "";
    a["ـ"] = "";

    var fatha="َ";
    var kasra="ِ";
    var damma="ُ";
    var sukun="ْ";
    var tashdid="ّ";
/*    var tanwin_damma="ٌ"
    var tanwin_kasra="ٍ"
    var tanwin_fatha="ً"*/

    let letters = text.split("");
    let result = "";

    for (let i = 0; i<letters.length; i++) {
        if(letters[i] == tashdid) 
            result += a[letters[i-1]];

        if(
            (i > 0) && 
            ( // alif like symbols
              letters[i]=="ا"||
              letters[i]=="ٰ"||
              letters[i]=="ى"||
              letters[i]=="ٰ"
            ) && 
            letters[i-1]==fatha && 
            isNotDiacritic(letters[i+1])
        )
            result += "а";
            
        else if (
            i > 0 && 
            letters[i]=="ي" && 
            letters[i-1]==kasra && 
            isNotDiacritic(letters[i+1])
            )
            result += "и";
            
        else if (
            i > 0 && 
            letters[i]=="و" && 
            letters[i-1]==damma && 
            isNotDiacritic(letters[i+1])
        )
            result += "у";
        
        else if ((i > 0)&&(letters[i]=="ل")&&((letters[i-1]=="أ")||(letters[i-1]=="ا"))&(letters[i+2]=="ّ")&&((letters[i+1]!= fatha)||(letters[i+1]!= kasra)||(letters[i+1]!= damma)||(letters[i+1]!= sukun)))
        {}
            
        else 
            result += a[letters[i]];
    }

    result = result.replace(/аа/g, "а̄");
    result = result.replace(/ии/g, "ӣ");
    result = result.replace(/уу/g, "ӯ");
        
    return result||""
}

export function isNotDiacritic(letter){

    var diacritics = [ "َ", "ِ", "ُ", "ْ", "ّ", "ٌ", "ٍ", "ً" ]
    return diacritics.indexOf(letter) < 0
}