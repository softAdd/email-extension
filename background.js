window.onload = async function () {
    await setDefaults();
}

async function setDefaults() {
    chrome.tabs.onActivated.addListener(async function () {
        await chrome.contextMenus.removeAll();
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabsArray) {
            let tab = tabsArray[0];
            chrome.tabs.executeScript(tab.id, { file: './active.js' });
        });
    });

    chrome.runtime.onMessage.addListener(async function (request) {
        if (request.createMenus) {
            await updateAllMenus();
        }
    });
}

async function updateAllMenus() {
    await chrome.contextMenus.removeAll();
    const title = await createCurrentEmail();
    chrome.contextMenus.create({
        id: 'CURRENT_URL',
        title: title,
        contexts: ['all']
    })
    chrome.contextMenus.update('CURRENT_URL', { onclick: insertText(title) });
    await createContextMenus();
}

async function createContextMenus() {
    const settings = await recieveData('settings');
    if (settings === undefined || (!settings[0] && !settings[1])) {
        return
    }
    chrome.contextMenus.create({
        id: 'VARIANTS',
        title: 'variants',
        contexts: ['all']
    });
    const currentDomain = await recieveData('currentDomain');
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
            if (titles.some(elem => elem === title)) {
                return
            }
            chrome.contextMenus.create({
                id: `url-${index}`,
                title: title,
                contexts: ['all'],
                parentId: 'VARIANTS'
            });
            chrome.contextMenus.update(`url-${index}`, { onclick: insertText(title) });
        });
    }
    const allEmailDomains = await recieveData('allEmailDomains');

    if (settings[1]) {
        allEmailDomains.forEach(async function(domain, index) {
            let current = await createCurrentEmail();
            current = current.split('@')[0];
            const title = current + domain;
            chrome.contextMenus.create({
                id: `title-${index}`,
                title: title,
                contexts: ['all'],
                parentId: 'VARIANTS'
            });
            chrome.contextMenus.update(`title-${index}`, { onclick: insertText(title) });
        });
    }
}

function insertText(text) {
    return async function () {
        await storeData({ 'currentText': text });
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabsArray) {
            let tab = tabsArray[0];
            chrome.tabs.executeScript(tab.id, { file: './insert_text.js' });
        });
    }
}

async function createCurrentEmail() {
    const currentUrl = await recieveData('currentUrl');
    const currentDomain = await recieveData('currentDomain');
    const prefix = await recieveData('prefix');
    let title = 'username@domain.com';
    if (currentUrl && currentUrl !== '') {
        title = currentUrl;
    }
    if (currentDomain && currentDomain !== '') {
        title = currentUrl + currentDomain;
    } else {
        title = currentUrl + '@example.com';
    }
    if (prefix && prefix !== '') {
        title = `${prefix}+${currentUrl}${currentDomain}`;
    }
    return title
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