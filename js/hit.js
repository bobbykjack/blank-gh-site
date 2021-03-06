/*var ts = window.setTimeout(function() {
    postAjax('https://stats.bobbyjack.me/hit.php', { url: window.location });
}, 1000 * 15);*/

function postAjax(url, data) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');

    var xhr = createCORSRequest('post', url);

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}

function createCORSRequest(method, url){
    var xhr = new XMLHttpRequest();

    if ("withCredentials" in xhr) {
// XHR has 'withCredentials' property only if it supports CORS
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
// if IE use XDR
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }

    return xhr;
}
