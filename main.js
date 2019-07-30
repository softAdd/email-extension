const mainContextItem = {
    id: 'MAIN_ITEM',
    title: '@-insert',
    contexts: ['all']
};
const storage = chrome.storage.sync;
chrome.contextMenus.create(mainContextItem);
storage.set({
    'set_changes_to_extension': false
})

let text = '';
let lines = [];

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    storage.set({ 'current_text': lines[info.menuItemId].toString() })
    chrome.tabs.executeScript(tab.id, { file: './insert_text.js' });
});

chrome.storage.onChanged.addListener(function () {
    storage.get(['lines'], function (result) {
        if (Array.isArray(result['lines'])) {
            lines = [...result['lines']]
        }
    });
});