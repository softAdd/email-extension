document.addEventListener("DOMContentLoaded", listenPrefix);

async function listenPrefix() {
    const selectPrefix = document.querySelector('#select-prefix');
    const prefixValue = await recieveData('prefix');

    if (prefixValue !== undefined) {
        selectPrefix.value = prefixValue;
    }

    selectPrefix.addEventListener('keyup', async function() {
        await storeData({ 'prefix': selectPrefix.value.toString() }, messageToUpdateMenus);
    });
}

function storeData(dataSet = {}, callback = () => {}) {
    return new Promise(resolve => {
        chrome.storage.sync.set(dataSet, function() {
            callback();
            resolve();
        });
    });
}

function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function(result) {
            resolve(result[propName]);
        });
    });
}

function messageToUpdateMenus() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, { createMenus: true });
    });
}