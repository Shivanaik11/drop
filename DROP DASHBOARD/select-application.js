// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBaUvbBYEV9897Qz9iYDLub1ZqquPETC9Q",
    authDomain: "drop-dashboard-76b93.firebaseapp.com",
    databaseURL: "https://drop-dashboard-76b93-default-rtdb.firebaseio.com",
    projectId: "drop-dashboard-76b93",
    storageBucket: "drop-dashboard-76b93.appspot.com",
    messagingSenderId: "380530955259",
    appId: "1:380530955259:web:c378bd1551769ba782b15e",
    measurementId: "G-F2S3YZTD8Z"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get the "Start" button and the application dropdown
const startButton = document.getElementById('start-btn');
const applicationSelect = document.getElementById('application');

// When the start button is clicked, update Firebase with the selected application
startButton.addEventListener('click', () => {
    const selectedApp = applicationSelect.value;
    const appRef = database.ref('solenoidControl');
    appRef.set(selectedApp).then(() => {
        alert('Application has been selected and sent to DataBase!');
        window.location.href = 'index.html';  // Redirect back to the dashboard
    }).catch((error) => {
        console.error('Error saving application: ', error);
    });
});
