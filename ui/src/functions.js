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

export function getNextCoverUrl() {
    const n = localStorage.getItem('cover-number')
    if (!n) {
        localStorage.setItem('cover-number', "1")
        return 'routine-cover-default-1.png'
    }
    if (parseInt(n) < 6) {
        localStorage.setItem('cover-number', (parseInt(n) + 1).toString())
    } else {
        localStorage.setItem('cover-number', "1")
    }
    return 'routine-cover-default-'+n+'.png'
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

export function setTheme(darkTheme) {
    if (darkTheme) {
        document.getElementById("root").classList.add("body-dark");
    } else {
        document.getElementById("root").classList.remove("body-dark");
    }
}

export function contactByWhatsapp(type) {
    const domain = 'https://api.whatsapp.com/send/?type=phone_number&app_absent=0'
    const phone = '&phone=5492494284369'

    let link = ''
    if (type === 'athlete') {
        const athleteText = 'Hola! Soy Atleta. Ya tengo cuenta en https://bos.team/app/ y me gustaria pasarme a Atleta Élite. Mi email es:'
        link = domain+phone+'&text='+encodeURIComponent(athleteText)
    } else if (type === 'instructor') {
        const instructorText = 'Hola! Soy Instructor. Ya tengo cuenta en https://bos.team/app/ y me gustaria pasarme a Atleta Élite Instructor. Mi email es:'
        link = domain+phone+'&text='+encodeURIComponent(instructorText)
    } else {
        const genericContactText = `Hola! soy ${type}. Queria hacerte una consulta. Mi email es:`
        link = domain+phone+'&text='+encodeURIComponent(genericContactText)
    }
    window.open(
        link,
        '_blank').focus()
}

export function queryParam({location}, param) {
    return parseSearch(location).get(param)
}

export function parseSearch(location) {
    return new URLSearchParams(location.search)
}

export function queryEncodedData(loc, data) {
    const currentData = queryData(loc)

    if (!data) {
        if (!currentData) {
            return
        }
        return 'dt='+btoa(JSON.stringify(currentData))
    }

    if (currentData) {
        const newData = {...currentData, ...data}
        return 'dt='+btoa(JSON.stringify(newData))
    }

    return 'dt='+btoa(JSON.stringify(data))
}

export function capitalize(word) {
    const firstLetter = word[0].toUpperCase()
    const rest = word.substring(1,word.length).toLowerCase()
    return firstLetter+rest
}

export function queryData(loc) {
    try {
        const d = queryParam(loc, 'dt')
        if(!d) {
            return null
        }
        return JSON.parse(atob(d))
    } catch (e) {
        console.error(e)
        return null
    }
}

export function isLocalhost() {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}