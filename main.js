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
    // if(info.menuItemId == "MAIN_ITEM") {
    //     chrome.tabs.executeScript(tab.id, { file: './insert_text.js' });
    // }
    // insert_text();
    // insert_text(lines[info.menuItemId], tab);
    // insert_text(lines[0], tab);
    if (lines[info.menuItemId]) {
        let text = lines[info.menuItemId];
        insert_text(text, tab)
    }
    // let elem = window.document.activeElement;
    // if (elem.value) {
    //     elem.value += '123';
    // } else {
    //     elem.innerHTML += '123';
    // }
});

chrome.storage.onChanged.addListener(function () {
    storage.get(['lines'], function (result) {
        if (Array.isArray(result['lines'])) {
            lines = [...result['lines']]
        }
    });
});

function insert_text(text, tab) {
    chrome.tabs.executeScript(tab.id, { code: `let elem = window.document.activeElement; if (elem.value) { elem.value += 123; } else { elem.innerHTML += 456; }` })
}