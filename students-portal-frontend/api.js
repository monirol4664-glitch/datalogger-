const API_BASE_URL = 'https://lively-field-f91e.monirol4664.workers.dev';

export async function register(data) {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function login(data) {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function getCourses(studentId) {
  const response = await fetch(`${API_BASE_URL}/api/courses?student_id=${studentId}`);
  return response.json();
}

export async function getGrades(studentId, semester, year) {
  const response = await fetch(
    `${API_BASE_URL}/api/grades?student_id=${studentId}&semester=${semester}&year=${year}`
  );
  return response.json();
}

export async function getAssignments(courseId) {
  const response = await fetch(`${API_BASE_URL}/api/assignments?course_id=${courseId}`);
  return response.json();
}

export async function getAnnouncements(courseId) {
  const response = await fetch(`${API_BASE_URL}/api/announcements?course_id=${courseId}`);
  return response.json();
}
