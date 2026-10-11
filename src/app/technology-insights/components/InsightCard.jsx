'use client';
import React from 'react';
import Icon from '../../com/components/AppIcon';
import Image from '../../com/components/AppImage';

const InsightCard = ({ insight, featured = false }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'AI/ML': return 'Brain';
      case 'Cloud': return 'Cloud';
      case 'Mobile': return 'Smartphone';
      case 'Web': return 'Globe';
      case 'Blockchain': return 'Link';
      case 'DevOps': return 'Settings';
      default: return 'FileText';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'AI/ML': return 'bg-purple-100 text-purple-800';
      case 'Cloud': return 'bg-blue-100 text-blue-800';
      case 'Mobile': return 'bg-green-100 text-green-800';
      case 'Web': return 'bg-orange-100 text-orange-800';
      case 'Blockchain': return 'bg-indigo-100 text-indigo-800';
      case 'DevOps': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (featured) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={insight?.image}
            alt={insight?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(insight?.category)}`}>
              {insight?.category}
            </span>
          </div>
          {insight?.trending && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Icon name="TrendingUp" size={12} />
              <span>Trending</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-3 text-sm text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{insight?.publishDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{insight?.readTime} min read</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
            {insight?.title}
          </h3>
          
          <p className="text-secondary mb-4 line-clamp-3">
            {insight?.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src={insight?.author?.avatar}
                alt={insight?.author?.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium text-primary text-sm">{insight?.author?.name}</div>
                <div className="text-xs text-secondary">{insight?.author?.role}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-secondary">
              <div className="flex items-center space-x-1">
                <Icon name="Eye" size={14} />
                <span className="text-sm">{insight?.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Heart" size={14} />
                <span className="text-sm">{insight?.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-32 overflow-hidden">
        <Image
          src={insight?.image}
          alt={insight?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(insight?.category)}`}>
            {insight?.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-2 text-xs text-secondary">
          <span>{insight?.publishDate}</span>
          <span>•</span>
          <span>{insight?.readTime} min</span>
        </div>
        
        <h4 className="font-semibold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-300">
          {insight?.title}
        </h4>
        
        <p className="text-secondary text-sm mb-3 line-clamp-2">
          {insight?.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src={insight?.author?.avatar}
              alt={insight?.author?.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs font-medium text-primary">{insight?.author?.name}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-secondary">
            <Icon name="Eye" size={12} />
            <span className="text-xs">{insight?.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;