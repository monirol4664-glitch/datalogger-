import React, { useState, useEffect } from 'react';

function ProjectCard({ project, apiBaseUrl }) {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (project.thumbnail_base64 && project.thumbnail_base64.startsWith('data:')) {
      setThumbnailUrl(project.thumbnail_base64);
    } 
    else if (project.link) {
      const encodedUrl = encodeURIComponent(project.link);
      setThumbnailUrl(`${apiBaseUrl}/api/screenshot?url=${encodedUrl}`);
    }
  }, [project, apiBaseUrl]);

  return (
    <div className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative overflow-hidden h-48 bg-gray-800">
        {thumbnailUrl && !imageError ? (
          <img
            src={thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="text-purple-500 text-4xl mb-2">🌐</div>
            <div className="text-gray-400 text-sm truncate max-w-full">{project.link}</div>
            <div className="text-gray-500 text-xs mt-2">Click to visit</div>
          </div>
        )}
        
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