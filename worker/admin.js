// Admin Endpoints
export async function createCourse(request, env) {
  const body = await request.json();
  const { code, name, description, credits, teacher_id } = body;
  
  if (!code || !name || !teacher_id) {
    return createErrorResponse(new Error('code, name, and teacher_id required'), 400);
  }
  
  const result = await env.DB.prepare(
    'INSERT INTO courses (code, name, description, credits, teacher_id) VALUES (?, ?, ?, ?, ?)'
  ).bind(code, name, description || null, credits || 3, teacher_id).run();
  
  if (!result.success) {
    return createErrorResponse(new Error('Failed to create course'), 500);
  }
  
  return createSuccessResponse({
    course: {
      id: result.meta.last_row_id,
      code,
      name,
      description,
      credits
    }
  }, 201);
}

export async function createAssignment(request, env) {
  const body = await request.json();
  const { course_id, title, description, due_date, max_score } = body;
  
  if (!course_id || !title || !max_score) {
    return createErrorResponse(new Error('course_id, title, and max_score required'), 400);
  }
  
  const result = await env.DB.prepare(
    'INSERT INTO assignments (course_id, title, description, due_date, max_score) VALUES (?, ?, ?, ?, ?)'
  ).bind(course_id, title, description || null, due_date || null, max_score).run();
  
  if (!result.success) {
    return createErrorResponse(new Error('Failed to create assignment'), 500);
  }
  
  return createSuccessResponse({
    assignment: {
      id: result.meta.last_row_id,
      course_id,
      title,
      max_score
    }
  }, 201);
}

export async function createAnnouncement(request, env) {
  const body = await request.json();
  const { title, content, course_id, created_by } = body;
  
  if (!title || !content || !created_by) {
    return createErrorResponse(new Error('title, content, and created_by required'), 400);
  }
  
  const result = await env.DB.prepare(
    'INSERT INTO announcements (title, content, course_id, created_by, is_pinned) VALUES (?, ?, ?, ?, ?)'
  ).bind(title, content, course_id || null, created_by, false).run();
  
  if (!result.success) {
    return createErrorResponse(new Error('Failed to create announcement'), 500);
  }
  
  return createSuccessResponse({
    announcement: {
      id: result.meta.last_row_id,
      title,
      content
    }
  }, 201);
}

export async function enrollStudent(request, env) {
  const body = await request.json();
  const { student_id, course_id, semester, year } = body;
  
  if (!student_id || !course_id || !semester || !year) {
    return createErrorResponse(new Error('student_id, course_id, semester, and year required'), 400);
  }
  
  // Check if already enrolled
  const existing = await env.DB.prepare(\`
    SELECT * FROM enrollments WHERE student_id = ? AND course_id = ? AND semester = ? AND year = ?
  \`).bind(student_id, course_id, semester, year).first();
  
  if (existing) {
    return createErrorResponse(new Error('Student already enrolled in this course for this semester'), 400);
  }
  
  const result = await env.DB.prepare(
    'INSERT INTO enrollments (student_id, course_id, semester, year) VALUES (?, ?, ?, ?)'
  ).bind(student_id, course_id, semester, year).run();
  
  if (!result.success) {
    return createErrorResponse(new Error('Failed to enroll student'), 500);
  }
  
  return createSuccessResponse({
    enrollment: {
      id: result.meta.last_row_id,
      student_id,
      course_id,
      semester,
      year
    }
  }, 201);
}

export async function updateGrade(request, env) {
  const { enrollment_id, assignment_name, score, graded_at } = await request.json();
  
  if (!enrollment_id || !assignment_name) {
    return createErrorResponse(new Error('enrollment_id and assignment_name required'), 400);
  }
  
  // Check if grade exists
  const existing = await env.DB.prepare(
    'SELECT * FROM grades WHERE enrollment_id = ? AND assignment_name = ?'
  ).bind(enrollment_id, assignment_name).first();
  
  if (existing) {
    // Update existing grade
    const result = await env.DB.prepare(
      'UPDATE grades SET score = ?, graded_at = ? WHERE enrollment_id = ? AND assignment_name = ?'
    ).bind(score || null, graded_at || new Date().toISOString(), enrollment_id, assignment_name).run();
    
    if (!result.success) {
      return createErrorResponse(new Error('Failed to update grade'), 500);
    }
  } else {
    // Create new grade
    const result = await env.DB.prepare(
      'INSERT INTO grades (enrollment_id, assignment_name, score, graded_at) VALUES (?, ?, ?, ?)'
    ).bind(enrollment_id, assignment_name, score || null, graded_at || new Date().toISOString()).run();
    
    if (!result.success) {
      return createErrorResponse(new Error('Failed to create grade'), 500);
    }
  }
  
  return createSuccessResponse({ message: 'Grade updated successfully' });
}

export async function listAllUsers(request, env) {
  const users = await env.DB.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  
  return createSuccessResponse({
    users: users.results || []
  });
}

export async function listAllCourses(request, env) {
  const courses = await env.DB.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
  
  return createSuccessResponse({
    courses: courses.results || []
  });
}

export async function listAllEnrollments(request, env) {
  const enrollments = await env.DB.prepare('SELECT * FROM enrollments ORDER BY created_at DESC').all();
  
  return createSuccessResponse({
    enrollments: enrollments.results || []
  });
}
