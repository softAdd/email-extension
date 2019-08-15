let tabUrl = '';

if (tabUrl === undefined || tabUrl === '') {
    tabUrl = 'username@domain.com';
}

chrome.tabs.onActivated.addListener(async function () {
    await chrome.contextMenus.removeAll();
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabsArray) {
        let tab = tabsArray[0];
        tabUrl = tab.url;
        await storeData({ 'tabUrl': tabUrl });
        await updateAllMenus();
    });
});

chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(async function(msg) {
        if (msg.update) {
            await updateAllMenus();
        }
    });
});

async function updateAllMenus() {
    await chrome.contextMenus.removeAll();
    let currentDomain = await recieveData('currentDomain');
    if (!currentDomain || currentDomain === '') {
        currentDomain = '@example.com';
    }
    const prefix = await recieveData('prefix');
    let title = await createCurrentUrl(tabUrl) + currentDomain;
    if (prefix && prefix !== '') {
        title = `${prefix}+${await createCurrentUrl(tabUrl)}${currentDomain}`;
    }
    await chrome.contextMenus.create({
        id: 'CURRENT_URL',
        title: title,
        contexts: ['all']
    })
    await chrome.contextMenus.update('CURRENT_URL', { onclick: insertText(title) });
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
    const urlVariants = parseDomain(tabUrl);
    const prefix = await recieveData('prefix');
    let titles = [];

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
            titles.push(title);
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
            let title = '';
            if (prefix !== undefined && prefix !== '') {
                title = `${prefix}+${await createCurrentUrl(tabUrl)}${domain}`;
            } else {
                title = await createCurrentUrl(tabUrl) + domain;
            }
            if (titles.some(elem => elem === title)) {
                return
            }
            titles.push(title);
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

async function createCurrentUrl(url = '') {
    const urlVariants = parseDomain(url);
    let selectedUrlType = await recieveData('selectedUrlType');
    if (!selectedUrlType || selectedUrlType === '') {
        selectedUrlType = 0;
    } else {
        selectedUrlType = parseInt(selectedUrlType, 10);
    }
    await storeData({ 'tabUrl': urlVariants[selectedUrlType] });
    return urlVariants[selectedUrlType];
}

function parseDomain(url) {
    let topLevelDomain = extractHostname(url, true);
    let subDomain = extractHostname(url);
    let hostName = extractHostname(url, true, true);

    function extractHostname(url, tld, only_name) {
        let hostname;

        //find & remove protocol (http, ftp, etc.) and get hostname
        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        } else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];

        //find & remove "?"
        hostname = hostname.split('?')[0];

        if (tld) {
            let hostnames = hostname.split('.');
            hostname = hostnames[hostnames.length - 2] + '.' + hostnames[hostnames.length - 1];
        }

        if (only_name) {
            let domain = hostname.split('.')[0];
            hostname = domain;
        }

        return hostname;
    }

    return [subDomain, hostName, topLevelDomain];
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