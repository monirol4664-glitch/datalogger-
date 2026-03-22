// Assignment Endpoints
export async function getAssignments(request, env) {
  const url = new URL(request.url);
  const courseId = url.searchParams.get('course_id');
  
  if (!courseId) {
    return new Response(JSON.stringify({ error: 'course_id required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Get assignments for this course
  const assignments = await env.DB.prepare(
    'SELECT * FROM assignments WHERE course_id = ? ORDER BY due_date'
  ).bind(courseId).all();
  
  return new Response(JSON.stringify({
    success: true,
    assignments: assignments.results || []
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
