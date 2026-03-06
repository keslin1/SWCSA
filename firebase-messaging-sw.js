importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCck9CMGV8d-yww7kW_Uix6Z7HWM_xrxww",
    authDomain: "swcsa-f93bf.firebaseapp.com",
    projectId: "swcsa-f93bf",
    storageBucket: "swcsa-f93bf.firebasestorage.app",
    messagingSenderId: "1095568817559",
    appId: "1:1095568817559:android:70818c584c66cba71118d2"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// --- AJOUT POUR L'INSTALLATION ---
// Événement d'installation
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installé');
    self.skipWaiting();
});

// Événement d'activation
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activé');
});

// IMPORTANT : Le navigateur exige cet événement "fetch" pour permettre l'installation
self.addEventListener('fetch', (event) => {
    // On laisse les requêtes passer normalement
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


