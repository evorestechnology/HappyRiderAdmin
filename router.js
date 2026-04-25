// 1. Initialize Firebase Globally
const firebaseConfig = {
    apiKey: "AIzaSyB70UjTr_WOYq4OlYmgAJVfCf1oQkEEaeM",
    authDomain: "happy-rider-crew.firebaseapp.com",
    projectId: "happy-rider-crew",
    storageBucket: "happy-rider-crew.firebasestorage.app",
    messagingSenderId: "403395081239",
    appId: "1:403395081239:web:9ee0af1fce47cb28969852"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); 

// 2. Navigation Logic
async function loadPage(pageName, element) {
    const contentDiv = document.getElementById('main-content');
    const titleHeader = document.getElementById('current-title');

    try {
        const response = await fetch(`pages/${pageName}.html`);
        const html = await response.text();
        contentDiv.innerHTML = html;

        // CRITICAL: Manually execute scripts in the fetched HTML
        const scripts = contentDiv.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            newScript.text = oldScript.text;
            document.head.appendChild(newScript).parentNode.removeChild(newScript);
        });

        if (element) {
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            element.classList.add('active');
            titleHeader.innerText = element.querySelector('.menu-text').innerText;
        }
    } catch (e) {
        contentDiv.innerHTML = `<div class="card"><h2>Error</h2><p>Could not load ${pageName}.</p></div>`;
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('closed');
}

function handleLogout() {
    // Show a confirmation dialog to the user
    const confirmLogout = confirm("Are you sure you want to log out?");

    // Only proceed if the user clicked "OK"
    if (confirmLogout) {
        localStorage.removeItem('activeAdmin');
        window.location.href = 'index.html';
    }
}

// 3. Security & Init
document.addEventListener('DOMContentLoaded', () => {
    const admin = localStorage.getItem('activeAdmin');
    if (!admin) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('admin-name-text').innerText = admin;
        loadPage('dashboard', document.querySelector('.menu-item.active'));
    }
});