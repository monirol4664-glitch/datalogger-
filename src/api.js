// Replace with your Worker URL after deployment
const WORKER_URL = 'https://icy-cherry-b7d7.monirol4664.workers.dev';

let adminToken = localStorage.getItem('adminToken');

export const api = {
  // Public endpoints
  async getProjects() {
    const res = await fetch(`${WORKER_URL}/api/projects`);
    return res.json();
  },
  
  async getSkills() {
    const res = await fetch(`${WORKER_URL}/api/skills`);
    return res.json();
  },
  
  async getContact() {
    const res = await fetch(`${WORKER_URL}/api/contact`);
    return res.json();
  },
  
  // Admin endpoints
  async login(username, password) {
    const res = await fetch(`${WORKER_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      adminToken = data.token;
      localStorage.setItem('adminToken', adminToken);
    }
    return data;
  },
  
  logout() {
    adminToken = null;
    localStorage.removeItem('adminToken');
  },
  
  getToken() {
    return adminToken;
  },
  
  async createProject(project) {
    const res = await fetch(`${WORKER_URL}/api/admin/projects`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(project)
    });
    return res.json();
  },
  
  async deleteProject(id) {
    const res = await fetch(`${WORKER_URL}/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    return res.json();
  },
  
  async createSkill(skill) {
    const res = await fetch(`${WORKER_URL}/api/admin/skills`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(skill)
    });
    return res.json();
  },
  
  async deleteSkill(id) {
    const res = await fetch(`${WORKER_URL}/api/admin/skills/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    return res.json();
  },
  
  async updateContact(type, value) {
    const res = await fetch(`${WORKER_URL}/api/admin/contact`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ type, value })
    });
    return res.json();
  }
};