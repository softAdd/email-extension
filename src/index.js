window.onload = async function () {
    const port = chrome.extension.connect({
        name: "Update Menu Connection"
    });
    
    const inputs = document.querySelectorAll('input[name=input-center]');
    let checkedInput = await recieveData('selectedUrlType');
    if (checkedInput === undefined) {
        inputs[0].checked = true;
        await storeData({ 'selectedUrlType': '0' });
    } else {
        inputs[parseInt(checkedInput, 10)].checked = true;
    }

    inputs.forEach((input, index) => {
        input.addEventListener('change', async function () {
            if (input.checked) {
                await storeData({ 'selectedUrlType': index.toString() });
                await port.postMessage({ update: true });
            }
        });
    });

    const select = document.querySelector('#select-domain');
    let emails = await recieveData('allEmailDomains');
    if (emails === undefined || emails === '' || emails === []) {
        emails = ['@gmail.com', '@mail.ru'];
        await storeData({ 'allEmailDomains': emails });
        await port.postMessage({ update: true });
    }
    emails.forEach(email => {
        select.innerHTML += `<option value="${email}">${email}</option>`;
    })

    const selectIndex = await recieveData('selectedOptionNumber');
    if (selectIndex === undefined) {
        await storeData({ 'selectedOptionNumber': '0' });
        select.selectedIndex = 0;
    } else {
        select.selectedIndex = parseInt(selectIndex, 10);
    }

    const selectValue = await recieveData('currentDomain');
    if (selectValue === undefined || selectValue === '') {
        await storeData({ 'currentDomain': select.value.toString() });
    }

    select.addEventListener('change', async function() {
        await storeData({ 'selectedOptionNumber': select.selectedIndex.toString() });
        await storeData({ 'currentDomain': select.value.toString() });
        await port.postMessage({ update: true });
    })

    const optionsNode = document.querySelector('#options-button');
    optionsNode.addEventListener('click', function() {
        window.location.href = "domain_list/popup.html";
    })
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