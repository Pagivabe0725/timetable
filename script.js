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

function getCoordinates(element) {
  console.log(element);
  const id = element.split("-")[1];
  const row = Math.floor(id / 6) - 1;
  const column = (id % 6) - 1;

  return [row, column];
}


$(document).ready(function () {

  for (let i = 0; i < subjects.length; i++) {
    $("#ownSubjectContentDiv").append(
      `<div class='ownSubjectListElement'>${subjects[i]}</div>`
    );
  }


  $(".ownSubjectListElement").draggable({
    helper: "clone",
    cursor: "move",
    revert: "invalid",
    //snap: '.ownSubjectElement',
    start: function (_, ui) {
      ui.helper.css("width", "10%");
      ui.helper.css("height", "5%");
    },
  });

  for (let i = 0; i < 54; i++) {
    $("#ownTimetableDiv").append(
      `<div class=" ownSubjectElement border border-primary" id="element-${i}">${
        i % 6 === 0 && i > 0
          ? lessonTimes[i / 6 - 1]
          : i > 0 && i <= 5
          ? days[i - 1]
          : ""
      }</div>`
    );
  }

  for (let i = 7; i < 54; i++) {
    if (i % 6 !== 0) {
      let id = `#element-${i}`;
      $(id).droppable({
        drop: function (_, ui) {
          const coordinates = getCoordinates(id);
          console.log(timeTable[coordinates[0]][coordinates[1]]);
          if (timeTable[coordinates[0]][coordinates[1]] === "") {
            let originParent = ui.draggable.parent().attr("id");
            console.log(originParent);
            let clone =
              originParent === "ownSubjectContentDiv"
                ? ui.draggable.clone()
                : ui.draggable;
            $(clone).removeClass();
            $(clone).css("cursor", "pointer");
            $(clone).dblclick(function () {
              timeTable[coordinates[0]][coordinates[1]] = "";
              $(id).droppable("option", "disabled", false);
              $(this).remove();
            });
            clone.draggable({
              helper: "origin",
              cursor: "move",
              revert: "invalid",
              start: function (_, ui) {
                let parentId = ui.helper.parent().attr("id");
                if (parentId && parentId.includes("element")) {
                  parentsCoordinates = getCoordinates(parentId);
                  timeTable[parentsCoordinates[0]][parentsCoordinates[1]] = "";
                  $("#" + parentId).droppable("option", "disabled", false);
                }
              },
              stop: function (_, ui) {
                let parentId = ui.helper.parent().attr("id");
                if (parentId && parentId.includes("element")) {
                  parentsCoordinates = getCoordinates(parentId);
                  timeTable[parentsCoordinates[0]][parentsCoordinates[1]] =
                    clone.text();
                  $("#" + parentId).droppable({ disabled: true });
                }
              },
            });
            $(this).append(
              clone.css({
                position: "relative",
                top: 0,
                left: 0,
              })
            );
            timeTable[coordinates[0]][coordinates[1]] = clone.text();
            $(id).droppable({ disabled: true });

            console.log(timeTable);
          }
        },
      });
    }
  }
});
