/*
 * A drawn form's lists and lookups (<owf:list>, <owf:lookup> on a form field; docs/design/form-lookups.md). The
 * server answers a field's choices, as the person signed in, from the source the model names: POST data-choices-url
 * with { text, data, startNodeId } answers { items: [{ key, display }] }. `data` is the form's values as they are, so
 * a field's filter (${data.department}) reads what was just picked.
 *
 * - A list: select[data-choices-url], filled with every choice; asked again when another field changes, if it has a
 *   filter.
 * - A lookup: input[data-choices-url] (what the person types and sees) with a datalist of the choices, searched as
 *   they type.
 * Either way the key is the field's value and the label goes in the hidden input data-display-for names (<id>Display).
 * Text that is not a choice leaves the lookup's value empty, and the form will not submit.
 */
(function () {
    function formValues(form) {
        var data = {};
        if (!form) return data;
        new FormData(form).forEach(function (value, name) {
            if (name === '_csrf' || typeof value !== 'string') return;
            data[name.indexOf('field.') === 0 ? name.substring(6) : name] = value;
        });
        return data;
    }

    function choices(element, text) {
        var body = { text: text || '', data: formValues(element.form) };
        var start = element.getAttribute('data-start');
        if (start) body.startNodeId = start;
        return fetch(element.getAttribute('data-choices-url'), {
            method: 'POST', credentials: 'same-origin',
            headers: { 'content-type': 'application/json', accept: 'application/json' },
            body: JSON.stringify(body),
        }).then(function (res) {
            return res.json().then(function (answer) {
                if (!res.ok) throw new Error((answer.error && answer.error.message) || res.statusText);
                element.title = '';
                element.classList.remove('choices-failed');
                return answer.items || [];
            });
        });
    }

    function failed(element, error) {
        element.title = 'The choices could not be read: ' + error.message;
        element.classList.add('choices-failed');
    }

    function displayOf(element) {
        return document.getElementById(element.getAttribute('data-display-for'));
    }

    function list(select) {
        var display = displayOf(select);
        var asked = 0;
        function fill() {
            var ask = ++asked;
            var selected = select.value || select.getAttribute('data-value') || '';
            choices(select, '').then(function (items) {
                if (ask !== asked) return;
                select.options.length = 1;   // the empty choice stays
                items.forEach(function (item) {
                    var option = document.createElement('option');
                    option.value = item.key;
                    option.textContent = item.display;
                    if (item.key === selected) option.selected = true;
                    select.appendChild(option);
                });
                show();
            }).catch(function (error) { failed(select, error); });
        }
        function show() {
            var option = select.options[select.selectedIndex];
            if (display) display.value = option && option.value ? option.textContent : '';
        }
        select.addEventListener('change', show);
        // a list with a filter reads another field: asked again when one changes
        if (select.getAttribute('data-filtered') === 'true' && select.form)
            select.form.addEventListener('change', function (event) { if (event.target !== select) fill(); });
        fill();
    }

    function lookup(input) {
        var hidden = document.getElementById(input.getAttribute('data-value-for'));
        var display = displayOf(input);
        var datalist = document.getElementById(input.getAttribute('list'));
        var shown = [], timer = null, asked = 0;
        // a value already chosen counts as a choice
        if (hidden.value && input.value) shown = [{ key: hidden.value, display: input.value }];
        function pick() {
            var text = input.value;
            var match = shown.filter(function (item) { return item.display === text; })[0];
            hidden.value = match ? match.key : '';
            if (display) display.value = match ? match.display : '';
            input.setCustomValidity(text && !match ? 'Choose one of the choices offered' : '');
        }
        function search() {
            var ask = ++asked;
            choices(input, input.value).then(function (items) {
                if (ask !== asked) return;   // an older answer, after a newer one
                shown = items;
                datalist.innerHTML = '';
                items.forEach(function (item) {
                    var option = document.createElement('option');
                    option.value = item.display;
                    datalist.appendChild(option);
                });
                pick();
            }).catch(function (error) { failed(input, error); });
        }
        input.addEventListener('input', function () {
            pick();
            clearTimeout(timer);
            timer = setTimeout(search, 250);
        });
        input.addEventListener('change', pick);
    }

    function start() {
        document.querySelectorAll('select[data-choices-url]').forEach(list);
        document.querySelectorAll('input[data-choices-url]').forEach(lookup);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
