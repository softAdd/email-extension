(async function () {
    let currentText = await recieveData('currentText');
    const userPrefix = await recieveData('prefix');
    const currentDomain = await recieveData('currentDomain');
    const url = await recieveData('currentUrl');
    if (userPrefix !== undefined && userPrefix !== '') {
        currentText = `${userPrefix}+${url}${currentDomain}`;
        await storeData({ 'currentText': currentText });
    }
    await insertText(currentText);
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