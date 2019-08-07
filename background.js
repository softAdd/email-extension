window.onload = async function () {
    await showVariations();

    chrome.tabs.onActivated.addListener(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabsArray) {
            let tab = tabsArray[0];
            chrome.tabs.executeScript(tab.id, { file: './active.js' });
        });
    });

    chrome.runtime.onMessage.addListener(async function (request) {
        if (request.createMenus) {
            await showVariations();
        }
    })
}

function insertText() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabsArray) {
        let tab = tabsArray[0];
        chrome.tabs.executeScript(tab.id, { file: './insert_text.js' });
    });
}

async function removeAllMenus() {
    await chrome.contextMenus.removeAll();
}

async function showVariations() {
    const settings = await recieveData('settings');
    if (settings === undefined || (!settings[0] && !settings[1])) {
        await createMainMenu();
        return
    }

    await removeAllMenus();
    let contextMenus = [];
    const currentDomain = await recieveData('currentDomain');
    const allDomains = await recieveData('allEmailDomains');
    const urlVariants = await recieveData('urlVariants');

    if (settings[0]) {
        urlVariants.forEach((url, index) => {
            contextMenus.push({
                id: `url-${index}`,
                title: `${url}${currentDomain}`,
                contexts: ['all']
            });
        });
    }

    if (settings[1]) {
        let currentText = await recieveData('currentText');
        let url = currentText.split('@')[0];
        allDomains.forEach((domain, index) => {
            contextMenus.push({
                id: `domain-${index}`,
                title: `${url}${domain}`,
                contexts: ['all']
            })
        })
    }

    contextMenus.forEach(menu => {
        chrome.contextMenus.create(menu);
    })
}

async function createMainMenu() {
    await removeAllMenus();
    const mainMenu = {
        id: 'MAIN_ITEM',
        title: '@-insert',
        contexts: ['all']
    }
    chrome.contextMenus.create(mainMenu);
    chrome.contextMenus.onClicked.addListener(function (info) {
        if (info.menuItemId === 'MAIN_ITEM') {
            insertText();
        }
    });
}

function storeData(dataSet = {}, callback = () => { }) {
    return new Promise(resolve => {
        chrome.storage.sync.set(dataSet, function () {
            callback();
            resolve();
        });
    });
}

function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function (result) {
            resolve(result[propName]);
        });
    });
}