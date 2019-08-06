window.onload = async function () {
    let contextMenu = await recieveData('contextMenu');
    if (!Array.isArray(contextMenu)) {
        const contextMenu = {
            id: 'MAIN_ITEM',
            title: '@-insert',
            contexts: ['all']
        }
        await storeData({ 'contextMenu': [contextMenu] })
        chrome.contextMenus.create(contextMenu);
    }
    chrome.contextMenus.onClicked.addListener(insertText);

    chrome.tabs.onActivated.addListener(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabsArray) {
            let tab = tabsArray[0];
            chrome.tabs.executeScript(tab.id, { file: './active.js' });
        });
    });
}

function insertText() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabsArray) {
        let tab = tabsArray[0];
        chrome.tabs.executeScript(tab.id, { file: './insert_text.js' });
    });
}

function storeData(dataSet = {}, callback = () => {}) {
    return new Promise(resolve => {
        chrome.storage.sync.set(dataSet, function() {
            callback();
            resolve();
        });
    })
}

function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function(result) {
            resolve(result[propName]);
        })
    })
}