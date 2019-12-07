var PushNotifications = (function () {
    let applicationServerPublicKey;
    let callBackFunc = function () {
        console.log("ValueChange don't have callback");
    };

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

    function bindingUiInternal(selector) {
        PushNotifications.PushServiceWorkerRegistration.pushManager.getSubscription()
            .then(function (subscription) {
                var containerSelectors = document.querySelectorAll(selector+ " [data-subscribe-container]");
                for (var i = 0; i < containerSelectors.length; i++) {
                    var btns = containerSelectors[i].querySelectorAll("[data-subscribe]");

                    for (var j = 0; j < btns.length; j++) {
                        //btns[i].outerHTML = btns[i].outerHTML;
                        changeUiState(containerSelectors[i], btns[j], Notification.permission === 'denied', subscription);
                    }
                }

            });
    };

    function changeUiState(subscribeContainer, subscribeButton, notificationsBlocked, subscription) {

        if (subscription === null) {
            console.log("subscription is null");
        }
        if (!subscribeButton) {
            return;
        }

        var isSubscibed = subscription !== null;

        if (notificationsBlocked) {
            subscribeButton.disabled = true;
            subscribeButton.innerText = "Thông báo bị chặn";
            subscribeButton.classList.add("disabled");
            subscribeButton.removeAttribute("data-subscribe");
            subscribeButton.outerHTML = subscribeButton.outerHTML;
            subscribeContainer.classList.add("disabled");
        } else if (isSubscibed) {
            subscribeButton.classList.add("_isSubscibed");
            subscribeContainer.classList.add("_isSubscibed");
            if (subscribeButton.hasAttribute("data-subscribe-import-product")) {
                checkSubcribeImport(subscribeButton, subscription);
            }
            if (subscribeButton.hasAttribute("data-subscribe-flash-sale")) {
                checkSubcribeFlashSale(subscribeButton, subscription);
            }

        } else {
            subscribeButton.addEventListener("click",
                function (eve, subscription) {
                    PushNotifications.subscribeForPushNotifications(function (eve) {
                        PushNotifications.PushServiceWorkerRegistration.pushManager.getSubscription()
                            .then(function (pushSubscription) {
                                if (!pushSubscription) {
                                    return;
                                }
                                if (subscribeButton.hasAttribute("data-subscribe-import-product")) {
                                    subscribeButton.setAttribute("data-ignore-check-subscribe", "true");
                                    productSubcribeInternal(subscribeButton, pushSubscription);
                                }
                                if (subscribeButton.hasAttribute("data-subscribe-flash-sale")) {
                                    subscribeButton.setAttribute("data-ignore-check-subscribe", "true");
                                    productSubcribeInternal(subscribeButton, pushSubscription);
                                }

                                bindingUiInternal("body");
                            });

                    });
                });
        }

        if (notificationsBlocked) {
            console.log('Permission for Push Notifications has been denied');
        }
    };

    function checkSubcribeImport(btbAction, subscription) {

        if (!btbAction) {
            return;
        }

        if (btbAction.hasAttribute("data-ignore-check-subscribe")) {
            return;
        }

        fetch('/checkSubcribeInportProduct?productId=' + btbAction.dataset.productId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        })
            .then(function (response) {
                if (response.ok && response.status === 200) {
                    btbAction.classList.add("_isSubscibedImport");
                    console.log('Successfully subscribed from Push Notifications');
                    btbAction.innerText = "Thông báo khi có hàng";
                    btbAction.removeAttribute("data-subscribe-import-product");
                    btbAction.outerHTML = btbAction[i].outerHTML;
                } else {
                    //btbAction.setAttribute("data-subscribe-import-product");
                    btbAction.addEventListener("click", function (e) {
                        productSubcribeInternal(btbAction, subscription);
                    });
                }
            }).catch(function (error) {
                //console.log('Failed to store the Push Notifications subscrition on server: ' + error);
                //Site.NotifyFormFailed("LỖI", "Không thể nhận thông báo từ server. Có lỗi bất thường xảy ra.");
            });

    };


    function checkSubcribeFlashSale(btbAction, subscription) {
        if (!btbAction) {
            return;
        }


        fetch('/checkSubcribeLikeProduct?productId=' + btbAction.dataset.productId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        })
            .then(function (response) {
                if (response.ok && response.status === 200) {
                    btbAction.classList.add("_isSubscibedFlashSale");
                    console.log('Successfully subscribed from Push Notifications');
                    btbAction.innerHTML = '<i class="fa fa-heart text-red" aria-hidden="true"></i>';
                    btbAction.removeAttribute("data-subscribe-flash-sale");
                    btbAction.outerHTML = btbAction.outerHTML;
                } else {
                    btbAction.addEventListener("click", function (e) {
                        productSubcribeInternal(btbAction, subscription);
                    });
                    //btbAction.setAttribute("data-subscribe-flash-sale");

                }
            }).catch(function (error) {
                //console.log('Failed to store the Push Notifications subscrition on server: ' + error);
                //Site.NotifyFormFailed("LỖI", "Không thể nhận thông báo từ server. Có lỗi bất thường xảy ra.");
            });
    };

    function registerPushServiceWorker(callbackFunction) {
        navigator.serviceWorker.getRegistration().then(function (serviceWorkerRegistration) {
            if (serviceWorkerRegistration === undefined) {
                navigator.serviceWorker.register('/push-service-worker.js',
                    {
                        scope: '/'
                    })
                    .then(function (serviceWorkerRegistration1) {
                        PushNotifications.PushServiceWorkerRegistration = serviceWorkerRegistration1;
                        PushNotifications.Subscription = serviceWorkerRegistration1.pushManager.getSubscription();
                        callbackFunction();
                    }).catch(function (error) {
                        console.log('Push Service Worker registration has failed: ' + error);
                    });
            } else {
                PushNotifications.PushServiceWorkerRegistration = serviceWorkerRegistration;
                PushNotifications.Subscription = serviceWorkerRegistration.pushManager.getSubscription();
                callbackFunction();
            }
        }).catch(function (error) {
            console.log('Push Service Worker registration has failed: ' + error);
        });
    };

    function productSubcribeInternal(btnFireEvent, subcription) {
        if (btnFireEvent.hasAttribute("data-subscribe-flash-sale")) {
            fetch('/likeproduct?productId=' + btnFireEvent.dataset.productId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subcription)
            })
                .then(function (response) {
                    if (response.ok) {
                        Site.NotifyFormSuccess("THÔNG BÁO", "Chúng tôi sẽ thông báo khi có trương trình khuyến mãi cho sản phẩm này.");
                        btnFireEvent.classList.add("_isSubscibedFlashSale");
                        console.log('Successfully subscribed from Push Notifications');
                        btnFireEvent.innerHTML = '<i class="fa fa-heart text-red" aria-hidden="true"></i>';
                        btnFireEvent.removeAttribute("data-subscribe-flash-sale");
                        var cb = new Function(btnFireEvent.dataset.subcribeCallback);
                        cb();
                        btnFireEvent.outerHTML = btnFireEvent.outerHTML;

                    } else {
                        console.log('Failed to discard the Push Notifications subscrition from server');
                        Site.NotifyFormFailed("Thông báo",
                            "Bạn đã tắt chức năng thông báo trên trình duyệt, vui lòng kích hoặt lại");
                    }
                }).catch(function (error) {
                    console.log('Failed to discard the Push Notifications subscrition from server: ' + error);
                });

        } else if (btnFireEvent.hasAttribute("data-subscribe-import-product")) {

            fetch('/subcribeproduct?productId=' + btnFireEvent.dataset.productId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subcription)
            })
                .then(function (response) {
                    if (response.ok) {
                        btnFireEvent.classList.add("_isSubscibedImport");
                        console.log('Successfully subscribed from Push Notifications');
                        btnFireEvent.innerText = "Thông báo khi có hàng";
                        btnFireEvent.removeAttribute("data-subscribe-import-product");
                        var cb = new Function(btnFireEvent.dataset.subcribeCallback);
                        cb();
                        btnFireEvent.outerHTML = btnFireEvent.outerHTML;
                    } else {
                        console.log('Failed to discard the Push Notifications subscrition from server');
                        Site.NotifyFormFailed("Thông báo",
                            "Bạn đã tắt chức năng thông báo trên trình duyệt, vui lòng kích hoặt lại");
                    }

                }).catch(function (error) {
                    console.log('Failed to discard the Push Notifications subscrition from server: ' + error);
                });
        }
    };

    function subscribeForPushNotificationsInternal(callbackFnc) {
        var internalCallBackFunc = callbackFnc || function () {
            console.log("ValueChange don't have callback");
        };

        PushNotifications.PushServiceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerPublicKey
        })
            .then(function (pushSubscription) {
                fetch('/subscriptions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pushSubscription)
                })
                    .then(function (response) {
                        if (response.ok) {
                            //console.log('Successfully subscribed for Push Notifications');
                            //PushNotifications.callBackFunc();
                            Site.NotifyFormSuccess("THÔNG BÁO", "Nhận thông báo thành công.");
                            callbackFnc();
                        } else {
                            //console.log('Failed to store the Push Notifications subscrition on server');
                            Site.NotifyFormFailed("THÔNG BÁO", "Nhận thông báo thất bại");
                        }
                    }).catch(function (error) {
                        debugger;
                        console.log('Failed to store the Push Notifications subscrition on server: ' + error);
                        Site.NotifyFormFailed("LỖI", "Không thể nhận thông báo từ server. Có lỗi bất thường xảy ra.");
                    });
            }).catch(function (error) {
                if (Notification.permission === 'denied') {
                    Site.NotifyFormFailed("THÔNG BÁO",
                        "Trình duyệt của bạn đang chặn thông báo vui lòng kích hoặt lại.");
                    //console.log('Failed to subscribe for Push Notifications: denied');
                } else {
                    console.log('Failed to subscribe for Push Notifications: ' + error);
                    Site.NotifyFormFailed("LỖI", "Không thể nhận thông báo từ trình duyệt này.");
                }
            });
    };

    return {
        initialize: function (callbackFunction) {
            if (!'serviceWork' in navigator) {
                console.log('Service Workers are not supported');
                return;
            }

            if (!'PushManager' in window) {
                console.log('Push API not supported');
                return;
            }

            if (!!callbackFunction) {
                registerPushServiceWorker(callbackFunction);
            } else {
                var fc = function () {
                    bindingUiInternal("body");
                };
                registerPushServiceWorker(fc);
            }

            //this.attachSubscribeEvent();
        },

        //attachSubscribeEvent: function () {
        //    for (var i = 0; i < subscribeButtons.length; i++) {
        //        subscribeButtons[i].addEventListener('click', this.subscribeForPushNotifications);
        //    }
        //},

        subscribeForPushNotifications: function (callbackFunc) {
            if (applicationServerPublicKey) {
                subscribeForPushNotificationsInternal(callbackFunc);
            } else {
                return fetch('/public-key')
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
        bindingUi: function (selector) {
            callBackFunc = function () {
                bindingUiInternal(selector);
            };
            this.initialize(callBackFunc);
        },
        checkSubcribeImport: function (selector) {
            checkSubcribeImport(selector);
        },
        unsubscribeFromPushNotifications: function () {
            PushNotifications.PushServiceWorkerRegistration.pushManager.getSubscription()
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

    });