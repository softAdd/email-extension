(async function () {
    let currentText = await recieveData('currentText');
    let userPrefix = await recieveData('prefix');
    let currentDomain = await recieveData('currentDomain');
    let currentUrl = currentText.split('@')[0];
    if (userPrefix !== undefined && userPrefix !== '') {
        currentText = `${userPrefix}+${currentUrl}${currentDomain}`;
    }
    let elem = window.document.activeElement;
    if (await recieveData('settings')[2] === true) {
        if (elem.value === undefined) {
            elem.innerHTML = currentText;
        } else {
            elem.value = currentText;
        }
    } else {
        if (elem.value === undefined) {
            elem.innerHTML += currentText;
        } else {
            elem.value += currentText;
        }
    }
    console.log(await recieveData('settings'))
    console.log(await recieveData('settings')[3])
})();

function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function (result) {
            resolve(result[propName]);
        });
    });
}