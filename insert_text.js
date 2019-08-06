(async function() {
    const currentText = await recieveData('currentText');
    const elem = window.document.activeElement;
        if (elem.value === undefined) {
            elem.innerHTML += currentText;
        } else {
            elem.value += currentText;
        }
})();

function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function (result) {
            resolve(result[propName]);
        });
    });
}