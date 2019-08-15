window.addEventListener('load', createSubmenu);

async function createSubmenu() {
    const port = chrome.extension.connect({
        name: "Update Menu Connection"
    });

    const settings = document.querySelectorAll('.menu-settings');
    let checked = await recieveData('settings');
    if (!Array.isArray(checked)) {
        checked = [false, false, false];
        await storeData({ 'settings': checked });
    }

    settings.forEach((setting, index) => {
        setting.checked = checked[index];
    });

    settings.forEach((setting, index) => {
        setting.addEventListener('change', async function() {
            checked[index] = setting.checked;
            await storeData({ 'settings': checked });
            if (index === 0 || index === 1) {
                await port.postMessage({ update: true });
            }
        });
    });
}

function storeData(dataSet = {}, callback = () => {}) {
    return new Promise(resolve => {
        chrome.storage.sync.set(dataSet, function() {
            callback();
            resolve();
        });
    });
}

function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function(result) {
            resolve(result[propName]);
        });
    });
}