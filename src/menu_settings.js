window.addEventListener('load', createSubmenu);

async function createSubmenu() {
    const settings = document.querySelectorAll('.menu-settings');
    let checked = await recieveData('settings');
    if (!Array.isArray(checked)) {
        checked = [false, false, false];
        await storeData({ 'settings': checked });
    }

    settings.forEach((setting, index) => {
        setting.checked = checked[index];
    });

    settings.forEach((setting, index) => {
        setting.addEventListener('change', async function() {
            checked[index] = setting.checked;
            await storeData({ 'settings': checked });
        });
    });

    // settings.forEach((setting, index) => {
    //     setting[index] = checked[index];
    //     setting.addEventListener('change', async function() {
    //         checked[index] = setting.checked;
    //         await storeData({ 'settings': checked });
    //     })
    // })
}
// const settings = document.querySelectorAll('.menu-settings');
// const settingState = [];
// settings.forEach(setting => {
//     setting.addEventListener('change', function() {
//         //
//     })
// })
// // chrome.contextMenus.create({
// //     id: 'asdas',
// //     title: 'asdsa',
// //     contexts: ['all'],
// //     parentId: 'MAIN_ITEM'
// // });

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