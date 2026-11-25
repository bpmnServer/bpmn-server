// A list's column picker (views/includes/listColumns.pug): ← and → move a shown column; the form sends the boxes
// checked in their order, so the order on the screen is the list's.
document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('.list-columns [data-move]');
    if (!button) return;
    event.preventDefault();
    var item = button.closest('li');
    if (button.dataset.move === 'up' && item.previousElementSibling)
        item.parentNode.insertBefore(item, item.previousElementSibling);
    else if (button.dataset.move === 'down' && item.nextElementSibling)
        item.parentNode.insertBefore(item.nextElementSibling, item);
    button.focus();
});
