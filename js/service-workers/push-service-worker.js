function isClientFocused() {
    return clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    })
        .then((windowClients) => {
            let clientIsFocused = false;

            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.focused) {
                    clientIsFocused = true;
                    break;
                }
            }

            return clientIsFocused;
        });
}

function sendMessageToPage(event, message) {
    /**** START sendPageMessage ****/
    const promiseChain = isClientFocused()
        .then((clientIsFocused) => {
            if (clientIsFocused) {
                windowClients.forEach((windowClient) => {
                    windowClient.postMessage({
                        message: message,
                        time: new Date().toString()
                    });
                });
            } else {
                return self.registration.showNotification('No focused windows', {
                    body: 'Had to show a notification instead of messaging each page.'
                });
            }
        });

    event.waitUntil(promiseChain);
    /**** END sendPageMessage ****/
}


function showNotification(event, options) {
    /**** START showNotificationRequired ****/
    const promiseChain = isClientFocused()
        .then((clientIsFocused) => {
            if (clientIsFocused) {
                const promiseChain1 = clients.matchAll({
                    type: 'window',
                    includeUncontrolled: true
                })
                    /**** END clientsMatchAll ****/
                    /**** START searchClients ****/
                    .then((windowClients) => {
                        for (let i = 0; i < windowClients.length; i++) {
                            windowClients[i].postMessage({
                                message: options.body,
                                time: new Date().toString()
                            });
                        }
                    });
                /**** END searchClients ****/
                event.waitUntil(promiseChain1);
            }

            // Client isn't focused, we need to show a notification.
            options.data = {};
            options.data.targetUrl = options.ClickTargetPath;
            options.data.notifyCloseNotify = options.NotifyCloseNotify;
            return self.registration.showNotification(options.title, options);

        });

    event.waitUntil(promiseChain);
    /**** END showNotificationRequired ****/
}

self.addEventListener('push', function (event) {
    var options = JSON.parse(event.data.text());

    showNotification(event, options);
});


/**** START notificationActionClickEvent ****/
self.addEventListener('notificationclick', function (event, options) {
    event.notification.close();
    //var options = JSON.parse(event.data.text());
    switch (event.notification.tag) {
        case 'open-window':
            openWindow(event);
            break;
        case 'focus-window':
            focusWindow(event);
            break;
        case 'data-notification':
            dataNotification(event);
            break;
        default:
            // NOOP
            break;
    };
});

const notificationCloseAnalytics = (data) => {
    fetch(data.notifyCloseNotify);
    return Promise.resolve();
};

/**** START notificationCloseEvent ****/
self.addEventListener('notificationclose', function (event) {
    const promiseChain = notificationCloseAnalytics(event.notification.data);
    event.waitUntil(promiseChain);
});


function focusWindow(event) {
    /**** START notificationFocusWindow ****/
    /**** START urlToOpen ****/
    const urlToOpen = event.notification.data.targetUrl;
    /**** END urlToOpen ****/

    /**** START clientsMatchAll ****/
    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    })
        /**** END clientsMatchAll ****/
        /**** START searchClients ****/
        .then((windowClients) => {
            let matchingClient = null;

            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === urlToOpen) {
                    matchingClient = windowClient;
                    break;
                }
            }

            if (matchingClient) {
                return matchingClient.focus();
            } else {
                return clients.openWindow(urlToOpen);
            }
        });
    /**** END searchClients ****/

    event.waitUntil(promiseChain);
    /**** END notificationFocusWindow ****/
}

function dataNotification(event) {
    /**** START printNotificationData ****/
    const notificationData = event.notification.data;
    console.log('');
    console.log('The data notification had the following parameters:');
    Object.keys(notificationData).forEach((key) => {
        console.log(`  ${key}: ${notificationData[key]}`);
    });
    console.log('');
    /**** END printNotificationData ****/
}

function openWindow(event) {
    /**** START notificationOpenWindow ****/
    const examplePage = '/demos/notification-examples/example-page.html';
    const promiseChain = clients.openWindow(examplePage);
    event.waitUntil(promiseChain);
    /**** END notificationOpenWindow ****/
}

importScripts('/js/service-workers/polyfill-cache.js');


self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('airhorner').then(function (cache) {
            return cache.addAll([
                '/'
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open('airhorner').then(function (cache) {

            return cache.match(event.request).then(function (response) {
                console.log(event.request);
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});



