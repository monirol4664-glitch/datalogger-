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
    const studentId = localStorage.getItem('student_id');

    try {
        // Send the ID as a "query parameter" (?id=1)
        const [courseRes, researchRes] = await Promise.all([
            fetch(`${WORKER_URL}/api/courses?id=${studentId}`),
            fetch(`${WORKER_URL}/api/research?id=${studentId}`)
        ]);

        const courses = await courseRes.json();
        const research = await researchRes.json();

        // Render logic remains the same...
        const courseGrid = document.getElementById('course-grid');
        courseGrid.innerHTML = courses.length > 0 
            ? courses.map(c => `<li>${c.course_code}: ${c.course_name.toUpperCase()} — ${c.grade}</li>`).join('')
            : `<li>NO COURSES ENROLLED</li>`;

        const researchList = document.getElementById('research-list');
        researchList.innerHTML = research.length > 0
            ? research.map((r, i) => `<div class="item"><span>0${i + 1}</span> ${r.title.toUpperCase()} — [${r.status}]</div>`).join('')
            : `<div class="item">NO ACTIVE RESEARCH</div>`;

    } catch (err) {
        console.error("Data sync failed:", err);
    }
}

// 4. LOGOUT (Clears the link created by app.js)
window.logout = function() {
    localStorage.clear();
    window.location.href = 'index.html';
};
