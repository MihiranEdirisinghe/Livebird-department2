const API_URL = "https://script.google.com/macros/s/AKfycbxmcNomsgsRhz_akI6RlmWGHnDMc2AudiMcri566pKC3cUUtRUPupy2lBbiKRWhI9c/exec"

async function sendRequest(payload) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Server connection failed");
    }

    return await response.json();
}


async function loginRequest(username, password) {
    return await sendRequest({
        action: "login",
        username: username,
        password: password
    });
}


async function getDashboardLists() {
    return await sendRequest({
        action: "getDashboardLists"
    });
}


async function saveCatchingRecord(record) {
    return await sendRequest({
        action: "saveCatchingRecord",
        record: record
    });
}
async function getBirdConditionLists() {
    return await sendRequest({
        action: "getBirdConditionLists"
    });
}

async function saveBirdConditionRecord(record) {
    return await sendRequest({
        action: "saveBirdConditionRecord",
        record: record
    });
}
async function getOperationsReportData() {
    return await sendRequest({
        action: "getOperationsReportData"
    });
}
async function getBirdConditionReportData() {
    return await sendRequest({
        action: "getBirdConditionReportData"
    });
}
async function addFarmer(type, name) {
    return await sendRequest({
        action: "addFarmer",
        type: type,
        name: name
    });
}

async function addCustomer(name) {
    return await sendRequest({
        action: "addCustomer",
        name: name
    });
}
async function getUser2DashboardLists() {
    return await sendRequest({
        action: "getUser2DashboardLists"
    });
}

async function saveUser2DailyEntry(payload) {
    return await sendRequest({
        action: "saveUser2DailyEntry",
        payload: payload
    });
}
async function getVehicleExpenseLists() {
    return await sendRequest({
        action: "getVehicleExpenseLists"
    });
}

async function saveVehicleExpense(record) {
    return await sendRequest({
        action: "saveVehicleExpense",
        record: record
    });
}
async function getPlantDailyReportData() {
    return await sendRequest({
        action: "getPlantDailyReportData"
    });
}
async function getVehicleExpensesReportData() {
    return await sendRequest({
        action: "getVehicleExpensesReportData"
    });
}
async function addUser2MasterItem(type, value) {

    return await sendRequest({

        action: "addUser2MasterItem",

        type: type,

        value: value

    });

}
async function saveUser3CatchingPlan(rows) {

    return await sendRequest({

        action: "saveUser3CatchingPlan",

        rows: rows

    });

}
async function getUser3ReportData() {

    return await sendRequest({

        action: "getUser3ReportData"

    });

}