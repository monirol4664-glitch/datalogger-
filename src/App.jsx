import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

// Navbar
const Navbar = () => {
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    setIsAdmin(localStorage.getItem('adminToken') === 'true')
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition">PORTFOLIO</Link>
        <div className="flex gap-6 md:gap-10">
          {['/', '/works', '/contact'].map((p, i) => (
            <Link key={i} to={p} className={`relative text-sm md:text-base uppercase tracking-wider transition-colors hover:text-purple-400 ${location.pathname === p ? 'text-purple-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-400' : 'text-gray-400'}`}>{p === '/' ? 'Home' : p.slice(1)}</Link>
          ))}
          {isAdmin && <Link to="/admin" className="text-sm md:text-base uppercase tracking-wider text-gray-400 hover:text-purple-400 transition-colors">Admin</Link>}
        </div>
      </div>
    </nav>
  )
}

// Hero Section with LARGE IMAGE
const Hero = ({ name, title, imageDataUrl }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef()

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = heroRef.current?.getBoundingClientRect()
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
        setMousePos({ x, y })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div 
      ref={heroRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ transform: `perspective(1000px) rotateX(${mousePos.y * 0.05}deg) rotateY(${mousePos.x * 0.05}deg)` }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30 animate-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
      
      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
        {/* LARGE PROFILE IMAGE */}
        {imageDataUrl ? (
          <div className="group relative w-56 h-56 md:w-80 md:h-80 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse opacity-75 blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative rounded-full overflow-hidden border-4 border-white/30 shadow-2xl group-hover:scale-105 transition-all duration-500 cursor-pointer">
              <img 
                src={imageDataUrl} 
                alt="Profile" 
                className="w-56 h-56 md:w-80 md:h-80 object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="relative w-56 h-56 md:w-80 md:h-80 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse opacity-75 blur-xl" />
            <div className="relative rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center w-56 h-56 md:w-80 md:h-80">
              <svg className="w-32 h-32 md:w-40 md:h-40 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
        )}
        
        <h1 className="text-5xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
          {name || 'John Doe'}
        </h1>
        
        <p className="text-xl md:text-3xl text-gray-300 tracking-wide max-w-3xl mx-auto">
          {title || 'Creative Developer & Designer'}
        </p>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Animated Section Wrapper
const Section = ({ children, title, icon, delay = 0 }) => (
  <div 
    className="opacity-0 animate-fade-in-up"
    style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
  >
    <div className="mb-8 text-center">
      <div className="text-5xl md:text-6xl text-purple-400">{icon}</div>
      <h2 className="text-3xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{title}</h2>
      <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full" />
    </div>
    {children}
  </div>
)

// Glass Card Component
const GlassCard = ({ children, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <div 
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transform: isHovered ? 'translateY(-8px)' : 'translateY(0)' }}
    >
      {children}
    </div>
  )
}

// Home Page
const HomePage = () => {
  const [content, setContent] = useState({ name: '', title: '', bio: '', education: [], expertise: [] })
  const [imageDataUrl, setImageDataUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_BASE}/api/content`)
      .then(res => setContent(res.data))
      .catch(console.error)
    
    axios.get(`${API_BASE}/api/image`)
      .then(res => {
        if (res.data.hasImage && res.data.imageUrl) {
          setImageDataUrl(res.data.imageUrl)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-purple-500" /></div>

  return (
    <div className="bg-black text-white">
      <Hero name={content.name} title={content.title} imageDataUrl={imageDataUrl} />
      
      <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        {/* Education & Expertise Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <Section title="Education" icon="🎓" delay={0.2}>
            <div className="space-y-6">
              {content.education?.map((edu, idx) => (
                <GlassCard key={idx} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-purple-400">{edu.degree}</h3>
                      <p className="text-gray-400 mt-1">{edu.institution}</p>
                      <p className="text-sm text-gray-500 mt-1">{edu.year}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </Section>

          <Section title="Expertise" icon="⚡" delay={0.3}>
            <div className="flex flex-wrap gap-4">
              {content.expertise?.map((skill, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300" />
                  <span className="relative px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-purple-300 border border-white/20 group-hover:border-purple-500 group-hover:scale-110 transition-all duration-300 cursor-default block">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Bio Section */}
        <Section title="About Me" icon="📖" delay={0.4}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition duration-500" />
            <GlassCard className="relative p-8 md:p-12">
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto">
                {content.bio || 'No bio available yet. Login to admin panel to add your story.'}
              </p>
            </GlassCard>
          </div>
        </Section>
      </div>
    </div>
  )
}

// Works Page
const WorksPage = () => {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_BASE}/api/works`).then(res => { setWorks(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const getYouTubeId = (url) => {
    const m = url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)
    return m && m[2]?.length === 11 ? m[2] : null
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-purple-500" /></div>

  return (
    <div className="bg-black pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-6xl text-purple-400">🚀</div>
          <h1 className="text-5xl md:text-7xl font-bold mt-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Explore My Works</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-6 rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-500">
                {work.type === 'website' ? (
                  <>
                    <div className="relative h-56 overflow-hidden">
                      <img src={work.thumbnail} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <a href={work.url} target="_blank" rel="noopener" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          Visit →
                        </a>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold mb-2">{work.title}</h3>
                      <p className="text-gray-400">{work.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative pb-[56.25%]">
                      <iframe 
                        className="absolute inset-0 w-full h-full" 
                        src={`https://www.youtube.com/embed/${getYouTubeId(work.url)}`} 
                        title={work.title} 
                        frameBorder="0" 
                        allowFullScreen 
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold">{work.title}</h3>
                      <p className="text-gray-400 mt-2">{work.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Contact Page
const ContactPage = () => {
  const [links, setLinks] = useState([])

  useEffect(() => {
    axios.get(`${API_BASE}/api/social-links`).then(res => setLinks(res.data))
  }, [])

  const getIcon = (platform) => {
    const icons = {
      'github': '🐙',
      'twitter': '🐦',
      'linkedin': '🔗',
      'facebook': '📘',
      'instagram': '📷',
      'youtube': '📺',
      'tiktok': '🎵',
      'discord': '🎮',
    }
    return icons[platform?.toLowerCase()] || '🔗'
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="text-6xl text-purple-400">🤝</div>
        <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Let's Connect</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-16 rounded-full" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener"
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <span className="text-5xl mb-4 block group-hover:animate-bounce">{link.icon || getIcon(link.platform)}</span>
                <span className="text-lg font-semibold text-gray-300 group-hover:text-purple-400">{link.platform}</span>
              </div>
            </a>
          ))}
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
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/api/admin/login`, { username, password })
      if (res.data.success) { localStorage.setItem('adminToken', 'true'); onLogin() }
      else setError('Invalid credentials')
    } catch { setError('Login failed') }
    setLoading(false)
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </div>
  )
}

// Admin Panel
const AdminPanel = () => {
  const [tab, setTab] = useState('basic')
  const [content, setContent] = useState({ name: '', title: '', bio: '', education: [], expertise: [] })
  const [works, setWorks] = useState([])
  const [social, setSocial] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/api/content`),
      axios.get(`${API_BASE}/api/works`),
      axios.get(`${API_BASE}/api/social-links`),
      axios.get(`${API_BASE}/api/image`)
    ]).then(([c, w, s, img]) => {
      setContent(c.data)
      setWorks(w.data)
      setSocial(s.data)
      if (img.data.hasImage && img.data.imageUrl) {
        setImagePreview(img.data.imageUrl)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const updateContent = async () => {
    try { await axios.post(`${API_BASE}/api/admin/update-content`, content); setMessage('Content saved'); setTimeout(() => setMessage(''), 3000) } catch { setMessage('Error') }
  }
  
  const uploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) { setMessage('Please select a file'); return }
    setUploading(true)
    setMessage('Uploading...')
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const response = await axios.post(`${API_BASE}/api/admin/upload-image`, { imageData: reader.result, mimeType: file.type })
        if (response.data.success) {
          setMessage(`Success! ${response.data.message}`)
          const imgRes = await axios.get(`${API_BASE}/api/image`)
          if (imgRes.data.hasImage && imgRes.data.imageUrl) {
            setImagePreview(imgRes.data.imageUrl)
          }
        } else {
          setMessage('Upload failed: ' + (response.data.error || 'Unknown error'))
        }
      } catch (err) {
        setMessage('Error: ' + (err.response?.data?.error || err.message))
      } finally {
        setUploading(false)
        setTimeout(() => setMessage(''), 3000)
      }
    }
    reader.onerror = () => { setMessage('Error reading file'); setUploading(false) }
    reader.readAsDataURL(file)
  }
  
  const addWork = () => setWorks([...works, { title: '', description: '', url: '', type: 'website', thumbnail: '' }])
  const updateWork = (i, f, v) => { const w = [...works]; w[i][f] = v; setWorks(w) }
  const delWork = (i) => setWorks(works.filter((_, idx) => idx !== i))
  const saveWorks = async () => { await axios.post(`${API_BASE}/api/admin/update-works`, { works }); setMessage('Works saved'); setTimeout(() => setMessage(''), 3000) }
  const addSocial = () => setSocial([...social, { platform: '', url: '', icon: '' }])
  const updateSocial = (i, f, v) => { const s = [...social]; s[i][f] = v; setSocial(s) }
  const delSocial = (i) => setSocial(social.filter((_, idx) => idx !== i))
  const saveSocial = async () => { await axios.post(`${API_BASE}/api/admin/update-social-links`, { socialLinks: social }); setMessage('Social saved'); setTimeout(() => setMessage(''), 3000) }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-purple-500" /></div>
  
  return (
    <div className="bg-black min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Admin Panel</h1>
        {message && <div className={`border rounded-lg p-4 mb-6 ${message.includes('Success') || message.includes('saved') ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-yellow-500/20 border-yellow-500 text-yellow-400'}`}>{message}</div>}
        <div className="flex gap-4 mb-6 flex-wrap">
          {['basic', 'works', 'social', 'image'].map(t => <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-lg ${tab === t ? 'bg-purple-600' : 'bg-white/5 border border-white/10'}`}>{t}</button>)}
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          {tab === 'basic' && (
            <div className="space-y-6">
              <input type="text" placeholder="Name" value={content.name} onChange={e => setContent({...content, name: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white" />
              <input type="text" placeholder="Title" value={content.title} onChange={e => setContent({...content, title: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white" />
              <textarea placeholder="Bio" value={content.bio} onChange={e => setContent({...content, bio: e.target.value})} rows="4" className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white" />
              <textarea placeholder='Education JSON' value={JSON.stringify(content.education, null, 2)} onChange={e => { try { setContent({...content, education: JSON.parse(e.target.value)}) } catch {} }} rows="6" className="w-full font-mono text-sm bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
              <textarea placeholder='Expertise JSON' value={JSON.stringify(content.expertise, null, 2)} onChange={e => { try { setContent({...content, expertise: JSON.parse(e.target.value)}) } catch {} }} rows="4" className="w-full font-mono text-sm bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
              <button onClick={updateContent} className="px-6 py-2 bg-purple-600 rounded-lg">Save Content</button>
            </div>
          )}
          {tab === 'works' && (
            <div className="space-y-6">
              {works.map((w, i) => (
                <div key={i} className="border border-white/10 rounded-lg p-4 space-y-3 relative">
                  <button onClick={() => delWork(i)} className="absolute top-2 right-2 text-red-500">✕</button>
                  <input placeholder="Title" value={w.title} onChange={e => updateWork(i, 'title', e.target.value)} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white" />
                  <input placeholder="Description" value={w.description} onChange={e => updateWork(i, 'description', e.target.value)} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white" />
                  <input placeholder="URL" value={w.url} onChange={e => updateWork(i, 'url', e.target.value)} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white" />
                  <select value={w.type} onChange={e => updateWork(i, 'type', e.target.value)} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white"><option value="website">Website</option><option value="youtube">YouTube</option></select>
                  {w.type === 'website' && <input placeholder="Thumbnail URL" value={w.thumbnail} onChange={e => updateWork(i, 'thumbnail', e.target.value)} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white" />}
                </div>
              ))}
              <div className="flex gap-4"><button onClick={addWork} className="px-4 py-2 bg-green-600 rounded-lg">+ Add Work</button><button onClick={saveWorks} className="px-4 py-2 bg-purple-600 rounded-lg">Save Works</button></div>
            </div>
          )}
          {tab === 'social' && (
            <div className="space-y-6">
              {social.map((s, i) => (
                <div key={i} className="border border-white/10 rounded-lg p-4 space-y-3 relative">
                  <button onClick={() => delSocial(i)} className="absolute top-2 right-2 text-red-500">✕</button>
                  <input placeholder="Platform" value={s.platform} onChange={e => updateSocial(i, 'platform', e.target.value)} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white" />
                  <input placeholder="URL" value={s.url} onChange={e => updateSocial(i, 'url', e.target.value)} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white" />
                  <input placeholder="Icon (emoji)" value={s.icon} onChange={e => updateSocial(i, 'icon', e.target.value)} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white" />
                </div>
              ))}
              <div className="flex gap-4"><button onClick={addSocial} className="px-4 py-2 bg-green-600 rounded-lg">+ Add Social</button><button onClick={saveSocial} className="px-4 py-2 bg-purple-600 rounded-lg">Save Social</button></div>
            </div>
          )}
          {tab === 'image' && (
            <div className="space-y-6 text-center">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile" 
                  className="w-48 h-48 rounded-full mx-auto border-4 border-purple-500 object-cover"
                />
              ) : (
                <div className="w-48 h-48 rounded-full mx-auto border-4 border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/gif,image/webp" 
                onChange={uploadImage} 
                disabled={uploading}
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg cursor-pointer text-white disabled:opacity-50"
              />
              {uploading && <div className="text-purple-400">Uploading... please wait</div>}
              <p className="text-sm text-gray-400">Select a JPG or PNG image.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main App
function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => setIsAdmin(localStorage.getItem('adminToken') === 'true'), [])
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={isAdmin ? <AdminPanel /> : <AdminLogin onLogin={() => setIsAdmin(true)} />} />
      </Routes>
    </Router>
  )
}

export default App