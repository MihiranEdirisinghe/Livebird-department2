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