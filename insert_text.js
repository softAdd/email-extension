(function () {
    let text = '';
    chrome.storage.sync.get(['current_text'], function (result) {
        if (result['current_text']) {
            text = result['current_text'];
        }

        if (window.document.activeElement.value === undefined) {
            window.document.activeElement.innerHTML += text;
        } else {
            window.document.activeElement.value += text;
        }
    });
})();