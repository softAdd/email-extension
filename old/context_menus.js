(async function() {
    const text = await recieveData('textFromContext');
    if (text !== undefined && text !== '') {
        await insertText(text);
    }
})();

async function insertText(currentText) {
    const settings = await recieveData('settings');
    const elem = window.document.activeElement;
    if (elem.value === undefined) {
        elem.innerHTML += currentText;
    } else {
        elem.value += currentText;
    }
    if (!settings) {
        return
    }
    if (settings[2]) {
        if (elem.value === undefined) {
            elem.innerHTML = currentText;
        } else {
            elem.value = currentText;
        }
    }
}


function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function (result) {
            resolve(result[propName]);
        });
    });
}