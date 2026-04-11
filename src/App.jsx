import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

// Custom Cursor
const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hover, setHover] = useState(false)
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    const over = (e) => { if (e.target.closest('a, button, .hover-glow')) setHover(true) }
    const out = () => setHover(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mouseout', out)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); window.removeEventListener('mouseout', out) }
  }, [])
  return <div className={`fixed pointer-events-none z-50 rounded-full mix-blend-difference transition-all duration-150 ${hover ? 'w-16 h-16 bg-white' : 'w-6 h-6 bg-purple-500'}`} style={{ left: pos.x - 12, top: pos.y - 12 }} />
}

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
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:scale-105 transition">PORTFOLIO</Link>
        <div className="flex gap-8">
          {['/', '/works', '/contact'].map((p, i) => (
            <Link key={i} to={p} className={`relative text-sm uppercase tracking-wider transition-colors hover:text-purple-400 ${location.pathname === p ? 'text-purple-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-purple-400' : 'text-gray-400'}`}>{p === '/' ? 'Home' : p.slice(1)}</Link>
          ))}
          {isAdmin && <Link to="/admin" className="text-sm uppercase tracking-wider text-gray-400 hover:text-purple-400">Admin</Link>}
        </div>
      </div>
    </nav>
  )
}

// 3D Card
const Card3D = ({ children }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const ref = useRef()
  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setRotate({ x: y * 10, y: x * 10 })
    }
  }
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={() => setRotate({ x: 0, y: 0 })} style={{ transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }} className="transition-all duration-300 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-xl">
      {children}
    </div>
  )
}

// Home Page
const HomePage = () => {
  const [content, setContent] = useState({ name: '', title: '', bio: '', education: [], expertise: [] })
  const [imageError, setImageError] = useState(false)
  const [imageKey, setImageKey] = useState(Date.now())
  const [loading, setLoading] = useState(true)
  
  

// To this:
const imageUrl = `${API_BASE}/api/image?t=${imageKey}`

  useEffect(() => {
    axios.get(`${API_BASE}/api/content`)
      .then(res => setContent(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const refreshImage = () => {
    setImageKey(Date.now())
    setImageError(false)
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-purple-500" /></div>

  return (
    <div className="bg-black text-white">
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 animate-gradient" />
        <div className="relative z-10 text-center px-6">
          {!imageError ? (
            <div className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl hover:scale-105 transition duration-300">
              <img 
                src={imageUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                onLoad={() => console.log('Image loaded successfully')}
              />
            </div>
          ) : (
            <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
          )}
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">{content.name || 'John Doe'}</h1>
          <p className="text-xl md:text-2xl text-gray-300 tracking-wide">{content.title || 'Creative Developer'}</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        <div className="grid md:grid-cols-2 gap-12">
          <Card3D>
            <h2 className="text-3xl font-bold mb-8 flex gap-3"><span className="text-4xl">📚</span> Education</h2>
            {content.education?.map((edu, idx) => (
              <div key={idx} className="group relative pl-6 border-l-2 border-purple-500 hover:border-purple-300 transition mb-6">
                <h3 className="text-xl font-semibold group-hover:text-purple-400">{edu.degree}</h3>
                <p className="text-gray-400">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
              </div>
            ))}
          </Card3D>
          <Card3D>
            <h2 className="text-3xl font-bold mb-8 flex gap-3"><span className="text-4xl">💡</span> Expertise</h2>
            <div className="flex flex-wrap gap-3">
              {content.expertise?.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 border border-purple-500/30 hover:bg-purple-500/40 hover:scale-105 transition">{skill}</span>
              ))}
            </div>
          </Card3D>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition" />
          <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">About Me</h2>
            <p className="text-gray-300 text-center text-lg max-w-3xl mx-auto">{content.bio || 'No bio yet'}</p>
          </div>
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
    axios.get(`${API_BASE}/api/works`).then(res => { setWorks(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  const getYouTubeId = (url) => { const m = url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/); return m && m[2]?.length === 11 ? m[2] : null }
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-purple-500" /></div>
  return (
    <div className="bg-black pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-16 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Explore My Works</h1>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {works.map((work, idx) => (
            <div key={idx} className="break-inside-avoid group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02]">
              {work.type === 'website' ? (
                <>
                  <div className="relative h-56 overflow-hidden">
                    <img src={work.thumbnail} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <a href={work.url} target="_blank" rel="noopener" className="px-6 py-2 bg-purple-600 rounded-full text-sm font-semibold">Visit →</a>
                    </div>
                  </div>
                  <div className="p-6"><h3 className="text-xl font-semibold">{work.title}</h3><p className="text-gray-400 text-sm">{work.description}</p></div>
                </>
              ) : (
                <>
                  <div className="relative pb-[56.25%]"><iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${getYouTubeId(work.url)}`} title={work.title} frameBorder="0" allowFullScreen /></div>
                  <div className="p-6"><h3 className="text-xl font-semibold">{work.title}</h3><p className="text-gray-400 text-sm mt-1">{work.description}</p></div>
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
  const [links, setLinks] = useState([])
  useEffect(() => { axios.get(`${API_BASE}/api/social-links`).then(res => setLinks(res.data)) }, [])
  return (
    <div className="bg-black min-h-screen flex items-center justify-center pt-32 pb-24 px-6">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Let's Connect</h1>
        <div className="flex flex-wrap justify-center gap-8">
          {links.map((link, idx) => (
            <a key={idx} href={link.url} target="_blank" rel="noopener" className="group relative w-32 h-32 flex flex-col items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-purple-500 transition-all duration-300 hover:scale-110">
              <span className="text-4xl mb-2 group-hover:animate-bounce">{link.icon || '🔗'}</span>
              <span className="text-sm font-semibold text-gray-300 group-hover:text-purple-400">{link.platform}</span>
              <div className="absolute inset-0 rounded-full bg-purple-500/0 group-hover:bg-purple-500/10 transition -z-10" />
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
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold">{loading ? 'Logging in...' : 'Login'}</button>
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
  const [imageUrl, setImageUrl] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/api/content`),
      axios.get(`${API_BASE}/api/works`),
      axios.get(`${API_BASE}/api/social-links`)
    ]).then(([c, w, s]) => {
      setContent(c.data)
      setWorks(w.data)
      setSocial(s.data)
      setImageUrl(`${API_BASE}/api/image?t=${Date.now()}`)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const updateContent = async () => {
    try { await axios.post(`${API_BASE}/api/admin/update-content`, content); setMessage('Content saved'); setTimeout(() => setMessage(''), 3000) } catch { setMessage('Error') }
  }
  
  const uploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      setMessage('Please select a file')
      return
    }
    
    setUploading(true)
    setMessage('Uploading...')
    
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const imageData = reader.result
        console.log('Sending image:', { mimeType: file.type, dataLength: imageData.length })
        
        const response = await axios.post(`${API_BASE}/api/admin/upload-image`, {
          imageData: imageData,
          mimeType: file.type
        })
        
        console.log('Upload response:', response.data)
        
        if (response.data.success) {
          setMessage(`Success! ${response.data.message}`)
          // Refresh image with cache busting
          setImageUrl(`${API_BASE}/api/profile-image/raw?t=${Date.now()}`)
        } else {
          setMessage('Upload failed: ' + (response.data.error || 'Unknown error'))
        }
      } catch (err) {
        console.error('Upload error:', err)
        setMessage('Error: ' + (err.response?.data?.error || err.message))
      } finally {
        setUploading(false)
        setTimeout(() => setMessage(''), 3000)
      }
    }
    reader.onerror = () => {
      setMessage('Error reading file')
      setUploading(false)
    }
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
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt="Profile" 
                  className="w-48 h-48 rounded-full mx-auto border-4 border-purple-500 object-cover"
                  onError={(e) => { console.error('Admin image failed to load'); e.target.style.display = 'none' }}
                  onLoad={() => console.log('Admin image loaded')}
                />
              )}
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/gif,image/webp" 
                onChange={uploadImage} 
                disabled={uploading}
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg cursor-pointer text-white disabled:opacity-50"
              />
              {uploading && <div className="text-purple-400">Uploading... please wait</div>}
              <p className="text-sm text-gray-400">Select a JPG or PNG image. It will be stored as BLOB in D1.</p>
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
      <CustomCursor />
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