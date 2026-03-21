// worker.js - Cloudflare Worker for University Portal
// Features: Student signup, login, result viewing, admin result management
// Admin credentials are set manually in the database via SQL

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers for development (adjust for production)
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Initialize database tables if not exists
    await initDatabase(env);

    // API Routes
    // Student Signup
    if (path === '/api/auth/signup' && method === 'POST') {
      return handleStudentSignup(request, env, corsHeaders);
    }
    
    // Student Login
    if (path === '/api/auth/login' && method === 'POST') {
      return handleStudentLogin(request, env, corsHeaders);
    }
    
    // Get Student Results (Protected)
    if (path === '/api/student/results' && method === 'GET') {
      return handleGetStudentResults(request, env, corsHeaders);
    }
    
    // Admin Login
    if (path === '/api/admin/login' && method === 'POST') {
      return handleAdminLogin(request, env, corsHeaders);
    }
    
    // Admin: Get all students
    if (path === '/api/admin/students' && method === 'GET') {
      return handleGetAllStudents(request, env, corsHeaders);
    }
    
    // Admin: Get all results
    if (path === '/api/admin/all-results' && method === 'GET') {
      return handleGetAllResults(request, env, corsHeaders);
    }
    
    // Admin: Update/Create result
    if (path === '/api/admin/update-result' && method === 'POST') {
      return handleUpdateResult(request, env, corsHeaders);
    }

    // Serve the HTML frontend
    if (path === '/' || path === '/index.html') {
      return serveFrontend(env);
    }

    // 404
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

// Initialize D1 database tables
async function initDatabase(env) {
  try {
    // Create students table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Create results table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_email TEXT NOT NULL,
        course TEXT NOT NULL,
        marks INTEGER,
        grade TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE,
        UNIQUE(student_email, course)
      )
    `).run();

    // Create admin table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Check if default admin exists, if not create one
    // IMPORTANT: Change these credentials in production!
    const adminExists = await env.DB.prepare('SELECT id FROM admins WHERE email = ?').bind('admin@university.edu').first();
    if (!adminExists) {
      // Default password: Admin@123 (hashed with simple hash - use bcrypt in production)
      const simpleHash = await hashPassword('Admin@123');
      await env.DB.prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)')
        .bind('admin@university.edu', simpleHash)
        .run();
    }

  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Simple password hashing (for demo - use bcrypt in production)
async function hashPassword(password) {
  // Simple hash for demo purposes
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'university-salt-2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password, hash) {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
}

// Generate JWT-like token (simple for demo - use proper JWT in production)
function generateToken(email, role) {
  const payload = { email, role, exp: Date.now() + 24 * 60 * 60 * 1000 };
  const payloadBase64 = btoa(JSON.stringify(payload));
  return payloadBase64;
}

function verifyToken(token) {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// Student Signup Handler
async function handleStudentSignup(request, env, corsHeaders) {
  try {
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check if email already exists
    const existing = await env.DB.prepare('SELECT email FROM students WHERE email = ?').bind(email).first();
    if (existing) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const passwordHash = await hashPassword(password);
    await env.DB.prepare('INSERT INTO students (name, email, password_hash) VALUES (?, ?, ?)')
      .bind(name, email, passwordHash)
      .run();

    return new Response(JSON.stringify({ message: 'Student registered successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Student Login Handler
async function handleStudentLogin(request, env, corsHeaders) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const student = await env.DB.prepare('SELECT * FROM students WHERE email = ?').bind(email).first();
    
    if (!student || !(await verifyPassword(password, student.password_hash))) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const token = generateToken(student.email, 'student');
    
    return new Response(JSON.stringify({ 
      token, 
      user: { name: student.name, email: student.email } 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Get Student Results (Protected)
async function handleGetStudentResults(request, env, corsHeaders) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'student') {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const results = await env.DB.prepare('SELECT course, marks, grade, updated_at FROM results WHERE student_email = ? ORDER BY course')
      .bind(payload.email)
      .all();

    return new Response(JSON.stringify({ results: results.results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Admin Login Handler
async function handleAdminLogin(request, env, corsHeaders) {
  try {
    const { email, password } = await request.json();
    
    const admin = await env.DB.prepare('SELECT * FROM admins WHERE email = ?').bind(email).first();
    
    if (!admin || !(await verifyPassword(password, admin.password_hash))) {
      return new Response(JSON.stringify({ error: 'Invalid admin credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const token = generateToken(admin.email, 'admin');
    
    return new Response(JSON.stringify({ token, admin: { email: admin.email } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Get all students (Admin only)
async function handleGetAllStudents(request, env, corsHeaders) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const students = await env.DB.prepare('SELECT id, name, email, created_at FROM students ORDER BY name').all();
    
    return new Response(JSON.stringify({ students: students.results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Get all results for admin view
async function handleGetAllResults(request, env, corsHeaders) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const allResults = await env.DB.prepare(`
      SELECT s.email, s.name, r.course, r.marks, r.grade 
      FROM students s 
      LEFT JOIN results r ON s.email = r.student_email 
      ORDER BY s.email, r.course
    `).all();
    
    // Group results by student email
    const groupedResults = {};
    for (const row of allResults.results) {
      if (!groupedResults[row.email]) {
        groupedResults[row.email] = [];
      }
      if (row.course) { // Only add if there's a result
        groupedResults[row.email].push({
          course: row.course,
          marks: row.marks,
          grade: row.grade
        });
      }
    }
    
    return new Response(JSON.stringify({ allResults: groupedResults }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Update or create result (Admin only)
async function handleUpdateResult(request, env, corsHeaders) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { studentEmail, course, marks, grade } = await request.json();
    
    if (!studentEmail || !course) {
      return new Response(JSON.stringify({ error: 'Student email and course required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check if student exists
    const student = await env.DB.prepare('SELECT email FROM students WHERE email = ?').bind(studentEmail).first();
    if (!student) {
      return new Response(JSON.stringify({ error: 'Student not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Upsert result
    await env.DB.prepare(`
      INSERT INTO results (student_email, course, marks, grade, updated_at) 
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(student_email, course) 
      DO UPDATE SET marks = ?, grade = ?, updated_at = CURRENT_TIMESTAMP
    `).bind(studentEmail, course, marks || null, grade || null, marks || null, grade || null).run();

    return new Response(JSON.stringify({ message: 'Result updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Serve the HTML frontend
async function serveFrontend(env) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>University Portal</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 20px; padding: 30px; margin-bottom: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 10px; }
        h2 { color: #555; margin-bottom: 20px; font-size: 1.5rem; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e0e0e0; }
        .tab { padding: 10px 20px; cursor: pointer; border: none; background: none; font-size: 16px; font-weight: 500; color: #666; transition: all 0.3s; }
        .tab.active { color: #667eea; border-bottom: 2px solid #667eea; margin-bottom: -2px; }
        .tab-content { display: none; }
        .tab-content.active { display: block; animation: fadeIn 0.3s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; color: #555; font-weight: 500; }
        input, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
        button { background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s; }
        button:hover { background: #5a67d8; transform: translateY(-2px); }
        .btn-danger { background: #e53e3e; }
        .btn-danger:hover { background: #c53030; }
        .message { padding: 10px; border-radius: 8px; margin-top: 10px; display: none; }
        .message.success { background: #c6f6d5; color: #22543d; display: block; }
        .message.error { background: #fed7d7; color: #742a2a; display: block; }
        .message.info { background: #bee3f8; color: #2c5282; display: block; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
        th { background: #f7f7f7; font-weight: 600; color: #555; }
        .results-area { margin-top: 20px; display: none; }
        .flex { display: flex; gap: 20px; flex-wrap: wrap; }
        .flex > div { flex: 1; min-width: 250px; }
        .admin-section { margin-top: 20px; }
        .student-list { max-height: 400px; overflow-y: auto; }
        @media (max-width: 768px) { .flex { flex-direction: column; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>🎓 University Academic Portal</h1>
            <p>Student signup, login, result viewing | Admin result management</p>
        </div>

        <div class="card">
            <div class="tabs">
                <button class="tab active" onclick="switchTab('student')">👩‍🎓 Student Area</button>
                <button class="tab" onclick="switchTab('admin')">🔐 Admin Console</button>
            </div>

            <!-- Student Tab -->
            <div id="studentTab" class="tab-content active">
                <div class="flex">
                    <div>
                        <h2>📝 Student Signup</h2>
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="signupName" placeholder="John Doe">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="signupEmail" placeholder="student@university.edu">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="signupPassword" placeholder="********">
                        </div>
                        <button onclick="studentSignup()">Create Account</button>
                        <div id="signupMsg" class="message"></div>
                    </div>
                    <div>
                        <h2>🔑 Student Login</h2>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="loginEmail" placeholder="student@university.edu">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password"id="loginEmail" placeholder="student@university.edu">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="loginPassword" placeholder="********">
                        </div>
                        <button onclick="studentLogin()">Login</button>
                        <div id="loginMsg" class="message"></div>
                    </div>
                </div>

                <div id="resultsArea" class="results-area">
                    <hr style="margin: 20px 0;">
                    <h2>📊 My Results</h2>
                    <div id="resultsContainer"></div>
                    <button onclick="studentLogout()" class="btn-danger" style="margin-top: 15px;">🚪 Logout</button>
                </div>
            </div>

            <!-- Admin Tab -->
            <div id="adminTab" class="tab-content">
                <div id="adminLoginForm">
                    <h2>🛡️ Admin Login</h2>
                    <div class="form-group">
                        <label>Admin Email</label>
                        <input type="text" id="adminEmail" placeholder="admin@university.edu">
                    </div>
                    <div class="form-group">
                        <label>Admin Password</label>
                        <input type="password" id="adminPassword" placeholder="********">
                    </div>
                    <button onclick="adminLogin()">Login as Admin</button>
                    <div id="adminLoginMsg" class="message"></div>
                </div>

                <div id="adminDashboard" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2>👑 Admin Dashboard</h2>
                        <button onclick="adminLogout()" class="btn-danger">Logout</button>
                    </div>
                    
                    <div class="flex">
                        <div>
                            <h3>✏️ Edit Student Results</h3>
                            <div class="form-group">
                                <label>Select Student</label>
                                <select id="studentSelect"></select>
                            </div>
                            <div class="form-group">
                                <label>Course</label>
                                <input type="text" id="editCourse" placeholder="Mathematics" value="Mathematics">
                            </div>
                            <div class="form-group">
                                <label>Marks (0-100)</label>
                                <input type="number" id="editMarks" min="0" max="100">
                            </div>
                            <div class="form-group">
                                <label>Grade (optional)</label>
                                <input type="text" id="editGrade" placeholder="Auto-calculated if empty">
                            </div>
                            <button onclick="updateResult()">Update / Add Result</button>
                            <div id="adminEditMsg" class="message"></div>
                        </div>
                        <div>
                            <h3>📋 All Student Results</h3>
                            <div id="allResultsPreview" class="student-list"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentStudentEmail = null;
        let currentAdminToken = null;

        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            if (tab === 'student') {
                document.querySelector('.tab').classList.add('active');
                document.getElementById('studentTab').classList.add('active');
            } else {
                document.querySelectorAll('.tab')[1].classList.add('active');
                document.getElementById('adminTab').classList.add('active');
            }
        }

        async function apiRequest(endpoint, method, body, token = null) {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = ,Bearer, ${token}`;
            const res = await fetch(endpoint, { method, headers, body: body ? JSON.stringify(body) : undefined });
            return await res.json();
        }

        async function studentSignup() {
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const msgDiv = document.getElementById('signupMsg');
            
            if (!name || !email || !password) {
                msgDiv.className = 'message error';
                msgDiv.textContent = 'All fields required';
                return;
            }
            
            const result = await apiRequest('/api/auth/signup', 'POST', { name, email, password });
            if (result.message) {
                msgDiv.className = 'message success';
                msgDiv.textContent = result.message;
                document.getElementById('signupName').value = '';
                document.getElementById('signupEmail').value = '';
                document.getElementById('signupPassword').value = '';
            } else {
                msgDiv.className = 'message error';
                msgDiv.textContent = result.error || 'Signup failed';
            }
        }

        async function studentLogin() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const msgDiv = document.getElementById('loginMsg');
            
            if (!email || !password) {
                msgDiv.className = 'message error';
                msgDiv.textContent = 'Email and password required';
                return;
            }
            
            const result = await apiRequest('/api/auth/login', 'POST', { email, password });
            if (result.token) {
                currentStudentEmail = email;
                localStorage.setItem('studentToken', result.token);
                localStorage.setItem('studentEmail', email);
                msgDiv.className = 'message success';
                msgDiv.textContent = 'Login successful!';
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';
                document.getElementById('resultsArea').style.display = 'block';
                loadStudentResults();
            } else {
                msgDiv.className = 'message error';
                msgDiv.textContent = result.error || 'Login failed';
            }
        }

        async function loadStudentResults() {
            const token = localStorage.getItem('studentToken');
            if (!token) return;
            
            const result = await apiRequest('/api/student/results', 'GET', null, token);
            const container = document.getElementById('resultsContainer');
            
            if (result.results && result.results.length > 0) {
                let html = '<table><thead><tr><th>Course</th><th>Marks</th><th>Grade</th></tr></thead><tbody>';
                result.results.forEach(r => {
                    html += `<tr><td>${escapeHtml(r.course)}</td><td>${r.marks || '-'}</td><td>${r.grade || '-'}</td></tr>`;
                });
                html += '</tbody></table>';
                container.innerHTML = html;
            } else {
                container.innerHTML = '<div class="message info">No results published yet.</div>';
            }
        }

        function studentLogout() {
            currentStudentEmail = null;
            localStorage.removeItem('studentToken');
            localStorage.removeItem('studentEmail');
            document.getElementById('resultsArea').style.display = 'none';
            document.getElementById('resultsContainer').innerHTML = '';
        }

        async function adminLogin() {
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            const msgDiv = document.getElementById('adminLoginMsg');
            
            const result = await apiRequest('/api/admin/login', 'POST', { email, password });
            if (result.token) {
                currentAdminToken = result.token;
                localStorage.setItem('adminToken', result.token);
                document.getElementById('adminLoginForm').style.display = 'none';
                document.getElementById('adminDashboard').style.display = 'block';
                loadAllStudents();
                loadAllResultsPreview();
            } else {
                msgDiv.className = 'message error';
                msgDiv.textContent = result.error || 'Admin login failed';
            }
        }

        async function loadAllStudents() {
            const token = localStorage.getItem('adminToken');
            if (!token) return;
            
            const result = await apiRequest('/api/admin/students', 'GET', null, token);
            const select = document.getElementById('studentSelect');
            select.innerHTML = '<option value="">-- Select student --</option>';
            if (result.students) {
                result.students.forEach(s => {
                    select.innerHTML += `<option value="${escapeHtml(s.email)}">${escapeHtml(s.name)} (${escapeHtml(s.email)})</option>`;
                });
            }
        }

        async function loadAllResultsPreview() {
            const token = localStorage.getItem('adminToken');
            if (!token) return;
            
            const result = await apiRequest('/api/admin/all-results', 'GET', null, token);
            const container = document.getElementById('allResultsPreview');
            
            if (result.allResults && Object.keys(result.allResults).length > 0) {
                let html = '';
                for (const [email, results] of Object.entries(result.allResults)) {
                    html += `<div style="margin-bottom: 15px; padding: 10px; background: #f7f7f7; border-radius: 8px;">`;
                    html += `<strong>${escapeHtml(email)}</strong>`;
                    if (results.length === 0) {
                        html += '<div><em>No results</em></div>';
                    } else {
                        html += '<table style="margin-top: 5px;"><thead><tr><th>Course</th><th>Marks</th><th>Grade</th></tr></thead><tbody>';
                        results.forEach(r => {
                            html += `<tr><td>${escapeHtml(r.course)}</td><td>${r.marks || '-'}</td><td>${r.grade || '-'}</td></tr>`;
                        });
                        html += '</tbody></table>';
                    }
                    html += '</div>';
                }
                container.innerHTML = html;
            } else {
                container.innerHTML = '<div class="message info">No student results yet.</div>';
            }
        }

        async function updateResult() {
            const token = localStorage.getItem('adminToken');
            if (!token) return;
            
            const studentEmail = document.getElementById('studentSelect').value;
            const course = document.getElementById('editCourse').value;
            const marks = parseInt(document.getElementById('editMarks').value);
            const grade = document.getElementById('editGrade').value;
            const msgDiv = document.getElementById('adminEditMsg');
            
            if (!studentEmail) {
                msgDiv.className = 'message error';
                msgDiv.textContent = 'Select a student';
                return;
            }
            if (!course) {
                msgDiv.className = 'message error';
                msgDiv.textContent = 'Course name required';
                return;
            }
            
            const result = await apiRequest('/api/admin/update-result', 'POST', { studentEmail, course, marks, grade }, token);
            if (result.message) {
                msgDiv.className = 'message success';
                msgDiv.textContent = result.message;
                loadAllResultsPreview();
                if (currentStudentEmail === studentEmail) loadStudentResults();
                document.getElementById('editMarks').value = '';
                document.getElementById('editGrade').value = '';
            } else {
                msgDiv.className = 'message error';
                msgDiv.textContent = result.error || 'Update failed';
            }
        }

        function adminLogout() {
            currentAdminToken = null;
            localStorage.removeItem('adminToken');
            document.getElementById('adminLoginForm').style.display = 'block';
            document.getElementById('adminDashboard').style.display = 'none';
            document.getElementById('adminEmail').value = '';
            document.getElementById('adminPassword').value = '';
        }

        function escapeHtml(str) {
            if (!str) return '';
            return str.replace(/[&<>]/g, function(m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
            });
        }

        // Check for existing sessions on load
        const savedStudentToken = localStorage.getItem('studentToken');
        const savedStudentEmail = localStorage.getItem('studentEmail');
        if (savedStudentToken && savedStudentEmail) {
            currentStudentEmail = savedStudentEmail;
            document.getElementById('resultsArea').style.display = 'block';
            loadStudentResults();
        }
        
        const savedAdminToken = localStorage.getItem('adminToken');
        if (savedAdminToken) {
            currentAdminToken = savedAdminToken;
            document.getElementById('adminLoginForm').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            loadAllStudents();
            loadAllResultsPreview();
        }
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });}