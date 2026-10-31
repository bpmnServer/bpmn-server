// Sends the page's CSRF token (meta csrf-token) with every same-origin request that changes state,
// whatever makes it: jQuery (including the copy bundled in the modeler), XMLHttpRequest or fetch.
(function () {
    function token() {
        var meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('content') : null;
    }
    function needsToken(method, url) {
        if (/^(GET|HEAD|OPTIONS)$/i.test(method || 'GET')) return false;
        try {
            return new URL(url, window.location.href).origin === window.location.origin;
        } catch (e) {
            return false;
        }
    }

    var open = XMLHttpRequest.prototype.open;
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
        this._csrfNeeded = needsToken(method, url);
        return open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
        var value = this._csrfNeeded && token();
        if (value) this.setRequestHeader('X-CSRF-Token', value);
        return send.apply(this, arguments);
    };

    if (window.fetch) {
        var originalFetch = window.fetch;
        window.fetch = function (input, init) {
            init = init || {};
            var method = init.method || (input && input.method) || 'GET';
            var url = typeof input === 'string' ? input : (input && input.url);
            var value = needsToken(method, url) && token();
            if (value) {
                var headers = new Headers(init.headers || (input && input.headers) || {});
                if (!headers.has('X-CSRF-Token')) headers.set('X-CSRF-Token', value);
                init = Object.assign({}, init, { headers: headers });
            }
            return originalFetch.call(this, input, init);
        };
    }
})();
