document.addEventListener('DOMContentLoaded', async () => {
    const studentName = localStorage.getItem('student_name');
    if (studentName) {
        document.getElementById('student-name').textContent = studentName.toUpperCase();
    }

    // Load Courses
    const courseRes = await fetch(`${WORKER_URL}/api/courses`);
    const courses = await courseRes.json();
    const courseList = document.querySelector('.course-grid');
    courseList.innerHTML = ''; // Clear placeholders

    courses.forEach(c => {
        courseList.innerHTML += `<li>${c.course_name.toUpperCase()} — ${c.grade}</li>`;
    });

    // Load Research
    const researchRes = await fetch(`${WORKER_URL}/api/research`);
    const research = await researchRes.json();
    const researchList = document.getElementById('research-list');
    researchList.innerHTML = '';

    research.forEach((r, index) => {
        researchList.innerHTML += `
            <div class="item">
                <span>0${index + 1}</span> ${r.title} — [${r.status}]
            </div>`;
    });
});
