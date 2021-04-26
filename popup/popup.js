export { employee }
import { handleClientLoad, global } from '../background.js'
let employee = {};
let my_form = document.getElementById("my_form");
let raido = document.getElementsByName("session");
let select_option = document.getElementById("maneger").value;

let spreadsheetId = '1KJABE6ZF-0N02lYt2NgD7YRJwer6QB7tNvQZp21Ys6Y';
let range = 'members';
let valueInputOption = 'RAW';

my_form.addEventListener('submit', (event) => {
    employee = {
        name: my_form[0].value,
        day_off: my_form[1].value,
        session: my_form[5].value,
        reason: my_form[6].value,
        maneger: select_option
    }
    alert("name : " + employee.name + "\n" + "Day Off : " + employee.day_off + "\n" +
        "Session : " + employee.session + "\n" + "reason : " + employee.reason + "\n" +
        "maneger :" + employee.maneger + "\n" + global + "");
    // if (confirm("Successfully" + "\n" + "Do you want exit")) {
    //     window.close();
    // };
    chrome.runtime.sendMessage(employee, function(response) {
        console.log('response', response);
    });

});


function getRadioValue() {
    let radio_checked;
    for (let i = 0; i < raido.length; i++) {
        if (raido[i].checked) {
            switch (i) {
                case 0:
                    radio_checked = "morning"
                    break;
                case 1:
                    radio_checked = "afternoon"
                    break;
                default:
                    radio_checked = "full day"
            }
            break;
        }
    }
    return radio_checked;
};