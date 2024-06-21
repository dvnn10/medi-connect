// Define a variable to store the selected date
var selectedDate = null;

// Function to generate a range of years
function generate_year_range(start, end) {
  var years = "";
  for (var year = start; year <= end; year++) {
    years += "<option value='" + year + "'>" + year + "</option>";
  }
  return years;
}

today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

createYear = generate_year_range(1970, 2050);

document.getElementById("year").innerHTML = createYear;

var calendar = document.getElementById("calendar");
var lang = calendar.getAttribute("data-lang");

var months = "";
var days = "";

var monthDefault = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

var dayDefault = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

if (lang == "en") {
  months = monthDefault;
  days = dayDefault;
}

var $dataHead = "<tr>";
for (dhead in days) {
  $dataHead += "<th data-days='" + days[dhead] + "'>" + days[dhead] + "</th>";
}
$dataHead += "</tr>";

document.getElementById("thead-month").innerHTML = $dataHead;

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

function next() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}

function previous() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}

function jump() {
  currentYear = parseInt(selectYear.value);
  currentMonth = parseInt(selectMonth.value);
  showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {
  var firstDay = new Date(year, month).getDay();

  tbl = document.getElementById("calendar-body");

  tbl.innerHTML = "";

  monthAndYear.innerHTML = months[month] + " " + year;
  selectYear.value = year;
  selectMonth.value = month;

  var date = 1;
  for (var i = 0; i < 6; i++) {
    var row = document.createElement("tr");

    for (var j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cell = document.createElement("td");
        cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > daysInMonth(month, year)) {
        break;
      } else {
        cell = document.createElement("td");
        cell.setAttribute("data-date", date);
        cell.setAttribute("data-month", month + 1);
        cell.setAttribute("data-year", year);
        cell.setAttribute("data-month_name", months[month]);
        cell.className = "date-picker";
        cell.innerHTML = "<span>" + date + "</span>";

        if (
          (year === today.getFullYear() &&
            month === today.getMonth() &&
            date < today.getDate()) ||
          year < today.getFullYear() ||
          (year === today.getFullYear() && month < today.getMonth())
        ) {
          cell.classList.add("disabled");
        }

        row.appendChild(cell);
        date++;
      }
    }

    tbl.appendChild(row);
  }

  // Add click event listeners to each date cell
  var dateCells = document.querySelectorAll(".date-picker:not(.disabled)");
  dateCells.forEach(function (cell) {
    cell.addEventListener("click", function () {
      // Remove any previously selected date
      var selectedCell = document.querySelector(".selected");
      if (selectedCell) {
        selectedCell.classList.remove("selected");
      }

      // Set the selected date to the clicked date cell
      selectedDate = new Date(
        year,
        month,
        parseInt(cell.getAttribute("data-date")),
      );
      cell.classList.add("selected");
    });
  });
}

function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}

// Function to handle the booking process when the "Book" button is clicked
function bookAppointment() {
  if (selectedDate === null) {
    alert("Please select a date before booking.");
    return;
  }

  // Get the selected hospital
  var hospital = document.getElementById("hospital").value;

  // Get the selected slot
  var selectedSlot = document.querySelector(
    'input[name="exampleRadios"]:checked',
  );
  if (selectedSlot === null) {
    alert("Please select a slot before booking.");
    return;
  }
  var selectedSlotValue = selectedSlot.value;

  // Now you can proceed to book the appointment using the selectedDate, hospital, and selectedSlotValue
  // You can send this data to your backend for further processing (e.g., saving to the database)

  // Example: AJAX request to send appointment data to the server
  /*
  fetch('/book-appointment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      date: selectedDate,
      hospital: hospital,
      slot: selectedSlotValue
    })
  })
  .then(response => response.json())
  .then(data => {
    // Handle response from the server
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  */

  // For demonstration, let's just display the selected date, hospital, and slot in the console
  console.log("Selected Date:", selectedDate);
  console.log("Selected Hospital:", hospital);
  console.log("Selected Slot:", selectedSlotValue);

  // You can also redirect the user to a confirmation page or show a success message here
}
