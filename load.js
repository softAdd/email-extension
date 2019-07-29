const contextMenuItem = {
    id: 'INSERT_TEXT',
    title: '@-insert',
    contexts: ["all"]
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if(info.menuItemId == "INSERT_TEXT") {
        chrome.tabs.executeScript(tab.id, { file: './insert_text.js' });
    }
});