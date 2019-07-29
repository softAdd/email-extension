// console.log('1')
// // console.log(window.getSelection().toString())
// console.log(window.document.activeElement)
const storage = chrome.storage.sync;
window.document.activeElement.value += '123';
storage.get(['lines'], function(result) {
    alert(result['lines'])
})