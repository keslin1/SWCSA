importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Configuration Firebase (identique à ton index.html)
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

// Gestion des messages quand l'application est en arrière-plan
messaging.onBackgroundMessage(function(payload) {
    console.log('Message reçu en arrière-plan: ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'SWCSA.jpg' // Utilise ton logo pour la notification
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});


