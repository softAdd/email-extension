(async function () {
    const settings = await recieveData('settings');
    const currentText = await recieveData('currentText');
    const activeElement = window.document.activeElement;
    if (activeElement.tagName !== 'TEXTAREA' && activeElement.tagName !== 'INPUT') {
        return
    }
    const selectionStart = activeElement.selectionStart;
    if (activeElement.value === undefined) {
        activeElement.innerHTML = insert(activeElement.innerHTML, selectionStart, currentText);
    } else {
        activeElement.value = insert(activeElement.value, selectionStart, currentText);
    }
    if (!settings) {
        return
    }
    if (settings[2]) {
        if (activeElement.value === undefined) {
            activeElement.innerHTML = currentText;
        } else {
            activeElement.value = currentText;
        }
    }
})();

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function (result) {
            resolve(result[propName]);
        });
    });
}