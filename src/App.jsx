import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Replace with your Worker URL after deployment
const API_URL = 'https://icy-cherry-b7d7.monirol4664.workers.dev';

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, projectsRes, socialRes] = await Promise.all([
          fetch(`${API_URL}/api/profile`),
          fetch(`${API_URL}/api/projects`),
          fetch(`${API_URL}/api/social-links`)
        ]);
        
        setProfile(await profileRes.json());
        setProjects(await projectsRes.json());
        setSocialLinks(await socialRes.json());
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse text-purple-500 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <Hero profile={profile} />
      <Projects projects={projects} />
      <Contact socialLinks={socialLinks} profile={profile} />
      <Footer />
    </div>
  );
}

export default App;