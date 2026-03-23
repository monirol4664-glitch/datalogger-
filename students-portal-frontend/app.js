const API_URL = "https://lively-field-f91e.monirol4664.workers.dev";

document.getElementById('portal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.user) {
            // Store user ID in localStorage to fetch their profile on the next page
            localStorage.setItem('student_id', data.user.id);
            localStorage.setItem('student_name', data.user.full_name);
            
            // Redirect to the dashboard file
            window.location.href = 'dashboard.html';
        } else {
            alert(data.error || 'Login failed. Check your credentials.');
        }
    } catch (err) {
        console.error("Connection error:", err);
        alert("Could not connect to Nova Institute servers.");
    }
});
