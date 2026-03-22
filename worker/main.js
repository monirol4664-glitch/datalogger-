// Student Portal API - Entry Point
import { handleLogin } from './auth.js';
import { handleRegister } from './auth.js';
import { getCourses } from './courses.js';
import { getGrades } from './grades.js';
import { getAssignments } from './assignments.js';
import { getAnnouncements } from './announcements.js';
import { createCourse } from './admin.js';
import { createAssignment } from './admin.js';
import { createAnnouncement } from './admin.js';
import { enrollStudent } from './admin.js';
import { updateGrade } from './admin.js';
import { listAllUsers } from './admin.js';
import { listAllCourses } from './admin.js';
import { listAllEnrollments } from './admin.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    try {
      // Route handlers
      // Auth endpoints
      if (path === '/api/login' && method === 'POST') {
        return await handleLogin(request, env);
      }
      
      if (path === '/api/register' && method === 'POST') {
        return await handleRegister(request, env);
      }
      
      // Student endpoints
      if (path === '/api/courses' && method === 'GET') {
        return await getCourses(request, env);
      }
      
      if (path === '/api/grades' && method === 'GET') {
        return await getGrades(request, env);
      }
      
      if (path === '/api/assignments' && method === 'GET') {
        return await getAssignments(request, env);
      }
      
      if (path === '/api/announcements' && method === 'GET') {
        return await getAnnouncements(request, env);
      }
      
      // Admin endpoints
      if (path === '/api/admin/courses' && method === 'POST') {
        return await createCourse(request, env);
      }
      
      if (path === '/api/admin/assignments' && method === 'POST') {
        return await createAssignment(request, env);
      }
      
      if (path === '/api/admin/announcements' && method === 'POST') {
        return await createAnnouncement(request, env);
      }
      
      if (path === '/api/admin/enroll' && method === 'POST') {
        return await enrollStudent(request, env);
      }
      
      if (path === '/api/admin/grades' && method === 'POST') {
        return await updateGrade(request, env);
      }
      
      if (path === '/api/admin/users' && method === 'GET') {
        return await listAllUsers(request, env);
      }
      
      if (path === '/api/admin/courses' && method === 'GET') {
        return await listAllCourses(request, env);
      }
      
      if (path === '/api/admin/enrollments' && method === 'GET') {
        return await listAllEnrollments(request, env);
      }
      
      // Not found
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
};
