// Grade Endpoints
export async function getGrades(request, env) {
  const url = new URL(request.url);
  const studentId = url.searchParams.get('student_id');
  const semester = url.searchParams.get('semester');
  const year = url.searchParams.get('year');
  
  if (!studentId || !semester || !year) {
    return new Response(JSON.stringify({ error: 'student_id, semester, and year required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Get grades
  const grades = await env.DB.prepare(\`
    SELECT g.*, c.name as course_name, c.code as course_code
    FROM grades g
    JOIN enrollments e ON g.enrollment_id = e.id
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ? AND e.semester = ? AND e.year = ?
    ORDER BY c.code, g.assignment_name
  \`).bind(studentId, semester, year).all();
  
  // Calculate averages
  const courseGrades = {};
  grades.results.forEach(grade => {
    if (!courseGrades[grade.course_code]) {
      courseGrades[grade.course_code] = {
        course_name: grade.course_name,
        course_code: grade.course_code,
        assignments: [],
        total_score: 0,
        max_score: 0
      };
    }
    courseGrades[grade.course_code].assignments.push({
      assignment_name: grade.assignment_name,
      score: grade.score,
      max_score: grade.max_score
    });
    courseGrades[grade.course_code].total_score += (grade.score || 0);
    courseGrades[grade.course_code].max_score += (grade.max_score || 0);
  });
  
  const courseAverages = Object.values(courseGrades).map(course => ({
    ...course,
    average: course.max_score > 0 ? (course.total_score / course.max_score * 100).toFixed(2) : 0
  }));
  
  return new Response(JSON.stringify({
    success: true,
    semester,
    year,
    grades: courseAverages
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
