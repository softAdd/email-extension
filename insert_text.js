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
    dispatchInputChange(activeElement);
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
    dispatchInputChange(activeElement);
})();

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function dispatchInputChange(elem) {
    elem.dispatchEvent(new Event('change', { bubbles: true }));
    elem.dispatchEvent(new Event('blur', { bubbles: true }));
    elem.dispatchEvent(new Event('focus', { bubbles: true }));
}

function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function (result) {
            resolve(result[propName]);
        });
    });
}