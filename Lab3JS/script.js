
(function () {
  var names = ["Bill", "John", "Jen", "Jason", "Paul", "Frank", "Steven", "Larry", "Paula", "Laura", "Jim"];

 
  console.log("--- Основний функціонал (Перевірка на 'J') ---");
  for (var i = 0; i < names.length; i++) {
    
    var firstLetter = names[i].charAt(0).toLowerCase();

    if (firstLetter === 'j') {
      byeSpeaker.speak(names[i]);
    } else {
      helloSpeaker.speak(names[i]);
    }
  }


  console.log("\n--- Додатковий функціонал (Сума ASCII-кодів літер) ---");
  console.log("Анотація: Якщо сума ASCII-кодів усіх літер імені більше 400 -> Hello, інакше -> Good Bye");
  
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    var asciiSum = 0;

    for (var j = 0; j < name.length; j++) {
      asciiSum += name.charCodeAt(j);
    }

    if (asciiSum > 400) {
      console.log("Сума ASCII для " + name + " = " + asciiSum + " (> 400). Тому: Hello " + name);
    } else {
      console.log("Сума ASCII для " + name + " = " + asciiSum + " (<= 400). Тому: Good Bye " + name);
    }
  }
})();