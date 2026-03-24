// CONFIGURATION
const WORKER_URL = "https://lively-field-f91e.monirol4664.workers.dev";

// 1. TAB SWITCHING LOGIC
window.switchTab = function(mode) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('reg-form');
    const loginBtn = document.getElementById('tab-login');
    const regBtn = document.getElementById('tab-reg');

    if (mode === 'register') {
        // Switch Classes for Animation
        loginForm.classList.remove('form-active');
        loginForm.classList.add('form-hidden');
        
        // Wait a tiny bit to show the next one for a "layered" effect
        setTimeout(() => {
            regForm.style.display = 'block'; // Ensure it exists in DOM
            regForm.classList.remove('form-hidden');
            regForm.classList.add('form-active');
            loginForm.style.display = 'none';
        }, 200);

        regBtn.classList.add('active');
        loginBtn.classList.remove('active');
    } else {
        regForm.classList.remove('form-active');
        regForm.classList.add('form-hidden');
        
        setTimeout(() => {
            loginForm.style.display = 'block';
            loginForm.classList.remove('form-hidden');
            loginForm.classList.add('form-active');
            regForm.style.display = 'none';
        }, 200);

        loginBtn.classList.add('active');
        regBtn.classList.remove('active');
    }
};

// 2. LOGIN HANDLER
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    
    // Start Loading
    btn.classList.add('loading');
    btn.disabled = true;

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${WORKER_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.user) {
            localStorage.setItem('student_id', data.user.id);
            localStorage.setItem('student_name', data.user.full_name);
            window.location.href = 'dashboard.html';
        } else {
            alert(data.error || "Access Denied.");
        }
    } catch (err) {
        alert("Server connection failed.");
    } finally {
        // Stop Loading
        btn.classList.remove('loading');
        btn.disabled = false;
    }
});

        

// 3. REGISTRATION HANDLER
document.getElementById('reg-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const response = await fetch(`${WORKER_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Enrollment Complete. Please login.");
            switchTab('login');
        } else {
            alert(data.error || "Enrollment failed.");
        }
    } catch (err) {
        alert("Server connection failed.");
    }
});
