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

function isEmptyArray() {
  let empty = true;
  timeTable.forEach((element) => {
    element.forEach((insideElement) => {
      if (insideElement !== "") {
        empty = false;
      }
    });
  });
  return empty;
}

function getCoordinates(element) {
  const id = element.split("-")[1];
  const row = Math.floor(id / 6) - 1;
  const column = (id % 6) - 1;

  return [row, column];
}

function createAlert(content, error) {
  let myAlert = document.createElement("div");
  myAlert.innerHTML = content;
  myAlert.classList.add("alert", "d-block", "w-50", "position-fixed", "mb-2");
  myAlert.classList.add(error ? "alert-danger" : "alert-success");
  return myAlert;
}

function showAlert(content, error) {
  const myAlert = createAlert(content, error);
  document.body.appendChild(myAlert);
  setTimeout(() => {
    document.body.removeChild(myAlert);
  }, 2000);
}

$(document).ready(function () {
  for (let i = 0; i < subjects.length; i++) {
    $("#ownSubjectContentDiv").append(
      `<div class='ownSubjectListElement'>${subjects[i]}</div>`
    );
  }

  $("#ownSaveButton").click(function () {
    if (!isEmptyArray()) {
      localStorage.setItem("timetable", JSON.stringify(timeTable));
    }
  });
  $("#ownDeleteButton").click(function () {
    localStorage.removeItem("timetable");
  });

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
      const id = `#element-${i}`;
      const coordinates = getCoordinates(id);
      $(id).droppable({
        drop: function (_, ui) {
          if (timeTable[coordinates[0]][coordinates[1]] === "") {
            const parentId = ui.draggable.parent().attr("id");
            const parentCoordinates = getCoordinates(parentId);
            let actualElement = parentId.includes("element")
              ? ui.draggable
              : ui.draggable.clone();
            actualElement.draggable({
              helper: "original",
              cursor: "move",
              revert: "invalid",
            });

            actualElement.removeClass();
            actualElement.css({ position: "relative", top: 0, left: 0 });
            if (parentId.includes("element")) {
              actualElement.draggable();
              timeTable[coordinates[0]][coordinates[1]] = actualElement.text();
              $(this).append(actualElement);
              $(this).droppable({ disabled: true });
              timeTable[parentCoordinates[0]][parentCoordinates[1]] = "";
              $("#" + parentId).droppable("option", "disabled", false);
            } else {
              timeTable[coordinates[0]][coordinates[1]] = actualElement.text();
              $(this).append(actualElement);
              $(this).droppable({ disabled: true });
            }
            showAlert("Sikeres hozzáadás", false);
          } else {
            showAlert("Sikertelen hozzáadás", true);
          }
        },
      });
    }
  }

  if (localStorage.getItem("timetable")) {
    timeTable = JSON.parse(localStorage.getItem("timetable"));
    for (let i = 7; i < 54; i++) {
      if (i % 6 !== 0) {
        const id = `#element-${i}`;
        const coordinates = getCoordinates(id);
        if (timeTable[coordinates[0]][coordinates[1]] !== "") {
          let actualElement = $("<div>").text(
            timeTable[coordinates[0]][coordinates[1]]
          );
          actualElement.css({ position: "relative", top: 0, left: 0 });
          actualElement.draggable({
            helper: "original",
            cursor: "move",
            revert: "invalid",
          });
          $(id).append(actualElement);
          $(id).droppable({ disabled: true });
        }
      }
    }
  }
});
