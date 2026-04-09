import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { fetchProfile, fetchProjects, fetchSocialLinks } from './api';

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, projectsData, socialData] = await Promise.all([
          fetchProfile(),
          fetchProjects(),
          fetchSocialLinks()
        ]);
        setProfile(profileData);
        setProjects(projectsData);
        setSocialLinks(socialData);
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