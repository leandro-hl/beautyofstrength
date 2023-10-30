export function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copy command was ' + msg);
    } catch (err) {
        console.error('Unable to copy', err);
    }

    document.body.removeChild(textarea);
}

export function parseSearch(location) {
    return new URLSearchParams(location.search)
}

export function queryParam({location}, param) {
    return parseSearch(location).get(param)
}

export function isLocalhost() {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}