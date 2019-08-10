(async function () {
    const settings = await recieveData('settings');
    const currentText = await recieveData('currentText');
    const activeElement = window.document.activeElement;
    if (activeElement.type !== 'textarea' && activeElement.type !== 'text') {
        return
    }
    if (activeElement.value === undefined) {
        activeElement.innerHTML += currentText;
    } else {
        activeElement.value += currentText;
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

function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function (result) {
            resolve(result[propName]);
        });
    });
}