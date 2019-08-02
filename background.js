window.onload = function () {
    chrome.tabs.onActivated.addListener(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabsArray) {
            let tab = tabsArray[0];
            chrome.tabs.executeScript(tab.id, { file: './active.js' });
        });
    });
}