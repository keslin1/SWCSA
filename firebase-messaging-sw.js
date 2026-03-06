importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCTHkxP-7sH4z1xid_XrSVwlhXAbWz9Tck",
    authDomain: "swcsa-f93bf.firebaseapp.com",
    projectId: "swcsa-f93bf",
    storageBucket: "swcsa-f93bf.firebasestorage.app",
    messagingSenderId: "1095568817559",
    appId: "1:1095568817559:web:2b295f1b2cb2a57d1118d2"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// --- AJOUT POUR L'INSTALLATION ---
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installé');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activé');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
// ---------------------------------

messaging.onBackgroundMessage(function(payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'SWCSA.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});


