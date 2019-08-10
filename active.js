(async function() {
    const url = window.location.href;
    await setCurrentUrl(url);
    listenToUpdates(url);
})();

function listenToUpdates(url) {
    chrome.runtime.onMessage.addListener(async function(request) {
        if (request.updateData) {
            await setCurrentUrl(url);
            chrome.runtime.sendMessage({createMenus: true});
        }
        if (request.createMenus) {
            chrome.runtime.sendMessage({createMenus: true})
        }
    });
    chrome.runtime.sendMessage({createMenus: true});
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

async function setCurrentUrl(url = '') {
    const urlVariants = parseDomain(url);
    await storeData({ 'urlVariants': urlVariants });
    let selectedUrlType = await recieveData('selectedUrlType');
    if (!selectedUrlType || selectedUrlType === '') {
        selectedUrlType = 0;
    } else {
        selectedUrlType = parseInt(selectedUrlType, 10);
    }
    await storeData({ 'currentUrl': urlVariants[selectedUrlType] });
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