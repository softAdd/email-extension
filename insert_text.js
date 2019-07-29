(function () {
    let elem = window.document.activeElement;
    let content = elem.value;

    if (!elem.value) {
        content = elem.innerHTML;
    }
})();