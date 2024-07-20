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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to your database
const database = firebase.database();

function updatePhase1() {
    const phase1Ref = database.ref('phase1/tds');
    phase1Ref.on('value', (snapshot) => {
        const tds = snapshot.val();
        const circle = document.getElementById('phase1-circle');
        const tdsElement = document.getElementById('phase1-tds');
        tdsElement.textContent = tds + ' ppm';

        if (tds < 500) {
            circle.style.backgroundColor = 'green';
        } else if (tds < 700) {
            circle.style.backgroundColor = 'yellow';
        } else {
            circle.style.backgroundColor = 'red';
        }
    });
}

function updatePhase2() {
    const phase2Ref = database.ref('phase2/tds');
    phase2Ref.on('value', (snapshot) => {
        const tds = snapshot.val();
        const circle = document.getElementById('phase2-circle');
        const tdsElement = document.getElementById('phase2-tds');
        tdsElement.textContent = tds + ' ppm';

        if (tds < 500) {
            circle.style.backgroundColor = 'green';
        } else if (tds < 700) {
            circle.style.backgroundColor = 'yellow';
        } else {
            circle.style.backgroundColor = 'red';
        }
    });
}

function updatePhase3() {
    const phase3Refs = {
        tds: database.ref('phase3/tds'),
        turbidity: database.ref('phase3/turbidity'),
        temperature: database.ref('phase3/temperature'),
        ph: database.ref('phase3/ph')
    };

    phase3Refs.tds.on('value', (snapshot) => {
        const tds = snapshot.val();
        const circle = document.getElementById('phase3-tds-circle');
        const tdsElement = document.getElementById('phase3-tds');
        tdsElement.textContent = tds + ' ppm';

        circle.style.backgroundColor = getColorForTds(tds);
    });

    phase3Refs.turbidity.on('value', (snapshot) => {
        const turbidity = snapshot.val();
        const circle = document.getElementById('phase3-turbidity-circle');
        const turbidityElement = document.getElementById('phase3-turbidity');
        turbidityElement.textContent = turbidity + ' NTU';

        circle.style.backgroundColor = getColorForTds(turbidity);
    });

    phase3Refs.temperature.on('value', (snapshot) => {
        const temp = snapshot.val();
        const circle = document.getElementById('phase3-temp-circle');
        const tempElement = document.getElementById('phase3-temperature');
        tempElement.textContent = temp + '°C';

        if (temp < 25) {
            circle.style.backgroundColor = 'green';
        } else if (temp < 30) {
            circle.style.backgroundColor = 'yellow';
        } else {
            circle.style.backgroundColor = 'red';
        }
    });

    phase3Refs.ph.on('value', (snapshot) => {
        const ph = snapshot.val();
        const circle = document.getElementById('phase3-ph-circle');
        const phElement = document.getElementById('phase3-ph');
        phElement.textContent = ph;

        circle.style.backgroundColor = getColorForTds(ph);
    });
}

function getColorForTds(value) {
    if (value < 500) {
        return 'green';
    } else if (value < 700) {
        return 'yellow';
    } else {
        return 'red';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updatePhase1();
    updatePhase2();
    updatePhase3();
});
