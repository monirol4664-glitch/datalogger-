import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'

// API endpoint (will be configured after deployment)
const API_BASE = import.meta.env.VITE_API_URL || ''

// Components
const Navbar = () => {
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem('adminToken') === 'true')
    }
    checkAdmin()
    window.addEventListener('storage', checkAdmin)
    return () => window.removeEventListener('storage', checkAdmin)
  }, [])
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold neon-text">
            Portfolio
          </Link>
          <div className="flex space-x-6">
            <Link to="/" className={`hover:text-purple-400 transition ${location.pathname === '/' ? 'text-purple-400' : 'text-gray-300'}`}>
              Home
            </Link>
            <Link to="/works" className={`hover:text-purple-400 transition ${location.pathname === '/works' ? 'text-purple-400' : 'text-gray-300'}`}>
              Works
            </Link>
            <Link to="/contact" className={`hover:text-purple-400 transition ${location.pathname === '/contact' ? 'text-purple-400' : 'text-gray-300'}`}>
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className={`hover:text-purple-400 transition ${location.pathname === '/admin' ? 'text-purple-400' : 'text-gray-300'}`}>
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Home Page
const HomePage = () => {
  const [content, setContent] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
    fetchProfileImage()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/content`)
      setContent(res.data)
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }

  const fetchProfileImage = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/profile-image`)
      if (res.data && res.data.imageUrl) {
        setProfileImage(res.data.imageUrl)
      }
    } catch (error) {
      console.error('Error fetching profile image:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-8">
          {profileImage && profileImage.startsWith('data:') && (
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500 shadow-xl flex-shrink-0">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', profileImage)
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="neon-text">{content?.name || 'John Doe'}</span>
            </h1>
            <p className="text-xl text-gray-300">{content?.title || 'Creative Developer'}</p>
          </div>
        </div>

        {/* Education & Expertise */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8 hover-glow">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>📚</span> Education
            </h2>
            <div className="space-y-4">
              {content?.education?.map((edu, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-lg">{edu.degree}</h3>
                  <p className="text-gray-400">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 hover-glow">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>💡</span> Expertise
            </h2>
            <div className="flex flex-wrap gap-3">
              {content?.expertise?.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Paragraph */}
        <div className="glass-card p-8 hover-glow">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>📝</span> About Me
          </h2>
          <p className="text-gray-300 leading-relaxed">{content?.bio}</p>
        </div>
      </div>
    </div>
  )
}

// Works Page
const WorksPage = () => {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/works`)
      setWorks(res.data)
    } catch (error) {
      console.error('Error fetching works:', error)
    } finally {
      setLoading(false)
    }
  }

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 neon-text">Explore My Works</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work, idx) => (
            <div key={idx} className="glass-card overflow-hidden hover-glow animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              {work.type === 'website' ? (
                <>
                  <div className="relative h-48 bg-gray-900 overflow-hidden">
                    {work.thumbnail && (
                      <img src={work.thumbnail} alt={work.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                    <p className="text-gray-400 mb-4">{work.description}</p>
                    <a href={work.url} target="_blank" rel="noopener noreferrer" 
                       className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
                      Visit Website → 
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative pb-[56.25%] bg-gray-900">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${getYouTubeId(work.url)}`}
                      title={work.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                    <p className="text-gray-400">{work.description}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Contact Page
const ContactPage = () => {
  const [socialLinks, setSocialLinks] = useState([])

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  const fetchSocialLinks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/social-links`)
      setSocialLinks(res.data)
    } catch (error) {
      console.error('Error fetching social links:', error)
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 text-center">
          <h1 className="text-4xl font-bold mb-8 neon-text">Contact Me</h1>
          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card px-6 py-3 hover-glow flex items-center gap-2 transition"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="font-semibold">{link.platform}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Login
const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_BASE}/api/admin/login`, { username, password })
      if (res.data.success) {
        localStorage.setItem('adminToken', 'true')
        onLogin()
      } else {
        setError('Invalid credentials')
      }
    } catch (error) {
      setError('Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center neon-text">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

// Admin Panel
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('basic')
  const [content, setContent] = useState({
    name: '',
    title: '',
    bio: '',
    education: [],
    expertise: []
  })
  const [works, setWorks] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const [profileImage, setProfileImage] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [contentRes, worksRes, socialRes, imageRes] = await Promise.all([
        axios.get(`${API_BASE}/api/content`),
        axios.get(`${API_BASE}/api/works`),
        axios.get(`${API_BASE}/api/social-links`),
        axios.get(`${API_BASE}/api/profile-image`)
      ])
      setContent(contentRes.data)
      setWorks(worksRes.data)
      setSocialLinks(socialRes.data)
      if (imageRes.data && imageRes.data.imageUrl) {
        setProfileImage(imageRes.data.imageUrl)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleContentUpdate = async () => {
    try {
      await axios.post(`${API_BASE}/api/admin/update-content`, content)
      setMessage('Content updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error updating content')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        await axios.post(`${API_BASE}/api/admin/upload-image`, {
          imageData: reader.result,
          mimeType: file.type
        })
        setMessage('Profile image updated!')
        setTimeout(() => setMessage(''), 3000)
        // Refresh image
        const imageRes = await axios.get(`${API_BASE}/api/profile-image`)
        if (imageRes.data && imageRes.data.imageUrl) {
          setProfileImage(imageRes.data.imageUrl)
        }
      } catch (error) {
        setMessage('Error uploading image')
      }
    }
    reader.readAsDataURL(file)
  }

  const addWork = () => {
    setWorks([...works, { title: '', description: '', url: '', type: 'website', thumbnail: '' }])
  }

  const updateWork = (idx, field, value) => {
    const updated = [...works]
    updated[idx][field] = value
    setWorks(updated)
  }

  const deleteWork = (idx) => {
    const updated = works.filter((_, i) => i !== idx)
    setWorks(updated)
  }

  const saveWorks = async () => {
    try {
      await axios.post(`${API_BASE}/api/admin/update-works`, { works })
      setMessage('Works updated!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error saving works')
    }
  }

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '', icon: '' }])
  }

  const updateSocialLink = (idx, field, value) => {
    const updated = [...socialLinks]
    updated[idx][field] = value
    setSocialLinks(updated)
  }

  const deleteSocialLink = (idx) => {
    const updated = socialLinks.filter((_, i) => i !== idx)
    setSocialLinks(updated)
  }

  const saveSocialLinks = async () => {
    try {
      await axios.post(`${API_BASE}/api/admin/update-social-links`, { socialLinks })
      setMessage('Social links updated!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error saving social links')
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 neon-text">Admin Panel</h1>
        
        {message && (
          <div className="glass-card p-4 mb-6 text-green-400 border-green-500/50">
            {message}
          </div>
        )}

        <div className="flex gap-4 mb-6 flex-wrap">
          {['basic', 'works', 'social', 'image'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg transition ${activeTab === tab ? 'bg-purple-600' : 'glass-card hover:bg-gray-700/50'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="glass-card p-8">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={content.name || ''}
                  onChange={(e) => setContent({...content, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={content.title || ''}
                  onChange={(e) => setContent({...content, title: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  placeholder="Bio"
                  value={content.bio || ''}
                  onChange={(e) => setContent({...content, bio: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Education (JSON format)</label>
                <textarea
                  value={JSON.stringify(content.education || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      setContent({...content, education: parsed})
                    } catch (err) {
                      // Invalid JSON, don't update
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg font-mono text-sm text-white"
                  rows="6"
                />
                <p className="text-xs text-gray-400 mt-1">Example: [{"degree":"BSc CS","institution":"University","year":"2020-2024"}]</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expertise (JSON array)</label>
                <textarea
                  value={JSON.stringify(content.expertise || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      setContent({...content, expertise: parsed})
                    } catch (err) {
                      // Invalid JSON, don't update
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg font-mono text-sm text-white"
                  rows="4"
                />
                <p className="text-xs text-gray-400 mt-1">Example: ["React", "Node.js", "Python"]</p>
              </div>
              <button onClick={handleContentUpdate} className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
                Save Content
              </button>
            </div>
          )}

          {activeTab === 'works' && (
            <div className="space-y-6">
              {works.map((work, idx) => (
                <div key={idx} className="border border-gray-700 rounded-lg p-4 space-y-3 relative">
                  <button
                    onClick={() => deleteWork(idx)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                  >
                    ✕
                  </button>
                  <input
                    placeholder="Title"
                    value={work.title}
                    onChange={(e) => updateWork(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                  />
                  <input
                    placeholder="Description"
                    value={work.description}
                    onChange={(e) => updateWork(idx, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                  />
                  <input
                    placeholder="URL (YouTube or Website)"
                    value={work.url}
                    onChange={(e) => updateWork(idx, 'url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                  />
                  <select
                    value={work.type}
                    onChange={(e) => updateWork(idx, 'type', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                  >
                    <option value="website">Website</option>
                    <option value="youtube">YouTube Video</option>
                  </select>
                  {work.type === 'website' && (
                    <input
                      placeholder="Thumbnail URL"
                      value={work.thumbnail}
                      onChange={(e) => updateWork(idx, 'thumbnail', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-4">
                <button onClick={addWork} className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition">+ Add Work</button>
                <button onClick={saveWorks} className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition">Save All Works</button>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              {socialLinks.map((link, idx) => (
                <div key={idx} className="border border-gray-700 rounded-lg p-4 space-y-3 relative">
                  <button
                    onClick={() => deleteSocialLink(idx)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                  >
                    ✕
                  </button>
                  <input
                    placeholder="Platform (e.g., GitHub)"
                    value={link.platform}
                    onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                  />
                  <input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                  />
                  <input
                    placeholder="Icon (emoji or text)"
                    value={link.icon}
                    onChange={(e) => updateSocialLink(idx, 'icon', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                  />
                </div>
              ))}
              <div className="flex gap-4">
                <button onClick={addSocialLink} className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition">+ Add Social Link</button>
                <button onClick={saveSocialLinks} className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition">Save Social Links</button>
              </div>
            </div>
          )}

          {activeTab === 'image' && (
            <div className="space-y-6 text-center">
              {profileImage && profileImage.startsWith('data:') && (
                <div className="mb-4">
                  <img src={profileImage} alt="Profile" className="w-48 h-48 rounded-full mx-auto border-4 border-purple-500 object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer text-white"
              />
              <p className="text-sm text-gray-400">Image will be stored as BLOB in D1 and served as RFC 2397 data URL</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main App
function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token === 'true') {
      setIsAdminLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAdminLoggedIn(false)
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={
            isAdminLoggedIn ? 
              <AdminPanel /> : 
              <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App