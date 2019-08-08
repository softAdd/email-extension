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
        chrome.contextMenus.onClicked.removeListener(callInsert);
        await createMainMenu();
        return
    }

    await removeAllMenus();
    let contextMenus = [];
    const currentDomain = await recieveData('currentDomain');
    const allDomains = await recieveData('allEmailDomains');
    const urlVariants = await recieveData('urlVariants');
    const prefix = await recieveData('prefix');

    if (settings[0]) {
        urlVariants.forEach((url, index) => {
            let title = '';
            if (prefix !== undefined && prefix !== '') {
                title = `${prefix}+${url}${currentDomain}`;
            } else {
                title = url + currentDomain;
            }
            contextMenus.push({
                id: `url-${index}`,
                title: title,
                contexts: ['all']
            });
            async function callInsertContext(info) {
                if (info.menuItemId === `url-${index}`) {
                    await storeData({ 'textFromContext': title });
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabsArray) {
                        let tab = tabsArray[0];
                        chrome.tabs.executeScript(tab.id, { file: './context_menus.js' });
                    });
                }
            }
            chrome.contextMenus.onClicked.removeListener(callInsertContext);
            chrome.contextMenus.onClicked.addListener(callInsertContext);
        });
    }

    if (settings[1]) {
        const currentText = await recieveData('currentText');
        const url = currentText.split('@')[0];
        allDomains.forEach((domain, index) => {
            let title = '';
            if (prefix !== undefined && prefix !== '') {
                title = `${prefix}+${url}${domain}`;
            } else {
                title = `${url}${domain}`;
            }
            contextMenus.push({
                id: `domain-${index}`,
                title: title,
                contexts: ['all']
            });
            async function callInsertContext(info) {
                if (info.menuItemId === `domain-${index}`) {
                    await storeData({ 'textFromContext': title });
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabsArray) {
                        let tab = tabsArray[0];
                        chrome.tabs.executeScript(tab.id, { file: './context_menus.js' });
                    });
                }
            }
            chrome.contextMenus.onClicked.removeListener(callInsertContext);
            chrome.contextMenus.onClicked.addListener(callInsertContext);
        })
    }

    contextMenus.forEach(menu => {
        chrome.contextMenus.create(menu);
    })
}

function callInsert(info) {
    if (info.menuItemId === 'MAIN_ITEM') {
        insertText();
    }
}

async function createMainMenu() {
    await removeAllMenus();
    const mainMenu = {
        id: 'MAIN_ITEM',
        title: '@-insert',
        contexts: ['all']
    }
    chrome.contextMenus.create(mainMenu);
    
    chrome.contextMenus.onClicked.addListener(callInsert);
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