window.onload = async function() {
    const domainList = document.querySelector('.domain-list');
    const emailInput = document.querySelector('.input-email');
    const addEmailButton = document.querySelector('.button-add');
    const backButton = document.querySelector('.back');
    backButton.addEventListener('click', function() {
        window.location.href = "../index.html";
    })
    let emails = await recieveData('allEmailDomains');

    emails.forEach(email => {
        domainList.innerHTML += `<p class="email-item">${email}</p>`;
    });
    
    addEmailButton.addEventListener('click', async function() {
        emails = [...emails, '@' + emailInput.value.toString()];
        domainList.innerHTML += `<p class="email-item">@${emailInput.value.toString()}</p>`;
        emailInput.value = '';
        await storeData({ 'allEmailDomains': emails });
        updatePageData();
    })

    emailInput.addEventListener('keypress', function(e) {
        if (e.keyCode === 13) {
            addEmailButton.dispatchEvent(new Event('click'));
        }
    })
}

function storeData(dataSet = {}, callback = () => { }) {
    return new Promise(resolve => {
        chrome.storage.sync.set(dataSet, function () {
            callback();
            resolve();
        });
    })
}

function recieveData(propName = '') {
    return new Promise(resolve => {
        chrome.storage.sync.get([propName], function (result) {
            resolve(result[propName]);
        })
    })
}

function updatePageData() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, { updateData: true });
    });
}
