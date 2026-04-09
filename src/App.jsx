import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Sun, Moon, LogIn, LogOut, Github, Linkedin, Mail, Twitter } from 'lucide-react';

// IMPORTANT: Replace this with your Worker URL after deploying
const WORKER_URL = 'https://icy-cherry-b7d7.monirol4664.workers.dev';

function App() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contact, setContact] = useState({});
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loginData, setLoginData] = useState({ username: 'admin', password: 'admin123' });
  const [loading, setLoading] = useState(true);
  
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', tech_stack: '', year: '', thumbnail_url: '', live_url: ''
  });
  
  const [skillForm, setSkillForm] = useState({
    name: '', category: 'frontend', proficiency: 50
  });

  // Load all data
  const loadProjects = async () => {
    try {
      const res = await fetch(`${WORKER_URL}/api/projects`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  };

  const loadSkills = async () => {
    try {
      const res = await fetch(`${WORKER_URL}/api/skills`);
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading skills:', error);
      setSkills([]);
    }
  };

  const loadContact = async () => {
    try {
      const res = await fetch(`${WORKER_URL}/api/contact`);
      const data = await res.json();
      setContact(data || {});
    } catch (error) {
      console.error('Error loading contact:', error);
      setContact({});
    }
  };

  useEffect(() => {
    Promise.all([loadProjects(), loadSkills(), loadContact()]).finally(() => setLoading(false));
  }, []);

  // Toggle theme
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Project CRUD
  const handleSaveProject = async () => {
    const techArray = projectForm.tech_stack.split(',').map(t => t.trim());
    const payload = {
      ...projectForm,
      tech_stack: JSON.stringify(techArray),
      id: editingProject?.id,
      featured: 0,
      display_order: projects.length
    };
    
    await fetch(`${WORKER_URL}/api/admin/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    setShowProjectForm(false);
    setEditingProject(null);
    setProjectForm({ title: '', description: '', tech_stack: '', year: '', thumbnail_url: '', live_url: '' });
    loadProjects();
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Delete this project?')) {
      await fetch(`${WORKER_URL}/api/admin/projects/${id}`, { method: 'DELETE' });
      loadProjects();
    }
  };

  const handleSaveSkill = async () => {
    const payload = { ...skillForm, id: editingSkill?.id };
    await fetch(`${WORKER_URL}/api/admin/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    setShowSkillForm(false);
    setEditingSkill(null);
    setSkillForm({ name: '', category: 'frontend', proficiency: 50 });
    loadSkills();
  };

  const handleDeleteSkill = async (id) => {
    if (confirm('Delete this skill?')) {
      await fetch(`${WORKER_URL}/api/admin/skills/${id}`, { method: 'DELETE' });
      loadSkills();
    }
  };

  const handleUpdateContact = async (type, currentValue) => {
    const newValue = prompt(`Edit ${type}:`, currentValue);
    if (newValue && newValue !== currentValue) {
      await fetch(`${WORKER_URL}/api/admin/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value: newValue })
      });
      loadContact();
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${WORKER_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (data.success || data.token) {
        setIsAdmin(true);
        setActiveTab('admin');
        alert('Login successful!');
      } else {
        alert('Invalid credentials. Use admin/admin123');
      }
    } catch (error) {
      alert('Cannot connect to server. Make sure Worker is deployed.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveTab('portfolio');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  // Portfolio View Component
  const PortfolioView = () => (
    <div className="portfolio-view">
      <section className="hero">
        <h1>My Creative Portfolio</h1>
        <p>Building amazing digital experiences with modern web technologies</p>
      </section>

      <section className="projects-section">
        <h2>Featured Work</h2>
        {projects.length === 0 ? (
          <div className="empty-state">No projects yet. Admin can add projects.</div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                {project.thumbnail_url && (
                  <img src={project.thumbnail_url} alt={project.title} className="project-thumbnail" />
                )}
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-stack">
                  {JSON.parse(project.tech_stack || '[]').map((tech, i) => (
                    <span key={i} className="tech-badge">{tech}</span>
                  ))}
                </div>
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="project-link">
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="skills-section">
        <h2>Skills & Technologies</h2>
        {skills.length === 0 ? (
          <div className="empty-state">No skills yet. Admin can add skills.</div>
        ) : (
          <div className="skills-grid">
            {skills.map(skill => (
              <div key={skill.id} className="skill-card">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-category">{skill.category}</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: `${skill.proficiency}%` }}></div>
                </div>
                <span className="skill-percentage">{skill.proficiency}%</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="contact-section">
        <h2>Get in Touch</h2>
        <div className="contact-grid">
          {Object.keys(contact).length === 0 ? (
            <div className="empty-state">No contact info yet.</div>
          ) : (
            Object.entries(contact).map(([type, value]) => (
              <div key={type} className="contact-card">
                {type === 'email' && <Mail size={20} />}
                {type === 'github' && <Github size={20} />}
                {type === 'linkedin' && <Linkedin size={20} />}
                {type === 'twitter' && <Twitter size={20} />}
                <strong>{type}:</strong>
                {type === 'email' ? (
                  <a href={`mailto:${value}`}>{value}</a>
                ) : (
                  <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );

  // Admin View Component
  const AdminView = () => (
    <div className="admin-view">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>{projects.length}</h3>
          <p>Projects</p>
        </div>
        <div className="stat-card">
          <h3>{skills.length}</h3>
          <p>Skills</p>
        </div>
        <div className="stat-card">
          <h3>{Object.keys(contact).length}</h3>
          <p>Contact Items</p>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-header">
          <h3>📁 Manage Projects</h3>
          <button className="btn-primary" onClick={() => { setEditingProject(null); setProjectForm({ title: '', description: '', tech_stack: '', year: '', thumbnail_url: '', live_url: '' }); setShowProjectForm(true); }}>
            <Plus size={18} /> Add Project
          </button>
        </div>
        <div className="admin-list">
          {projects.map(project => (
            <div key={project.id} className="admin-item">
              {project.thumbnail_url && <img src={project.thumbnail_url} alt={project.title} className="admin-thumb" />}
              <div className="admin-info">
                <strong>{project.title}</strong>
                <p>{project.description.substring(0, 80)}...</p>
              </div>
              <div className="admin-actions">
                <button className="btn-icon" onClick={() => { setEditingProject(project); setProjectForm({ ...project, tech_stack: JSON.parse(project.tech_stack || '[]').join(', ') }); setShowProjectForm(true); }}>
                  <Edit2 size={16} />
                </button>
                <button className="btn-icon delete" onClick={() => handleDeleteProject(project.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <div className="section-header">
          <h3>⚡ Manage Skills</h3>
          <button className="btn-primary" onClick={() => { setEditingSkill(null); setSkillForm({ name: '', category: 'frontend', proficiency: 50 }); setShowSkillForm(true); }}>
            <Plus size={18} /> Add Skill
          </button>
        </div>
        <div className="admin-list">
          {skills.map(skill => (
            <div key={skill.id} className="admin-item">
              <div className="admin-info">
                <strong>{skill.name}</strong>
                <span className="skill-category-badge">{skill.category}</span>
                <div className="skill-bar-small">
                  <div className="skill-progress-small" style={{ width: `${skill.proficiency}%` }}></div>
                </div>
              </div>
              <div className="admin-actions">
                <button className="btn-icon" onClick={() => { setEditingSkill(skill); setSkillForm({ name: skill.name, category: skill.category, proficiency: skill.proficiency }); setShowSkillForm(true); }}>
                  <Edit2 size={16} />
                </button>
                <button className="btn-icon delete" onClick={() => handleDeleteSkill(skill.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <div className="section-header">
          <h3>📧 Manage Contact</h3>
        </div>
        <div className="admin-list">
          {Object.entries(contact).map(([type, value]) => (
            <div key={type} className="admin-item">
              <div className="admin-info">
                <strong>{type.toUpperCase()}:</strong> {value}
              </div>
              <button className="btn-icon" onClick={() => handleUpdateContact(type, value)}>
                <Edit2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <nav className="navbar">
        <div className="nav-brand">🎨 Portfolio Admin</div>
        <div className="nav-controls">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {!isAdmin ? (
            <>
              <button onClick={() => setActiveTab('portfolio')} className={activeTab === 'portfolio' ? 'active' : ''}>Portfolio</button>
              <button onClick={() => setActiveTab('login')} className={activeTab === 'login' ? 'active' : ''}>
                <LogIn size={16} /> Admin
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('portfolio')} className={activeTab === 'portfolio' ? 'active' : ''}>View Site</button>
              <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? 'active' : ''}>Dashboard</button>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'portfolio' && <PortfolioView />}
        
        {activeTab === 'login' && !isAdmin && (
          <div className="login-container">
            <h2>Admin Login</h2>
            <input 
              type="text" 
              placeholder="Username" 
              value={loginData.username} 
              onChange={e => setLoginData({ ...loginData, username: e.target.value })}
              defaultValue="admin"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={loginData.password} 
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              defaultValue="admin123"
            />
            <button className="btn-primary full-width" onClick={handleLogin}>Login</button>
            <p className="login-hint">Default: admin / admin123</p>
          </div>
        )}
        
        {activeTab === 'admin' && isAdmin && <AdminView />}
      </main>

      {/* Modals */}
      {showProjectForm && (
        <div className="modal-overlay" onClick={() => setShowProjectForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Add Project'}</h3>
              <button className="modal-close" onClick={() => setShowProjectForm(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <label>Title *</label>
              <input type="text" placeholder="Project title" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} />
              <label>Description *</label>
              <textarea placeholder="Description" rows="3" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
              <label>Tech Stack (comma separated)</label>
              <input type="text" placeholder="React, Tailwind, Node.js" value={projectForm.tech_stack} onChange={e => setProjectForm({ ...projectForm, tech_stack: e.target.value })} />
              <label>Thumbnail URL</label>
              <input type="text" placeholder="https://example.com/image.jpg" value={projectForm.thumbnail_url} onChange={e => setProjectForm({ ...projectForm, thumbnail_url: e.target.value })} />
              <label>Live URL</label>
              <input type="text" placeholder="https://yourproject.com" value={projectForm.live_url} onChange={e => setProjectForm({ ...projectForm, live_url: e.target.value })} />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowProjectForm(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveProject}><Save size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}

      {showSkillForm && (
        <div className="modal-overlay" onClick={() => setShowSkillForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSkill ? 'Edit Skill' : 'Add Skill'}</h3>
              <button className="modal-close" onClick={() => setShowSkillForm(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <label>Skill Name *</label>
              <input type="text" placeholder="React, Node.js, etc" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} />
              <label>Category</label>
              <select value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })}>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="tools">Tools</option>
                <option value="design">Design</option>
              </select>
              <label>Proficiency: {skillForm.proficiency}%</label>
              <input type="range" min="0" max="100" value={skillForm.proficiency} onChange={e => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })} />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowSkillForm(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveSkill}><Save size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;