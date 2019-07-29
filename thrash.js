chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if(info.menuItemId == "MAIN_ITEM") {
        chrome.tabs.executeScript(tab.id, { file: './insert_text.js' });
    }
    alert(lines[info.menuItemId])
    let lines = [];
    storage.get(['lines'], function (result) {
        if (!Array.isArray(result['lines'])) {
            storage.set({ 'lines': [] });
        } else {
            lines = [...result['lines']];
            lines.forEach((str, index) => {
                addItem(list, str, index + 1);
            });
        }
    });
});