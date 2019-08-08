(async function() {
    const url = window.location.href;

    let currentUrl = await getCurrentUrl(url);
    await storeData({ 'currentUrl': currentUrl });
    let currentDomain = await getCurrentDomain();
    if (currentDomain === undefined || currentDomain === '') {
        currentDomain = '@example.com';
    }
    await storeData({ 'currentText': currentUrl + currentDomain });

    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
        if (request.updateData) {
            currentUrl = await getCurrentUrl(url);
            currentDomain = await getCurrentDomain();
            await storeData({ 'currentText': currentUrl + currentDomain });
        }
    });

    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
        if (request.createMenus) {
            chrome.runtime.sendMessage({createMenus: true})
        }
    });
})();

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

async function getCurrentUrl(url = '') {
    const urlVariants = parseDomain(url);
    await storeData({ 'urlVariants': urlVariants });
    let selectedUrlType = await recieveData('selectedUrlType');
    if (selectedUrlType === undefined) {
        selectedUrlType = 0;
    }
    return urlVariants[selectedUrlType];
}

async function getCurrentDomain() {
    let currentDomain = await recieveData('currentDomain');
    if (currentDomain === undefined) {
        currentDomain = '@example.com';
    }
    return currentDomain;
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