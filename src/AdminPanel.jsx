import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';

const API_URL = ''; // Replace with your worker URL

function AdminPanel({ token, onLogout }) {
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [contact, setContact] = useState([]);
    const [activeTab, setActiveTab] = useState('projects');
    const [editingItem, setEditingItem] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        title: '', description: '', tech_stack: [], year: '', 
        thumbnail_url: '', live_url: '', github_url: '', featured: 0
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        if (activeTab === 'projects') {
            const res = await fetch(`${API_URL}/api/projects`);
            const data = await res.json();
            setProjects(data);
        } else if (activeTab === 'skills') {
            const res = await fetch(`${API_URL}/api/admin/skills`, { headers });
            const data = await res.json();
            setSkills(data);
        } else if (activeTab === 'contact') {
            const res = await fetch(`${API_URL}/api/admin/contact`, { headers });
            const data = await res.json();
            setContact(data);
        }
    };

    const handleSaveProject = async () => {
        const res = await fetch(`${API_URL}/api/admin/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...formData, id: editingItem?.id })
        });
        if (res.ok) {
            fetchData();
            setShowForm(false);
            setEditingItem(null);
            resetForm();
        }
    };

    const handleDelete = async (type, id) => {
        if (confirm('Delete this item?')) {
            await fetch(`${API_URL}/api/admin/${type}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', tech_stack: [], year: '', thumbnail_url: '', live_url: '', github_url: '', featured: 0 });
        setThumbnailPreview('');
    };

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
                <button onClick={onLogout} className="btn-secondary">Logout</button>
            </div>
            
            <div className="admin-tabs">
                {['projects', 'skills', 'contact'].map(tab => (
                    <button key={tab} className={`admin-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="admin-content">
                {activeTab === 'projects' && (
                    <>
                        <button className="btn-primary" onClick={() => { setShowForm(true); setEditingItem(null); resetForm(); }}>
                            <Plus size={18} /> Add Project
                        </button>
                        
                        <div className="projects-admin-grid">
                            {projects.map(project => (
                                <div key={project.id} className="admin-project-card">
                                    {project.thumbnail_url && <img src={project.thumbnail_url} alt={project.title} className="admin-thumbnail" />}
                                    <div className="admin-project-info">
                                        <h4>{project.title}</h4>
                                        <p>{project.description.substring(0, 100)}...</p>
                                    </div>
                                    <div className="admin-actions">
                                        <button onClick={() => { setEditingItem(project); setFormData(project); setShowForm(true); }}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete('projects', project.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'skills' && (
                    <div className="skills-admin">
                        {/* Similar CRUD UI for skills */}
                        <div className="skills-list">
                            {skills.map(skill => (
                                <div key={skill.id} className="admin-skill-item">
                                    <span>{skill.name} - {skill.category} ({skill.proficiency}%)</span>
                                    <button onClick={() => handleDelete('skills', skill.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="admin-modal">
                    <div className="modal-content">
                        <h3>{editingItem ? 'Edit' : 'Add'} Project</h3>
                        <input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        <input placeholder="Tech stack (comma separated)" onChange={e => setFormData({...formData, tech_stack: e.target.value.split(',')})} />
                        <input placeholder="Thumbnail URL" value={formData.thumbnail_url} onChange={e => { setFormData({...formData, thumbnail_url: e.target.value}); setThumbnailPreview(e.target.value); }} />
                        {thumbnailPreview && <img src={thumbnailPreview} alt="Preview" className="thumbnail-preview" />}
                        <div className="modal-actions">
                            <button onClick={handleSaveProject} className="btn-primary"><Save size={16} /> Save</button>
                            <button onClick={() => setShowForm(false)} className="btn-secondary"><X size={16} /> Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;