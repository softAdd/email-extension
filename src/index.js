window.onload = async function () {
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
                updatePageData();
            }
        });
    });

    const select = document.querySelector('#select-domain');
    // storage.get(['selected_option_number'], function (result) {
    //     const selectedOption = result['selected_option_number'];

    //     if (typeof selectedOption === 'string') {
    //         select.selectedIndex = parseInt(selectedOption, 10);
    //     } else {
    //         select.selectedIndex = 0;
    //         storage.set({
    //             'selected_option_number': '0'
    //         })
    //     }
    // })

    const selectIndex = await recieveData('selectedOptionNumber');
    if (selectIndex === undefined) {
        await storeData({ 'selectedOptionNumber': '0' });
        select.selectedIndex = 0;
    } else {
        select.selectedIndex = parseInt(selectIndex, 10);
    }

    const selectValue = await recieveData('selectValue');
    if (selectValue === undefined || selectValue === '') {
        select.value = '';
    }

    select.addEventListener('change', async function() {
        await storeData({ 'selectedOptionNumber': select.selectedIndex.toString() });
        await storeData({ 'selectValue': select.value.toString() });
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