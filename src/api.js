const API_BASE = import.meta.env.PROD ? '' : '/api';

export async function fetchProfile() {
  const res = await fetch(`${API_BASE}/api/profile`);
  const data = await res.json();
  return data.data;
}

export async function fetchProjects(featured = false) {
  const url = featured ? `${API_BASE}/api/projects?featured=true` : `${API_BASE}/api/projects`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data;
}

export async function fetchSocialLinks() {
  const res = await fetch(`${API_BASE}/api/social-links`);
  const data = await res.json();
  return data.data;
}