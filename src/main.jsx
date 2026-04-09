import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminPanel from './AdminPanel';
import './App.css'
const API_URL ='';
// In your main App component
useEffect(() => {
    const fetchData = async () => {
        const projectsRes = await fetch(`${API_URL}/api/projects`);
        const skillsRes = await fetch(`${API_URL}/api/skills`);
        const contactRes = await fetch(`${API_URL}/api/contact`);
        
        setProjects(await projectsRes.json());
        setSkills(await skillsRes.json());
        setContact(await contactRes.json());
    };
    fetchData();
}, []);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)