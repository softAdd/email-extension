const settings = document.querySelectorAll('.menu-settings');
const settingState = [];
settings.forEach(setting => {
    setting.addEventListener('change', function() {
        //
    })
})
// chrome.contextMenus.create({
//     id: 'asdas',
//     title: 'asdsa',
//     contexts: ['all'],
//     parentId: 'MAIN_ITEM'
// });

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