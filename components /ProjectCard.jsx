import React, { useState } from 'react';

function ProjectCard({ project }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative overflow-hidden h-48">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
        )}
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Live Demo →
          </a>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-500 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
        
        {project.technologies && (
          <div className="flex flex-wrap gap-2">
            {JSON.parse(project.technologies).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs bg-purple-600/20 text-purple-400 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;