import { employee } from './popup/popup.js'
var email_current_user;
var spreadsheetId = '1KJABE6ZF-0N02lYt2NgD7YRJwer6QB7tNvQZp21Ys6Y';
var map_manager = new Map();
let hour_start, hour_end;
//Get current user by email
chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
  // console.log(formatDate('2021-04-30T13:00'));
  // console.log(formatHours('morning'))
  let init = {
    method: 'GET',
    async: true,
    headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    },
    'contentType': 'json'
  };
  fetch('https://www.googleapis.com/gmail/v1/users/me/profile?',init)
    .then((response) => response.json())
    .then(function(data) {
      console.log(data);
      console.log(data.emailAddress);
      email_current_user = data.emailAddress;
    });
  // Promise.resolve(handleClientLoad('get_data_to_sheet'))
  //     .then(addOptionElementToHTML).catch(err => {
  //         throw err
  //     })
  // addOptionElementToHTML();
  // let date = dayjs('2019-01-25').format('DD/MM/YYYY');
  handleClientLoad('get_data_to_sheet');
});

//handel load client with authencation
function handleClientLoad(option) {
  switch (option) {
    case 'write_to_sheet':
      gapi.load('client:auth2', initClienForReadAndWrite(appendToSheets));
      break;
    default:
      gapi.load('client:auth2', initClienForReadAndWrite(getDataFromSheet));
  }
}

//Innit client 
function initClienForReadAndWrite(callback) {
  var CLIENT_ID = '609257588307-df7fup2kjqlio9db8mosvm3smhhhj4rd.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyCcXIflSUbJMKnsa1ewQWNi-1OAZpfz-mc';
    var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
    }).then(function() {
        console.log(gapi.client)
        chrome.identity.getAuthToken({ interactive: true }, function(token) {
            gapi.auth.setToken({
                'access_token': token
            });
            callback();
        });
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}
//write data to spreadsheets
function appendToSheets() {
  const body = {
    values: [
      [
        employee.name,
        employee.email,
        employee.day_start,
        employee.day_end,
        employee.category,
        employee.manager,
        employee.reason
      ]
    ]
  };
    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: "members",
      valueInputOption: 'USER_ENTERED',
      resource: body
    }).then((response) => {
      console.log("a1")
      console.log(`${response.result.updates.updatedCells} cells appended.`)
    });
  sendMessageToSlack();
  sendEmail();
  alert("Submit Successfully!!")
}

//get data to spreadsheets
function getDataFromSheet() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: "managers"
  }).then(function(response) {
    console.log(response.result.values)
    console.log(typeof(response.result.values))
    for (let i = 1; i < response.result.values.length; i++) {
        map_manager.set(response.result.values[i][0], response.result.values[i][1])
    }
    console.log(map_manager);
    console.log(`Got ${response.result.values.length} rows back`)
    addOptionElementToHTML();
  });
}

//add element tag to popup.html
function addOptionElementToHTML() {
  console.log("html")
  let count = 0;
  for (let [key,value] of map_manager) {
    console.log(key)
    let option_tag = document.createElement("OPTION");
    option_tag.setAttribute("value", key);
    let value = document.createTextNode(key);
    if (count == 0) {
      option_tag.setAttribute("selected","selected");
    }
    count++;
    option_tag.appendChild(value);
    document.getElementById("manager").appendChild(option_tag);
  }
}
//Send message to slack
function sendMessageToSlack() {
  let urlWebHook = "https://hooks.slack.com/services/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";
  let nameSlack = map_manager.get(employee.manager).split('@')[0];
  const payload = {
    channels: [`@${nameSlack}`] ,
    username: employee.name,
    attachments: [
      {
        title: "Absent",
        text: "Day off: " + employee.day_start + "\n" + employee.name + "\n Reason : " + employee.reason,
        color: "#00FF00",
      },
    ],
  };
  console.log(payload)
  fetch(urlWebHook, {
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Server error ${res.status}`);
    }
    console.log(res.json);
    return res.json();
  }).catch((error) => {
    console.log(error);
  });
};
//handle email
function sendEmail() {
  console.log("vao email chua")
  Email.send({
    Host: "smtp.gmail.com",
    Username: "duc111c@gmail.com",
    Password: "twxdenjhkfzfrukz",
    To: "tt.vu.nguyen@tomosia.com",
    From: email_current_user,
    Subject: "Absent",
    Body: employee.reason,
  }).then(
    message => alert("mail sent successfully")
  );
};

export { handleClientLoad}
