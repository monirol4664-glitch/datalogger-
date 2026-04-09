import React, { useState, useEffect } from 'react'
import { 
  Github, 
  Linkedin, 
  Mail, 
  Twitter, 
  Copy, 
  Check,
  Sparkles,
  Code2,
  Palette,
  Rocket,
  Star,
  Zap,
  Heart
} from 'lucide-react'
// Add near top
import AdminPanel from './AdminPanel';
const API_URL = '';
// Add state
const [isAdmin, setIsAdmin] = useState(false);
const [adminToken, setAdminToken] = useState(null);

// Add login form component
const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = async () => {
        const res = await fetch(`${API_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.token) {
            setAdminToken(data.token);
            setIsAdmin(true);
            localStorage.setItem('adminToken', data.token);
        }
    };
    
    return (
        <div className="admin-login">
            <h2>Admin Login</h2>
            <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

// Add route in App return
{isAdmin ? (
    <AdminPanel token={adminToken} onLogout={() => { setIsAdmin(false); localStorage.removeItem('adminToken'); }} />
) : (
    // Your existing portfolio UI
    <>
        {/* Your current portfolio JSX */}
        <button onClick={() => setIsAdmin(true)} className="admin-link">Admin</button>
    </>
)}

function App() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('projects')
  const [hoveredProject, setHoveredProject] = useState(null)

  const projects = [
    {
      id: 1,
      title: "NeoBank Dashboard",
      description: "Modern banking interface with real-time analytics, dark mode, and interactive charts. Used by 5k+ users in beta.",
      tech: ["React", "Tailwind", "D3.js", "Firebase"],
      icon: <Rocket size={20} />,
      gradient: "from-blue-500 to-cyan-500",
      year: "2024"
    },
    {
      id: 2,
      title: "AI Content Studio",
      description: "Generative AI platform for content creators. Features real-time text generation, image synthesis, and voice cloning.",
      tech: ["Next.js", "OpenAI", "TensorFlow.js", "Redis"],
      icon: <Sparkles size={20} />,
      gradient: "from-purple-500 to-pink-500",
      year: "2024"
    },
    {
      id: 3,
      title: "EcoChain Tracker",
      description: "Blockchain-based carbon footprint tracker with NFT rewards for sustainable actions. Web3 wallet integration.",
      tech: ["Web3.js", "Solidity", "React", "Node.js"],
      icon: <Zap size={20} />,
      gradient: "from-green-500 to-emerald-500",
      year: "2023"
    }
  ]

  const skills = {
    frontend: ["React", "Vue", "TypeScript", "Tailwind", "Next.js"],
    backend: ["Node.js", "Python", "GraphQL", "PostgreSQL", "Redis"],
    tools: ["Git", "Docker", "Figma", "Vite", "Cloudflare"]
  }

  const stats = [
    { label: "Projects Completed", value: "24+", icon: <Code2 size={24} /> },
    { label: "Happy Clients", value: "18", icon: <Heart size={24} /> },
    { label: "Years Experience", value: "5+", icon: <Star size={24} /> },
    { label: "Coffee Cups", value: "∞", icon: <Palette size={24} /> }
  ]

  const copyEmail = async () => {
    await navigator.clipboard.writeText("hello@novastudio.dev")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    // Smooth scroll animation for stat counters
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    })
    document.querySelectorAll('.stat-card').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      
      {/* Header / Navigation */}
      <nav className="glass-nav">
        <div className="nav-container">
          <div className="logo">
            <Sparkles size={28} className="logo-icon" />
            <span className="logo-text">NovaStudio</span>
          </div>
          <div className="nav-links">
            <button onClick={() => setActiveTab('projects')} className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`}>Work</button>
            <button onClick={() => setActiveTab('skills')} className={`nav-btn ${activeTab === 'skills' ? 'active' : ''}`}>Skills</button>
            <button onClick={() => setActiveTab('contact')} className={`nav-btn ${activeTab === 'contact' ? 'active' : ''}`}>Contact</button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            Available for work
          </div>
          <h1 className="hero-title">
            Crafting digital 
            <span className="gradient-text"> experiences </span>
            that matter
          </h1>
          <p className="hero-subtitle">
            I'm Nova Chen — front-end architect & creative developer. 
            I build interactive web applications with modern frameworks and design systems.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setActiveTab('contact')}>
              Let's Connect <Rocket size={18} />
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('projects')}>
              View Work <Code2 size={18} />
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Dynamic Content Tabs */}
        <div className="content-section">
          {activeTab === 'projects' && (
            <div className="projects-grid fade-in">
              <h2 className="section-title">Featured Projects</h2>
              <div className="projects-container">
                {projects.map(project => (
                  <div 
                    key={project.id} 
                    className={`project-card ${hoveredProject === project.id ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <div className={`project-glow ${project.gradient}`}></div>
                    <div className="project-header">
                      <div className="project-icon">{project.icon}</div>
                      <span className="project-year">{project.year}</span>
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tech">
                      {project.tech.map((tech, i) => (
                        <span key={i} className="tech-pill">{tech}</span>
                      ))}
                    </div>
                    <button className="project-link-btn">
                      View Case Study →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="skills-section fade-in">
              <h2 className="section-title">Tech Arsenal</h2>
              <div className="skills-container">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category} className="skill-category">
                    <h3 className="category-title capitalize">{category}</h3>
                    <div className="skills-cloud">
                      {items.map((skill, i) => (
                        <span key={i} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="experience-card">
                <h3 className="exp-title">✨ Work Journey</h3>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-year">2024 — Now</div>
                    <div className="timeline-content">Lead Frontend Developer @ CreativeLabs</div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-year">2022 — 2024</div>
                    <div className="timeline-content">React Engineer @ StartupStudio</div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-year">2020 — 2022</div>
                    <div className="timeline-content">Freelance UI Developer</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="contact-section fade-in">
              <h2 className="section-title">Let's Create Together</h2>
              <div className="contact-grid">
                <div className="contact-info-card">
                  <div className="contact-method" onClick={copyEmail}>
                    <Mail size={24} />
                    <div className="contact-detail">
                      <strong>Email me</strong>
                      <span>hello@novastudio.dev</span>
                    </div>
                    <button className="copy-btn">
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                  
                  <a href="#" className="contact-method">
                    <Github size={24} />
                    <div className="contact-detail">
                      <strong>GitHub</strong>
                      <span>/novastudio</span>
                    </div>
                  </a>
                  
                  <a href="#" className="contact-method">
                    <Linkedin size={24} />
                    <div className="contact-detail">
                      <strong>LinkedIn</strong>
                      <span>nova-chen-dev</span>
                    </div>
                  </a>
                  
                  <a href="#" className="contact-method">
                    <Twitter size={24} />
                    <div className="contact-detail">
                      <strong>Twitter/X</strong>
                      <span>@nova_builds</span>
                    </div>
                  </a>
                </div>
                
                <div className="availability-card">
                  <div className="availability-badge">
                    <span className="status-dot"></span>
                    Open for opportunities
                  </div>
                  <p>📍 Based in Austin, TX · Remote worldwide</p>
                  <p>⚡ Avg response: &lt; 24 hours</p>
                  <button className="btn-primary full-width">Schedule a Call →</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>© 2024 NovaStudio — Built with React + Vite | Deployed on Cloudflare Pages</p>
        <div className="footer-icons">
          <Heart size={16} />
          <span>Interactive & Responsive</span>
        </div>
      </footer>
    </div>
  )
}

export default App