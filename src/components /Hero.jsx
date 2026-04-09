import React from 'react';

function Hero({ profile }) {
  if (!profile) return null;

  return (
    <section id="home" className="min-h-screen flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
              <img
                src={profile.avatar_url || 'https://via.placeholder.com/128'}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover bg-gray-800"
              />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            {profile.name}
          </h1>
          <p className="text-xl md:text-2xl text-purple-400 mb-6">{profile.title}</p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">{profile.bio}</p>
          <button
            onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-all duration-200 transform hover:scale-105"
          >
            View Projects
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;