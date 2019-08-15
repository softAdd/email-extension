const port = chrome.extension.connect({
    name: "Update Menu Connection"
});

document.addEventListener("DOMContentLoaded", popupChanges);

async function popupChanges() {
    const domainList = document.querySelector('.domain-list');
    const emailInput = document.querySelector('.input-email');
    const addEmailButton = document.querySelector('.button-add');
    const backButton = document.querySelector('.back');
    backButton.addEventListener('click', function() {
        window.location.href = "../index.html";
    })

    let emails = await recieveData('allEmailDomains');
    addEmails(domainList, emails);

    addEmailButton.addEventListener('click', async function() {
        emails = [...emails, '@' + emailInput.value.toString()];
        domainList.innerHTML = '';
        addEmails(domainList, emails);
        emailInput.value = '';
        await storeData({ 'allEmailDomains': emails });
        if (emails.length === 1) {
            await storeData({ 'currentDomain': emails[0].toString() });
            await port.postMessage({ update: true });
        }
        createDeleteListeners(emails);
        emailInput.focus();
        await port.postMessage({ update: true });
    })

    emailInput.addEventListener('keypress', function(e) {
        if (e.keyCode === 13) {
            addEmailButton.dispatchEvent(new Event('click'));
        }
    })
    createDeleteListeners(emails);
    await port.postMessage({ update: true });
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

function addEmails(domainList, emails) {
    emails.forEach((email, index) => {
        domainList.innerHTML += `<div class="email-item"><p class="email">${email}</p><span class="delete-item" id="delete-${index}">x</span></div>`;
    });
}

function createDeleteListeners(emails) {
    const deleteButtons = document.querySelectorAll('.delete-item');
    const domainList = document.querySelector('.domain-list');
    deleteButtons.forEach((button, index) => {
        button.addEventListener('click', async function() {
            emails.splice(index, 1);
            await storeData({ 'allEmailDomains': emails });
            domainList.innerHTML = '';
            if (emails.length === 0) {
                await storeData({ 'currentDomain': '@example.com' });
                await port.postMessage({ update: true });
            } else {
                addEmails(domainList, emails);
            }
            if (emails.length === 1) {
                await storeData({ 'currentDomain': emails[0].toString() });
                await port.postMessage({ update: true });
            }
            await port.postMessage({ update: true });
            createDeleteListeners(emails);
        });
    });
}