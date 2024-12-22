// Your web app's Firebase configuration
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

function updatePhase1() {
    const phase1Ref = database.ref('phase1/tds');
    phase1Ref.on('value', (snapshot) => {
        const tds = snapshot.val();
        const circle = document.getElementById('phase1-circle');
        const tdsElement = document.getElementById('phase1-tds');
        tdsElement.textContent = tds + ' ppm';

        updateProgressCircle(circle, tds, 1000, 'tds');
    });
}

function updatePhase2() {
    const phase2Ref = database.ref('phase2/tds');
    phase2Ref.on('value', (snapshot) => {
        const tds = snapshot.val();
        const circle = document.getElementById('phase2-circle');
        const tdsElement = document.getElementById('phase2-tds');
        tdsElement.textContent = tds + ' ppm';

        updateProgressCircle(circle, tds, 1000, 'tds');
    });
}

function updatePhase3() {
    const phase3Refs = {
        tds: database.ref('phase3/tds'),
        turbidity: database.ref('phase3/turbidity'),
        temperature: database.ref('phase3/temperature'),
        ph: database.ref('phase3/pH')
    };

    phase3Refs.tds.on('value', (snapshot) => {
        const tds = snapshot.val();
        const circle = document.getElementById('phase3-tds-circle');
        const tdsElement = document.getElementById('phase3-tds');
        tdsElement.textContent = tds + ' ppm';

        updateProgressCircle(circle, tds, 1000, 'tds');
    });

    phase3Refs.turbidity.on('value', (snapshot) => {
        const turbidity = snapshot.val();
        const circle = document.getElementById('phase3-turbidity-circle');
        const turbidityElement = document.getElementById('phase3-turbidity');
        turbidityElement.textContent = turbidity + ' NTU';

        updateProgressCircle(circle, turbidity, 100, 'turbidity');
    });

    phase3Refs.temperature.on('value', (snapshot) => {
        const temp = snapshot.val();
        const circle = document.getElementById('phase3-temp-circle');
        const tempElement = document.getElementById('phase3-temperature');
        tempElement.textContent = temp + '°C';

        updateProgressCircle(circle, temp, 50, 'temperature');
    });

    phase3Refs.ph.on('value', (snapshot) => {
        const ph = snapshot.val();
        const circle = document.getElementById('phase3-ph-circle');
        const phElement = document.getElementById('phase3-ph');
        phElement.textContent = ph;

        updateProgressCircle(circle, ph, 14, 'ph');
    });
}

function updateProgressCircle(circle, value, max, type) {
    const percentage = Math.min(Math.max(value, 0), max) / max * 100;

    let color;
    switch (type) {
        case 'tds':
            color = value < 500 ? 'green' : value < 700 ? 'yellow' : 'red';
            break;
        case 'ph':
            color = value < 7 ? 'green' : value < 9 ? 'yellow' : 'red';
            break;
        case 'turbidity':
            color = value < 50 ? 'green' : 'yellow';
            break;
        case 'temperature':
            color = 'green'; // Always green for temperature
            break;
        default:
            color = '#ddd'; // Default color if type is unknown
    }

    circle.style.background = `conic-gradient(${color} ${percentage}%, #ddd ${percentage}%)`;
}

document.addEventListener('DOMContentLoaded', () => {
    updatePhase1();
    updatePhase2();
    updatePhase3();
});