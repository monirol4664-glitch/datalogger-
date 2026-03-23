const API_URL = "https://lively-field-f91e.monirol4664.workers.dev";

document.getElementById('portal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.token) {
        alert('Welcome to Nova Institute');
        // Redirect to dashboard.html
    } else {
        alert('Login Failed');
    }
});
