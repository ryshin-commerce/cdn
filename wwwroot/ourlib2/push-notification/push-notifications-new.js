var PushNotifications = (function () {
    let applicationServerPublicKey;
    let pushServiceWorkerRegistration;
    let callBackFunc = function () { console.log("ValueChange don't have callback"); };
    let subscribeButtons, unsubscribeButton;

    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    };

    function bindingUi() {
        pushServiceWorkerRegistration.pushManager.getSubscription()
            .then(function (subscription) {
                changeUiState(Notification.permission === 'denied', subscription !== null);
            });
    };

    function changeUiState(notificationsBlocked, isSubscibed) {
        for (var i = 0; i < subscribeButtons.length; i++) {
            if (notificationsBlocked) {
                subscribeButtons[i].disabled = true;
                subscribeButtons[i].innerText = "Thông báo bị chặn";
                subscribeButtons[i].classList.add("disabled");
                subscribeButtons[i].removeAttribute("data-subscribe");
                subscribeButtons[i].outerHTML = subscribeButtons[i].outerHTML;
                //subscribeButtons[i].addEventListener("click", function() {});

            } else if (isSubscibed) {
                subscribeButtons[i].removeAttribute("data-subscribe");
                subscribeButtons[i].classList.add("_isSubscibed");
                if (!!subscribeButtons[i].dataset.subcribeCallback) {
                    subscribeButtons[i].disabled = false;
                    subscribeButtons[i].removeEventListener("click", PushNotifications.subscribeForPushNotifications, false);
                    subscribeButtons[i].addEventListener("click", function (eve) {
                        var func = new Function(eve.target.dataset.subcribeCallback);
                        return func();
                    });
                } else {
                    subscribeButtons[i].disabled = true;
                }
            }

        }

        //subscribeButton.classList.add("") = notificationsBlocked || isSubscibed;
        //unsubscribeButton.disabled = notificationsBlocked || !isSubscibed;

        if (notificationsBlocked) {
            console.log('Permission for Push Notifications has been denied');
        }
    };

    function registerPushServiceWorker() {
        navigator.serviceWorker.register('/js/service-workers/push-service-worker.js', { scope: '/js/service-workers/push-service-worker/' })
            .then(function (serviceWorkerRegistration) {
                pushServiceWorkerRegistration = serviceWorkerRegistration;
                bindingUi();
            }).catch(function (error) {
                console.log('Push Service Worker registration has failed: ' + error);
            });
    };

    function subscribeForPushNotificationsInternal(callbackFnc) {
        var internalCallBackFunc = callbackFnc || function () { console.log("ValueChange don't have callback"); };
        var self = this;
        pushServiceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerPublicKey
        })
            .then(function (pushSubscription) {
                fetch('/subscriptions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pushSubscription)
                })
                    .then(function (response) {
                        if (response.ok) {
                            //console.log('Successfully subscribed for Push Notifications');
                            PushNotifications.callBackFunc();
                            Site.NotifyFormSuccess("THÔNG BÁO", "Nhận thông báo thành công.");
                            internalCallBackFunc();
                        } else {
                            //console.log('Failed to store the Push Notifications subscrition on server');
                            Site.NotifyFormFailed("THÔNG BÁO", "Nhận thông báo thất bại");
                        }
                    }).catch(function (error) {
                        //console.log('Failed to store the Push Notifications subscrition on server: ' + error);
                        //Site.NotifyFormFailed("LỖI", "Không thể nhận thông báo từ server. Có lỗi bất thường xảy ra.");
                    });


            }).catch(function (error) {
                if (Notification.permission === 'denied') {
                    Site.NotifyFormFailed("THÔNG BÁO", "Trình duyệt của bạn đang chặn thông báo vui lòng kích hoặt lại.");
                    //console.log('Failed to subscribe for Push Notifications: denied');
                } else {
                    //console.log('Failed to subscribe for Push Notifications: ' + error);
                    Site.NotifyFormFailed("LỖI", "Không thể nhận thông báo từ trình duyệt này.");
                }
            });
    };

    return {
        initialize: function () {
            if (!'serviceWork' in navigator) {
                console.log('Service Workers are not supported');
                return;
            }

            if (!'PushManager' in window) {
                console.log('Push API not supported');
                return;
            }

            registerPushServiceWorker();
            subscribeButtons = document.querySelectorAll('[data-subscribe]');
            this.attachSubscribeEvent();
            //this.bindingUi();
        },

        attachSubscribeEvent: function () {
            for (var i = 0; i < subscribeButtons.length; i++) {
                subscribeButtons[i].addEventListener('click', this.subscribeForPushNotifications);
            }
        },

        subscribeForPushNotifications: function (callbackFunc) {
            if (applicationServerPublicKey) {
                subscribeForPushNotificationsInternal(callbackFunc);
            } else {
                fetch('/public-key')
                    .then(function (response) {
                        if (response.ok) {
                            return response.text();
                        } else {
                            console.log('Failed to retrieve Public Key');
                        }
                    }).then(function (applicationServerPublicKeyBase64) {
                        applicationServerPublicKey = urlB64ToUint8Array(applicationServerPublicKeyBase64);
                        console.log('Successfully retrieved Public Key');

                        subscribeForPushNotificationsInternal(callbackFunc);
                    }).catch(function (error) {
                        console.log('Failed to retrieve Public Key: ' + error);
                    });
            }
        },

        bindingUi: function () {
            bindingUi();
        },
        unsubscribeFromPushNotifications: function () {
            pushServiceWorkerRegistration.pushManager.getSubscription()
                .then(function (pushSubscription) {
                    if (pushSubscription) {
                        pushSubscription.unsubscribe()
                            .then(function () {
                                fetch('/subscriptions?endpoint=' + encodeURIComponent(pushSubscription.endpoint), {
                                    method: 'DELETE',
                                })
                                    .then(function (response) {
                                        if (response.ok) {
                                            console.log('Successfully unsubscribed from Push Notifications');
                                        } else {
                                            console.log('Failed to discard the Push Notifications subscrition from server');
                                        }
                                    }).catch(function (error) {
                                        console.log('Failed to discard the Push Notifications subscrition from server: ' + error);
                                    });
                            }).catch(function (error) {
                                console.log('Failed to unsubscribe from Push Notifications: ' + error);
                            });
                    }
                });
        }
    };
})();



document.addEventListener("DOMContentLoaded",
    function () {
        PushNotifications.callBackFunc = function () {
            this.bindingUi();
        };
        PushNotifications.initialize();
    });