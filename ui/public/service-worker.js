self.addEventListener('install', (event) => {
    console.log('Service worker installed');
});

self.addEventListener('fetch', (event) => {
    // You can use this event to cache new requests or serve cached content.
});

//Not supported on Safari iOS
self.addEventListener('notificationclick', function (event) {
    let url = '/student';

    //notification obj Not supported on Safari Mac nor iOS
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({type: 'window'}).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                } else {
                    return client.navigate(url).then(c => c.focus())
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

//Not supported on Safari iOS
self.addEventListener('notificationclose', function (event) {
    event.notification.close(); // Android needs explicit close.
});

//Not supported on Safari iOS
self.addEventListener('push', function (event) {
    //todo: refresh worker strategy to avoid caching old versions of the worker
    // Retrieve the textual payload from event.data (a PushMessageData object).
    // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
    // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
    const payload = event.data ? event.data.text() : 'no payload';

    let title = ""
    let options = {}

    switch (payload) {
        case "QUESTION_TRAINED_TODAY":
            title = 'El coliseo'
            options = {
                body: 'Hola. Entrenaste Hoy?',
                // tag: "QUESTION_TRAINED_TODAY2",
                icon: 'favicon.ico',
                //Not supported on Firefox. partially on latest Safari Mobile version. Should be in the dock for MacOS
                badge: 'badgeponele.png',
                //Not supported on Firefox or Safari. whether web or mobile
                data: {data: 'random metadata lets see what it is useful for'},
                // todo: actions maybe for a future version...
                // actions: [
                //     {
                //         action: 'yes',
                //         title: 'Si'
                //     },
                //     {
                //         action: 'no',
                //         title: 'No'
                //     }
                // ]
            }
    }

    // Keep the service worker alive until the notification is created.
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});