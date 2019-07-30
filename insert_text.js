(function () {
    let text = '';
    chrome.storage.sync.get(['current_text'], function (result) {
        if (result['current_text']) {
            text = result['current_text'];
        }

        let elem = window.document.activeElement;
        
        if (elem.value === undefined) {
            elem.innerHTML += text;
        } else {
            elem.value += text;
        }
    });
})();