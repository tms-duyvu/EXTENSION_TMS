var global;
let spreadsheetId = '1KJABE6ZF-0N02lYt2NgD7YRJwer6QB7tNvQZp21Ys6Y';
import { employee } from './popup/popup.js'
var arr_manager = [];
var name_manager = {};
chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    let init = {
        method: 'GET',
        async: true,
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        'contentType': 'json'
    };
    fetch(
            'https://www.googleapis.com/gmail/v1/users/me/profile?',
            init)
        .then((response) => response.json())
        .then(function(data) {
            console.log(data);
            console.log(data.emailAddress);
            global = data.emailAddress;
        });
    // Promise.resolve(handleClientLoad('get_data_to_sheet'))
    //     .then(addOptionElementToHTML).catch(err => {
    //         throw err
    //     })

    // addOptionElementToHTML();
    handleClientLoad('get_data_to_sheet');
});

function handleClientLoad(option) {
    switch (option) {
        case 'write_to_sheet':
            gapi.load('client:auth2', initClienForReadAndWrite(appendToSheets));
            break;
        default:
            gapi.load('client:auth2', initClienForReadAndWrite(getDataFromSheet));
    }
}


function initClienForReadAndWrite(callback) {
    var CLIENT_ID = '947005021816-8dpsbm6icimgo5qujl3ihh92q8jbn11n.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyCnOUhyWNSAASHKevvFltlLlZwnx7O31Jo';
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

function appendToSheets() {
    const body = {
        values: [
            [
                employee.name,
                global,
                employee.day_off,
                employee.session,
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
}

function getDataFromSheet() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "managers"
    }).then(function(response) {
        console.log(response.result.values)
        console.log(typeof(response.result.values))
        for (var i = 0; i < response.result.values.length; i++) {
            arr_manager.push(response.result.values[i][0]);
            arr_manager.push[name_manager];
        }
        console.log(`Got ${response.result.values.length} rows back`)
            // for (let i = 0; i < arr_manager.length; i++) {
            //     console.log(arr_manager[i])
            // }
        addOptionElementToHTML();
    });

}

function addOptionElementToHTML() {
    console.log("html")
    for (let i = 0; i < arr_manager.length; i++) {
        console.log(arr_manager[i])
        let option_tag = document.createElement("OPTION");
        let value = document.createTextNode(arr_manager[i]);
        option_tag.appendChild(value);
        document.getElementById("maneger").appendChild(option_tag);
    }

}

export { handleClientLoad, global }