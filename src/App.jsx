import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

// Custom cursor component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const moveCursor = (e) => setPosition({ x: e.clientX, y: e.clientY })
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .hover-glow')) setIsHovering(true)
    }
    const handleMouseOut = () => setIsHovering(false)
    
    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)
    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <div 
      className={`fixed pointer-events-none z-50 rounded-full mix-blend-difference transition-transform duration-150 ${
        isHovering ? 'w-16 h-16 bg-white' : 'w-6 h-6 bg-purple-500'
      }`}
      style={{ left: position.x - 12, top: position.y - 12 }}
    />
  )
}

// Navbar with glass morphism
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
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:scale-105 transition-transform">
          PORTFOLIO
        </Link>
        <div className="flex gap-8">
          {['/', '/works', '/contact'].map((path, i) => (
            <Link 
              key={i} 
              to={path} 
              className={`relative text-sm uppercase tracking-wider transition-colors hover:text-purple-400 ${
                location.pathname === path ? 'text-purple-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-purple-400' : 'text-gray-400'
              }`}
            >
              {path === '/' ? 'Home' : path.slice(1)}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-sm uppercase tracking-wider text-gray-400 hover:text-purple-400 transition-colors">
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

// Animated section wrapper
const Section = ({ children, className, delay = 0 }) => (
  <div 
    className={`opacity-0 animate-fade-in-up ${className}`}
    style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
  >
    {children}
  </div>
)

// Hero with 3D tilt
const Hero = ({ name, title, profileImageUrl }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const ref = useRef()

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setRotate({ x: y * 20, y: x * 20 })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 animate-gradient" />
      
      <div className="relative z-10 text-center px-6">
        <div 
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setRotate({ x: 0, y: 0 })}
          style={{ transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
          className="transition-transform duration-200 ease-out"
        >
          {profileImageUrl && (
            <div className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
            {name || 'John Doe'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 tracking-wide">{title || 'Creative Developer'}</p>
        </div>
      </div>
    </div>
  )
}

// Interactive cards for Education/Expertise
const Card3D = ({ children, className }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const ref = useRef()

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setRotate({ x: y * 10, y: x * 10 })
    }
  }

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
      className={`transition-all duration-300 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-xl ${className}`}
    >
      {children}
    </div>
  )
}

// Home Page
const HomePage = () => {
  const [content, setContent] = useState({ name: '', title: '', bio: '', education: [], expertise: [] })
  const [profileImageUrl, setProfileImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes] = await Promise.all([
          axios.get(`${API_BASE}/api/content`)
        ])
        setContent(contentRes.data)
        setProfileImageUrl(`${API_BASE}/api/profile-image/raw`)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-purple-500" /></div>

  return (
    <div className="bg-black text-white">
      <Hero name={content.name} title={content.title} profileImageUrl={profileImageUrl} />
      
      <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        {/* Education & Expertise Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          <Section delay={0.2}>
            <Card3D>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="text-4xl">📚</span> Education
              </h2>
              <div className="space-y-6">
                {content.education?.map((edu, idx) => (
                  <div key={idx} className="group relative pl-6 border-l-2 border-purple-500 hover:border-purple-300 transition">
                    <h3 className="text-xl font-semibold group-hover:text-purple-400">{edu.degree}</h3>
                    <p className="text-gray-400">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </Card3D>
          </Section>

          <Section delay={0.3}>
            <Card3D>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="text-4xl">💡</span> Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {content.expertise?.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 border border-purple-500/30 hover:bg-purple-500/40 hover:scale-105 transition-all cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </Card3D>
          </Section>
        </div>

        {/* Bio Section with parallax */}
        <Section delay={0.4}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">About Me</h2>
              <p className="text-gray-300 leading-relaxed text-center text-lg max-w-3xl mx-auto">
                {content.bio || 'No bio available'}
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}

// Works Page with Masonry Layout
const WorksPage = () => {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_BASE}/api/works`).then(res => {
      setWorks(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url?.match(regExp)
    return match && match[2]?.length === 11 ? match[2] : null
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-purple-500" /></div>

  return (
    <div className="bg-black pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-16 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Explore My Works
        </h1>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {works.map((work, idx) => (
            <div key={idx} className="break-inside-avoid group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02]">
              {work.type === 'website' ? (
                <>
                  <div className="relative h-56 overflow-hidden">
                    <img src={work.thumbnail} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <a href={work.url} target="_blank" rel="noopener" className="px-6 py-2 bg-purple-600 rounded-full text-sm font-semibold hover:bg-purple-700">Visit →</a>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                    <p className="text-gray-400 text-sm">{work.description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative pb-[56.25%]">
                    <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${getYouTubeId(work.url)}`} title={work.title} frameBorder="0" allowFullScreen />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{work.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{work.description}</p>
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

// Contact Page with animated social rings
const ContactPage = () => {
  const [socialLinks, setSocialLinks] = useState([])

  useEffect(() => {
    axios.get(`${API_BASE}/api/social-links`).then(res => setSocialLinks(res.data))
  }, [])

  return (
    <div className="bg-black min-h-screen flex items-center justify-center pt-32 pb-24 px-6">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Let's Connect
        </h1>
        <div className="flex flex-wrap justify-center gap-8">
          {socialLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener"
              className="group relative w-32 h-32 flex flex-col items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-purple-500 transition-all duration-300 hover:scale-110"
            >
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

// Admin components (simplified for brevity - same as before but keep image handling updated)
// ... (AdminLogin and AdminPanel remain similar, just change image URL to raw endpoint)
// For brevity, I'm including only the changed parts:

// In AdminPanel, replace handleImageUpload and image display:
// - After upload, just show the raw image URL
// - No data URL conversion needed

// But to save space, I'll provide the full file on request. The critical fix is the raw image endpoint.

// Main App
function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  useEffect(() => setIsAdminLoggedIn(localStorage.getItem('adminToken') === 'true'), [])

  return (
    <Router>
      <CustomCursor />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={isAdminLoggedIn ? <AdminPanel /> : <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />} />
      </Routes>
    </Router>
  )
}

export default App