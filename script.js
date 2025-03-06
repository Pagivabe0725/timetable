/**
 * @description Represents a timetable as an 8x5 two-dimensional array.
 * Each `row` corresponds to a time slot .
 * Each `column` represents a day of the week (Monday to Friday).
 * Initially, all values are empty strings.
 *
 * @constant {string[][]} timeTable - A two-dimensional array storing subjects .
 */

let timeTable = [];
for (let i = 0; i < 8; i++) {
  timeTable.push(["", "", "", "", ""]);
}

/**
 * @description A list of school subjects available for scheduling.
 * Each item in the array represents a distinct subject that can be assigned to a timetable slot.
 *
 * @constant {string[]} subjects - An array of subject names.
 */

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

/**
 * @description An array representing the weekdays in a school schedule.
 * Each item corresponds to a school day from Monday to Friday.
 *
 * @constant {string[]} days - An array of weekdays used in the timetable.
 */
const days = ["Hérfő", "Kedd", "szerda", "Csütörtök", "Péntek"];

/**
 * @description A list of lesson time slots used in the school timetable.
 * Each item represents the start and end time of a lesson period.
 *
 * @constant {string[]} lessonTimes - An array of lesson time intervals.
 */
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

/**
 * @description Checks if the `timeTable` array is completely empty.
 * Iterates through all elements and returns `true` if all cells are empty strings.
 *
 * @function
 * @returns {boolean} `true` if the timetable is empty, otherwise `false`.
 */

function getCoordinates(element) {
  const id = element.split("-")[1];
  const row = Math.floor(id / 6) - 1;
  const column = (id % 6) - 1;

  return [row, column];
}

/**
 * @description Creates a Bootstrap-style alert element.
 *
 * @function
 * @param {string} content - The message to be displayed inside the alert.
 * @param {boolean} error - If `true`, creates an error alert (`alert-danger`); otherwise, a success alert (`alert-success`).
 * @returns {HTMLDivElement} A `div` element styled as an alert.
 */

function createAlert(content, error) {
  let myAlert = document.createElement("div");
  myAlert.innerHTML = content;
  myAlert.classList.add("alert", "d-block", "w-50", "position-fixed", "mb-2");
  myAlert.classList.add(error ? "alert-danger" : "alert-success");
  return myAlert;
}

/**
 * @description Displays a temporary Bootstrap-style alert on the screen.
 * The alert disappears automatically after 2 seconds.
 *
 * @function
 * @param {string} content - The message to be displayed inside the alert.
 * @param {boolean} error - If `true`, the alert is styled as an error (`alert-danger`); otherwise, as a success (`alert-success`).
 * @returns {void} This function does not return anything.
 */

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
      $("#ownSaveDialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
          Mentem: function () {
            localStorage.setItem("timetable", JSON.stringify(timeTable));
            showAlert("Sikeres mentés", false);
            $(this).dialog("close");
          },
        },
      });

      $("#ownSaveDialog").dialog("open");
    } else {
      showAlert("Nincs mit elmenteni!", true);
    }
  });

  $("#ownDeleteButton").click(function () {
    if (localStorage.getItem("timetable")) {
      $("#ownDeleteDialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
          Törlöm: function () {
            localStorage.removeItem("timetable");

            showAlert("Sikeres Törlés", false);
            $(this).dialog("close");
          },
        },
      });

      $("#ownDeleteDialog").dialog("open");
    } else {
      showAlert("Nincs mentett órarended!", true);
    }
  });

  $(".ownSubjectListElement").draggable({
    helper: "clone",
    cursor: "move",
    revert: "invalid",
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

            $(actualElement).dblclick(function () {
              timeTable[coordinates[0]][coordinates[1]] = "";
              $(id).droppable("option", "disabled", false);
              $(this).remove();
              showAlert("Sikeresen törölted az elemet", false);
            });

            actualElement.removeClass();
            actualElement.css({
              position: "relative",
              top: 0,
              left: 0,
              cursor: "pointer",
            });
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
          actualElement.css({
            position: "relative",
            top: 0,
            left: 0,
            cursor: "pointer",
          });
          actualElement.draggable({
            helper: "original",
            cursor: "move",
            revert: "invalid",
          });
          $(actualElement).dblclick(function () {
            timeTable[coordinates[0]][coordinates[1]] = "";
            $(id).droppable("option", "disabled", false);
            $(this).remove();
            showAlert("Sikeresen törölted az elemet", false);
          });
          $(id).append(actualElement);
          $(id).droppable({ disabled: true });
        }
      }
    }
  }
});
