import { handleClientLoad } from '../background.js'
export let employee = {};
let hour_start, hour_end;

form_popup.addEventListener('submit', (event) => {
  let form_popup = document.getElementById("form_popup");
  let raido_catagory = document.querySelector('input[name="category"]:checked').value;
  let select_option = document.getElementById("manager");
  let check_form = $("#form_popup").valid();
  formatHours(raido_catagory);
  if (check_form) {
    let date_end;
    if (form_popup[7].value == "") {
      date_end = hour_end + " " + formatDate(form_popup[6].value);
      console.log(date_end)
    } else {
      date_end = hour_end + " " + formatDate(form_popup[7].value);
      console.log(date_end)
    }
    employee = {
      name: form_popup[0].value,
      email: form_popup[1].value,
      day_start: hour_start +" " + formatDate(form_popup[6].value),
      day_end: date_end,
      category: raido_catagory,
      reason: form_popup[9].value,
      manager: select_option.options[select_option.selectedIndex].value
    }
    alert("name : " + employee.name + "\n" + "Day start : " + employee.day_start + "\n" +
      "date_end : " + employee.day_end + "\n" + "Catagory : " + employee.category + "\n" +
      "manager :" + employee.manager + "\n" + employee.email + "\nreason :" + employee.reason);
    // handleClientLoad();
    console.log("vo dc ko")
    Promise.resolve(handleClientLoad)
      .then(event.preventDefault())
      .then(function () {
        // if (confirm("Successfully" + "\n" + "Do you want exit")) {
        //   window.close();
        //}
    })
    handleClientLoad('write_to_sheet');
    event.preventDefault();
  
  } else {
    event.preventDefault();
  }

});

function formatHours(catagory) {
  switch (catagory) {
    case 'morning':
      hour_start = '08:00';
      hour_end = '12:00';
      break;
    case 'afternoon':
      hour_start = '13:00';
      hour_end = '17:00';
      break;
    case 'full_day':
      hour_start = '08:00';
      hour_end = '17:00';
      break;
    default:
      hour_start = employee.day_start.split("T")[1];
      hour_end = employee.day_end.split("T")[1];
  }
}
function formatDate(date_off) {
  let temple_date = date_off.split("T", 1);
  let date = new Date(temple_date);
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  let month = date.getMonth();
  if (month < 10) {
    month = "0" + month;
  }
  let year = date.getFullYear();
  return day + "/" + month + "/" + year;
}
