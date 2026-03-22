// Authentication Endpoints
export async function handleLogin(request, env) {
  const body = await request.json();
  const { email, password } = body;
  
  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Verify user exists and password is correct
  const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Verify password (in production, use proper password verification)
  const passwordMatch = password === user.password_hash; // Simple check for demo
  
  if (!passwordMatch) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Return user data (without password)
  const { password_hash, ...userWithoutPassword } = user;
  
  return new Response(JSON.stringify({
    success: true,
    user: userWithoutPassword,
    token: 'demo-token-' + user.id // In production, use JWT
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleRegister(request, env) {
  const body = await request.json();
  const { email, password, first_name, last_name, role, student_id } = body;
  
  if (!email || !password || !first_name || !last_name || !role) {
    return new Response(JSON.stringify({ error: 'All fields required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Check if user already exists
  const existing = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  
  if (existing) {
    return new Response(JSON.stringify({ error: 'User already exists' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Hash password
  const password_hash = password; // In production, use bcrypt
  
  // Insert user
  const result = await env.DB.prepare(
    'INSERT INTO users (email, password_hash, first_name, last_name, role, student_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(email, password_hash, first_name, last_name, role, student_id || null).run();
  
  if (!result.success) {
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return new Response(JSON.stringify({
    success: true,
    message: 'User created successfully',
    userId: result.meta.last_row_id
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
