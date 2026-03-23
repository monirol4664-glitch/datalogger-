// CONFIGURATION
const WORKER_URL = "https://lively-field-f91e.monirol4664.workers.dev";

document.addEventListener('DOMContentLoaded', async () => {
    // 1. LINK CHECK: Did app.js save our session?
    const studentId = localStorage.getItem('student_id');
    const studentName = localStorage.getItem('student_name');

    if (!studentId) {
        // Kick back to login if no ID is found
        window.location.href = 'index.html';
        return;
    }

    // 2. UI SYNC
    document.getElementById('student-name').textContent = studentName.toUpperCase();
    document.getElementById('user-display').textContent = `ID: NOVA-${studentId.padStart(4, '0')}`;

    // 3. DATA FETCHING
    fetchPortalData();
});

async function fetchPortalData() {
    try {
        // Parallel fetch for speed
        const [courseRes, researchRes] = await Promise.all([
            fetch(`${WORKER_URL}/api/courses`),
            fetch(`${WORKER_URL}/api/research`)
        ]);

        const courses = await courseRes.json();
        const research = await researchRes.json();

        // Render Courses
        const courseGrid = document.getElementById('course-grid');
        courseGrid.innerHTML = courses.map(c => `
            <li>${c.course_code}: ${c.course_name.toUpperCase()} — ${c.grade}</li>
        `).join('');

        // Render Research
        const researchList = document.getElementById('research-list');
        researchList.innerHTML = research.map((r, i) => `
            <div class="item">
                <span>0${i + 1}</span> ${r.title.toUpperCase()} — [${r.status}]
            </div>
        `).join('');

    } catch (err) {
        console.error("Data sync failed:", err);
    }
}

// 4. LOGOUT (Clears the link created by app.js)
window.logout = function() {
    localStorage.clear();
    window.location.href = 'index.html';
};
