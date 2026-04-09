import React, { useState } from 'react';

function Contact({ socialLinks, profile }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // You can add a contact form endpoint in worker.js later
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
    }, 1000);
  };

  const iconMap = {
    github: '🐙',
    linkedin: '🔗',
    twitter: '🐦',
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Get In <span className="text-purple-500">Touch</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Have a project in mind? Let's work together!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h3 className="text-2xl font-semibold mb-4">Contact Info</h3>
              {profile?.email && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📧</span>
                  <a href={`mailto:${profile.email}`} className="text-gray-400 hover:text-purple-500 transition-colors">
                    {profile.email}
                  </a>
                </div>
              )}
              
              <div className="flex gap-4 mt-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center text-xl transition-all duration-200 transform hover:scale-110"
                  >
                    {iconMap[link.platform] || '🔗'}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
            <textarea
              rows="5"
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
            ></textarea>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Sending...' : 'Send Message →'}
            </button>
            {status === 'success' && (
              <p className="text-green-500 text-center animate-fade-in">Message sent successfully!</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;