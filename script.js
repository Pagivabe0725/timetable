let timeTable = [];
for (let i = 0; i < 8; i++) {
  timeTable.push(["", "", "", "", ""]);
}

const subjects = [
  "Matematika",
  "Magyar nyelv és irodalom",
  "Történelem",
  "Fizika",
  "Kémia",
  "Biológia",
  "Földrajz",
  "Informatika",
  "Angol nyelv",
  "Német nyelv",
  "Testnevelés",
  "Ének-zene",
  "Rajz és vizuális kultúra",
  "Technika és életvitel",
  "Etika",
  "Filozófia",
  "Dráma és színház",
  "Gazdasági ismeretek",
  "Művészettörténet",
  "Digitális kultúra",
  
];

const days = ["Hérfő", "Kedd", "szerda", "Csütörtök", "Péntek"];

const lessonTimes = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
];

$(document).ready(function () {
  for (let i = 0; i < subjects.length; i++) {
    $("#ownSubjectContentDiv").append(
      `<div class='ownSubjectListElement'>${subjects[i]}</div>`
    );
  }
});
