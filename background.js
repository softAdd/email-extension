window.onload = async function () {
    await setDefaults();
}

async function setDefaults() {
    chrome.tabs.onActivated.addListener(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabsArray) {
            let tab = tabsArray[0];
            chrome.tabs.executeScript(tab.id, { file: './active.js' });
        });
    });

    chrome.runtime.onMessage.addListener(async function (request) {
        if (request.createMenus) {
            await updateAllMenus();
        }
    });
}

async function removeAllMenus() {
    await chrome.contextMenus.removeAll();
}

async function updateAllMenus() {
    await removeAllMenus();
    const currentText = await recieveData('currentText');

    const mainContext = {
        id: 'MAIN_ITEM',
        title: currentText || 'username@domain.ru',
        contexts: ['all']
    }
    chrome.contextMenus.create(mainContext);
    chrome.contextMenus.onClicked.removeListener(callInsert);
    chrome.contextMenus.onClicked.addListener(callInsert);
}

function callInsert(info) {
    if (info.menuItemId === 'MAIN_ITEM') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabsArray) {
            let tab = tabsArray[0];
            chrome.tabs.executeScript(tab.id, { file: './insert_text.js' });
        });
    }
}














































function storeData(dataSet = {}, callback = () => { }) {
    return new Promise(resolve => {
        chrome.storage.sync.set(dataSet, function () {
            callback();
            resolve();
        });
    });
}

function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function (result) {
            resolve(result[propName]);
        });
    });
}