import React, { useState, useEffect } from 'react';
import { api } from './api';
import { Plus, Edit2, Trash2, Save, X, LogOut, LogIn } from 'lucide-react';

function App() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contact, setContact] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [loginData, setLoginData] = useState({ username: 'admin', password: 'admin123' });
  
  // Form state for projects
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', tech_stack: [], year: '', thumbnail_url: '', live_url: ''
  });

  // Load all data
  const loadData = async () => {
    const [projectsData, skillsData, contactData] = await Promise.all([
      api.getProjects(),
      api.getSkills(),
      api.getContact()
    ]);
    setProjects(projectsData);
    setSkills(skillsData);
    setContact(contactData);
  };

  useEffect(() => {
    loadData();
    // Check if already logged in
    if (api.getToken()) {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = async () => {
    const result = await api.login(loginData.username, loginData.password);
    if (result.token) {
      setIsAdmin(true);
      alert('Login successful!');
    } else {
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsAdmin(false);
    setActiveTab('portfolio');
  };

  const handleSaveProject = async () => {
    const techArray = projectForm.tech_stack.split(',').map(t => t.trim());
    const projectToSave = {
      ...projectForm,
      tech_stack: JSON.stringify(techArray),
      id: editingProject?.id
    };
    await api.createProject(projectToSave);
    setShowProjectForm(false);
    setEditingProject(null);
    setProjectForm({ title: '', description: '', tech_stack: [], year: '', thumbnail_url: '', live_url: '' });
    loadData();
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Delete this project?')) {
      await api.deleteProject(id);
      loadData();
    }
  };

  const handleSaveSkill = async () => {
    const name = prompt('Enter skill name:');
    const category = prompt('Category (frontend/backend/tools):');
    const proficiency = prompt('Proficiency (0-100):');
    if (name && category) {
      await api.createSkill({ name, category, proficiency: parseInt(proficiency) || 50 });
      loadData();
    }
  };

  const handleDeleteSkill = async (id) => {
    if (confirm('Delete this skill?')) {
      await api.deleteSkill(id);
      loadData();
    }
  };

  const handleUpdateContact = async (type) => {
    const newValue = prompt(`Enter new value for ${type}:`, contact[type]);
    if (newValue && newValue !== contact[type]) {
      await api.updateContact(type, newValue);
      loadData();
    }
  };

  // Portfolio View (Public)
  const PortfolioView = () => (
    <div className="portfolio-view">
      <section className="hero">
        <h1>My Creative Portfolio</h1>
        <p>Building digital experiences with React + Cloudflare D1</p>
      </section>

      <section className="projects-section">
        <h2>Featured Work</h2>
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
      </section>

      <section className="skills-section">
        <h2>Skills & Technologies</h2>
        <div className="skills-cloud">
          {skills.map(skill => (
            <div key={skill.id} className="skill-card">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-category">{skill.category}</span>
              <div className="skill-bar">
                <div className="skill-progress" style={{ width: `${skill.proficiency}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <h2>Get in Touch</h2>
        <div className="contact-grid">
          {Object.entries(contact).map(([type, value]) => (
            <div key={type} className="contact-card">
              <strong>{type}:</strong>
              {type === 'email' ? (
                <a href={`mailto:${value}`}>{value}</a>
              ) : (
                <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  // Admin View
  const AdminView = () => (
    <div className="admin-view">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab('manage-projects')} className={activeTab === 'manage-projects' ? 'active' : ''}>
          Manage Projects
        </button>
        <button onClick={() => setActiveTab('manage-skills')} className={activeTab === 'manage-skills' ? 'active' : ''}>
          Manage Skills
        </button>
        <button onClick={() => setActiveTab('manage-contact')} className={activeTab === 'manage-contact' ? 'active' : ''}>
          Manage Contact
        </button>
      </div>

      {activeTab === 'manage-projects' && (
        <div className="manage-section">
          <button onClick={() => { setEditingProject(null); setProjectForm({ title: '', description: '', tech_stack: [], year: '', thumbnail_url: '', live_url: '' }); setShowProjectForm(true); }} className="btn-add">
            <Plus size={18} /> Add New Project
          </button>
          
          <div className="admin-projects-list">
            {projects.map(project => (
              <div key={project.id} className="admin-project-item">
                {project.thumbnail_url && <img src={project.thumbnail_url} alt={project.title} className="admin-thumb" />}
                <div className="admin-project-info">
                  <h4>{project.title}</h4>
                  <p>{project.description.substring(0, 100)}...</p>
                </div>
                <div className="admin-actions">
                  <button onClick={() => { setEditingProject(project); setProjectForm(project); setProjectForm({ ...project, tech_stack: JSON.parse(project.tech_stack || '[]').join(', ') }); setShowProjectForm(true); }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteProject(project.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'manage-skills' && (
        <div className="manage-section">
          <button onClick={handleSaveSkill} className="btn-add">
            <Plus size={18} /> Add New Skill
          </button>
          <div className="admin-skills-list">
            {skills.map(skill => (
              <div key={skill.id} className="admin-skill-item">
                <span><strong>{skill.name}</strong> - {skill.category} ({skill.proficiency}%)</span>
                <button onClick={() => handleDeleteSkill(skill.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'manage-contact' && (
        <div className="manage-section">
          <div className="admin-contact-list">
            {Object.entries(contact).map(([type, value]) => (
              <div key={type} className="admin-contact-item">
                <span><strong>{type}:</strong> {value}</span>
                <button onClick={() => handleUpdateContact(type)}>
                  <Edit2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="modal-overlay" onClick={() => setShowProjectForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
            <input type="text" placeholder="Title" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} />
            <textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
            <input type="text" placeholder="Tech Stack (comma separated)" value={projectForm.tech_stack} onChange={e => setProjectForm({ ...projectForm, tech_stack: e.target.value })} />
            <input type="text" placeholder="Year" value={projectForm.year} onChange={e => setProjectForm({ ...projectForm, year: e.target.value })} />
            <input type="text" placeholder="Thumbnail URL" value={projectForm.thumbnail_url} onChange={e => setProjectForm({ ...projectForm, thumbnail_url: e.target.value })} />
            <input type="text" placeholder="Live URL" value={projectForm.live_url} onChange={e => setProjectForm({ ...projectForm, live_url: e.target.value })} />
            <div className="modal-actions">
              <button onClick={handleSaveProject} className="btn-save"><Save size={16} /> Save</button>
              <button onClick={() => setShowProjectForm(false)} className="btn-cancel"><X size={16} /> Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">React Portfolio</div>
        <div className="nav-links">
          {!isAdmin ? (
            <>
              <button onClick={() => setActiveTab('portfolio')}>Portfolio</button>
              <button onClick={() => setActiveTab('login')}>
                <LogIn size={16} /> Admin
              </button>
            </>
          ) : (
            <button onClick={() => setActiveTab('portfolio')}>View Portfolio</button>
          )}
        </div>
      </nav>

      <main className="main-container">
        {activeTab === 'login' && !isAdmin && (
          <div className="login-container">
            <h2>Admin Login</h2>
            <input type="text" placeholder="Username" value={loginData.username} onChange={e => setLoginData({ ...loginData, username: e.target.value })} />
            <input type="password" placeholder="Password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
            <button onClick={handleLogin}>Login</button>
          </div>
        )}
        {(activeTab === 'portfolio' || (activeTab === 'login' && isAdmin)) && <PortfolioView />}
        {isAdmin && activeTab !== 'portfolio' && activeTab !== 'login' && <AdminView />}
      </main>
    </div>
  );
}

export default App;