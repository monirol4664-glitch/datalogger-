export const dbService = {
  // Get all available courses
  async getAllCourses(db) {
    const { results } = await db.prepare("SELECT * FROM courses").all();
    return results;
  },

  // Get student info by ID
  async getStudent(db, id) {
    return await db.prepare("SELECT * FROM students WHERE id = ?").bind(id).first();
  },

  // Add a new enrollment
  async enroll(db, studentId, courseId) {
    return await db.prepare(
      "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)"
    ).bind(studentId, courseId).run();
  }
};
