var global;
let spreadsheetId = '1KJABE6ZF-0N02lYt2NgD7YRJwer6QB7tNvQZp21Ys6Y';
import { employee } from './popup/popup.js'
export { handleClientLoad, global }
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
});

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
    console.log("succsessully");
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    console.log(sender);
    handleClientLoad();
    sendResponse({ success: true });
});

function initClient() {
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
            appendToSheets();
            // console.log("user : " + gapi.client.value)
            // gapi.client.sheets.spreadsheets.values.get({
            //     spreadsheetId: spreadsheetId,
            //     range: "managers"
            // }).then(function(response) {
            //     console.log(response.result.values)
            //     console.log(`Got ${response.result.values.length} rows back`)
            // });

        })
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

function appendToSheets() {
    const body = {
        values: [
            [
                // employee.name,
                // global,
                // employee.day_off,
                // employee.session,
                // employee.manager,
                // employee.reason
                "hehe", "hhohoh"
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

function appendValues() {
    let spreadsheetId = '1KJABE6ZF-0N02lYt2NgD7YRJwer6QB7tNvQZp21Ys6Y';
    let range = 'members';
    let valueInputOption = 'RAW';
    handleClientLoad();
    console.log("test");
    var values = [
        [
            "kdsaksa", "jasdaks"
        ],
    ];
    var body = {
        values: values
    };
    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: valueInputOption,
        resource: body
    }).then((response) => {
        var result = response.result;
        console.log(`${result.updates.updatedCells} cells appended.`)
        callback(response);
    });
}