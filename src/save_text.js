window.onload = function () {
    const storage = chrome.storage.sync;
    const input = document.querySelector('.add-input');
    const button = document.querySelector('.add-button');
    const list = document.querySelector('.text-list');

    let lines = [];

    storage.get(['lines'], function (result) {
        if (!Array.isArray(result['lines'])) {
            storage.set({ 'lines': [] });
        } else {
            lines = [...result['lines']];
            lines.forEach((str, index) => {
                addItem(list, str, index + 1);
            });
        }
    });

    button.addEventListener('click', function () {
        const text = input.value;
        input.value = '';
        input.focus();
        lines = [...lines, text];
        addItem(list, lines[lines.length - 1], lines.length);
        storage.set({ 'lines': lines });
        chrome.contextMenus.create({
            id: (lines.length - 1).toString(),
            title: lines[lines.length - 1].toString(),
            contexts: ['all'],
            parentId: 'MAIN_ITEM',
        });
        storage.get(['set_changes_to_extension'], function(result) {
            let state = result['set_changes_to_extension'];
            storage.set({ 'set_changes_to_extension': !state })
        })
    });

    input.addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
            button.dispatchEvent(new Event('click'));
        }
    });

    function addItem(elem, text, index) {
        elem.innerHTML += `<br/>${index}. ${text}`;
    }
}