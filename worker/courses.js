// Course Endpoints
export async function getCourses(request, env) {
  const url = new URL(request.url);
  const studentId = url.searchParams.get('student_id');
  
  if (!studentId) {
    return new Response(JSON.stringify({ error: 'student_id required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Get current semester and year
  const now = new Date();
  const semester = now.getMonth() < 6 ? 'Spring' : 'Fall';
  const year = now.getFullYear();
  
  // Get enrolled courses
  const courses = await env.DB.prepare(\`
    SELECT c.*, u.first_name as teacher_first_name, u.last_name as teacher_last_name
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    JOIN users u ON c.teacher_id = u.id
    WHERE e.student_id = ? AND e.semester = ? AND e.year = ?
  \`).bind(studentId, semester, year).all();
  
  return new Response(JSON.stringify({
    success: true,
    semester,
    year,
    courses: courses.results || []
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
