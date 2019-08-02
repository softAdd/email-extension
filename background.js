window.onload = function () {
    const contextMenu = {
        id: 'MAIN_ITEM',
        title: '@-insert',
        contexts: ['all']
    }
    chrome.contextMenus.create(contextMenu);
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