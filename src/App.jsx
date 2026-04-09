import React, { useState, useEffect } from 'react';

function App() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contact, setContact] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your actual Worker URL
  const WORKER_URL = 'https://your-worker-name.your-subdomain.workers.dev';

  // Test if worker is reachable
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing connection to:', WORKER_URL);
        const response = await fetch(`${WORKER_URL}/api/projects`);
        if (response.ok) {
          const data = await response.json();
          console.log('Connected! Projects:', data);
          setProjects(Array.isArray(data) ? data : []);
        } else {
          console.log('Using mock data - Worker not ready');
          // Mock data for testing
          setProjects([
            { id: 1, title: "Sample Project 1", description: "This is a sample project", tech_stack: '["React","CSS"]', thumbnail_url: "https://picsum.photos/400/300?random=1", live_url: "#" },
            { id: 2, title: "Sample Project 2", description: "Another sample project", tech_stack: '["Node.js","Express"]', thumbnail_url: "https://picsum.photos/400/300?random=2", live_url: "#" }
          ]);
          setSkills([
            { id: 1, name: "React", category: "frontend", proficiency: 90 },
            { id: 2, name: "Node.js", category: "backend", proficiency: 85 }
          ]);
          setContact({ email: "test@example.com", github: "https://github.com", linkedin: "https://linkedin.com" });
        }
      } catch (err) {
        console.error('Connection error:', err);
        // Mock data for testing
        setProjects([
          { id: 1, title: "Sample Project 1", description: "This is a sample project", tech_stack: '["React","CSS"]', thumbnail_url: "https://picsum.photos/400/300?random=1", live_url: "#" }
        ]);
        setSkills([
          { id: 1, name: "React", category: "frontend", proficiency: 90 }
        ]);
        setContact({ email: "test@example.com" });
      } finally {
        setLoading(false);
      }
    };
    
    testConnection();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'sans-serif'
      }}>
        <div>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #667eea', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '20px' }}>Loading portfolio...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Simple Portfolio View
  const PortfolioView = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          My Portfolio
        </h1>
        <p style={{ fontSize: '18px', color: '#666' }}>Welcome to my creative portfolio</p>
        {!isAdmin && (
          <button onClick={() => setActiveTab('login')} style={{ marginTop: '20px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Admin Login
          </button>
        )}
      </div>

      {/* Projects Section */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#667eea' }}>My Projects</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {projects.map(project => (
            <div key={project.id} style={{ background: '#f9f9f9', borderRadius: '12px', padding: '15px', overflow: 'hidden' }}>
              {project.thumbnail_url && (
                <img src={project.thumbnail_url} alt={project.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
              )}
              <h3>{project.title}</h3>
              <p style={{ color: '#666', margin: '10px 0' }}>{project.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {JSON.parse(project.tech_stack || '[]').map((tech, i) => (
                  <span key={i} style={{ background: '#e0e7ff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Skills</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
          {skills.map(skill => (
            <div key={skill.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span><strong>{skill.name}</strong></span>
                <span style={{ color: '#667eea' }}>{skill.category}</span>
              </div>
              <div style={{ background: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${skill.proficiency}%`, height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Simple Login View
  const LoginView = () => (
    <div style={{ maxWidth: '400px', margin: '50px auto', background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center' }}>
      <h2>Admin Login</h2>
      <p style={{ margin: '10px 0', color: '#667eea' }}>Use: admin / admin123</p>
      <input type="text" id="username" placeholder="Username" defaultValue="admin" style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '8px' }} />
      <input type="password" id="password" placeholder="Password" defaultValue="admin123" style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '8px' }} />
      <button onClick={() => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === 'admin' && password === 'admin123') {
          setIsAdmin(true);
          setActiveTab('admin');
        } else {
          alert('Invalid credentials');
        }
      }} style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>
        Login
      </button>
    </div>
  );

  // Simple Admin View
  const AdminView = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #f0f0f0' }}>
          <h2>Admin Dashboard</h2>
          <button onClick={() => { setIsAdmin(false); setActiveTab('portfolio'); }} style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}><h3 style={{ fontSize: '32px', color: '#667eea' }}>{projects.length}</h3><p>Projects</p></div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}><h3 style={{ fontSize: '32px', color: '#667eea' }}>{skills.length}</h3><p>Skills</p></div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}><h3 style={{ fontSize: '32px', color: '#667eea' }}>{Object.keys(contact).length}</h3><p>Contacts</p></div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>Projects List</h3>
          {projects.map(p => (
            <div key={p.id} style={{ padding: '15px', background: '#f9f9f9', margin: '10px 0', borderRadius: '8px' }}>
              <strong>{p.title}</strong> - {p.description}
            </div>
          ))}
        </div>

        <div>
          <h3>Contact Info</h3>
          {Object.entries(contact).map(([key, value]) => (
            <div key={key} style={{ padding: '10px', background: '#f9f9f9', margin: '5px 0', borderRadius: '8px' }}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      background: darkMode ? '#1a1a2e' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 30px', 
        background: 'rgba(255,255,255,0.95)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Portfolio
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '8px 12px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          {!isAdmin && activeTab !== 'login' && (
            <button onClick={() => setActiveTab('login')} style={{ padding: '8px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Admin
            </button>
          )}
          {isAdmin && (
            <button onClick={() => setActiveTab('portfolio')} style={{ padding: '8px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              View Site
            </button>
          )}
        </div>
      </nav>

      <main>
        {activeTab === 'portfolio' && <PortfolioView />}
        {activeTab === 'login' && !isAdmin && <LoginView />}
        {activeTab === 'admin' && isAdmin && <AdminView />}
      </main>
    </div>
  );
}

export default App;