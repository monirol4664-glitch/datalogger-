// Announcement Endpoints
export async function getAnnouncements(request, env) {
  const url = new URL(request.url);
  const courseId = url.searchParams.get('course_id');
  
  // Get pinned announcements first
  const pinned = courseId
    ? await env.DB.prepare(\`
        SELECT a.*, u.first_name as author_first_name, u.last_name as author_last_name
        FROM announcements a
        JOIN users u ON a.created_by = u.id
        WHERE a.course_id = ? AND a.is_pinned = 1
        ORDER BY a.created_at DESC
      \`).bind(courseId).all()
    : { results: [] };
  
  // Get recent general announcements
  const general = courseId
    ? await env.DB.prepare(\`
        SELECT a.*, u.first_name as author_first_name, u.last_name as author_last_name
        FROM announcements a
        JOIN users u ON a.created_by = u.id
        WHERE a.course_id IS NULL OR a.course_id = ?
        ORDER BY a.is_pinned DESC, a.created_at DESC
        LIMIT 10
      \`).bind(courseId).all()
    : { results: [] };
  
  return new Response(JSON.stringify({
    success: true,
    pinned: pinned.results || [],
    general: general.results || []
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
