'use client';
import React, { useState } from 'react';
import Icon from '../../com/components/AppIcon';
import Image from '../../com/components/AppImage';
import Button from '../../com/components/ui/Button';

const WebinarLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Webinars', count: 24 },
    { id: 'ai-ml', name: 'AI/ML Integration', count: 8 },
    { id: 'cloud', name: 'Cloud Migration', count: 6 },
    { id: 'transformation', name: 'Digital Transformation', count: 5 },
    { id: 'security', name: 'Security', count: 3 },
    { id: 'mobile', name: 'Mobile Development', count: 2 }
  ];

  const webinars = [
    {
      id: 1,
      title: 'AI-Powered Customer Experience: From Strategy to Implementation',
      category: 'ai-ml',
      duration: '45 min',
      date: '2024-08-20',
      views: '2.3K',
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop',
      speaker: {
        name: 'Dr. Sarah Chen',
        role: 'AI Solutions Architect',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      description: 'Learn how to integrate AI technologies into customer-facing applications for enhanced user experience and business outcomes.',
      topics: ['Machine Learning Models', 'Natural Language Processing', 'Recommendation Systems', 'Implementation Best Practices'],
      resources: ['Slides (PDF)', 'Code Examples', 'Implementation Checklist', 'Q&A Transcript']
    },
    {
      id: 2,
      title: 'Cloud Migration Strategies: Zero-Downtime Enterprise Transitions',
      category: 'cloud',
      duration: '60 min',
      date: '2024-08-15',
      views: '1.8K',
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
      speaker: {
        name: 'Michael Rodriguez',
        role: 'Cloud Infrastructure Lead',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
      },
      description: 'Comprehensive guide to planning and executing enterprise cloud migrations with minimal business disruption.',
      topics: ['Migration Planning', 'Risk Assessment', 'Containerization', 'Monitoring & Optimization'],
      resources: ['Migration Playbook', 'Risk Assessment Template', 'Cost Calculator', 'Monitoring Scripts']
    },
    {
      id: 3,
      title: 'Digital Transformation ROI: Measuring Success in Modern Enterprises',
      category: 'transformation',
      duration: '50 min',
      date: '2024-08-10',
      views: '3.1K',
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
      speaker: {
        name: 'Jennifer Park',
        role: 'Digital Strategy Consultant',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      description: 'Framework for measuring and optimizing ROI from digital transformation initiatives across different business functions.',
      topics: ['KPI Definition', 'Measurement Frameworks', 'Business Case Development', 'Stakeholder Alignment'],
      resources: ['ROI Calculator', 'KPI Templates', 'Business Case Framework', 'Success Stories']
    },
    {
      id: 4,
      title: 'Zero Trust Security Architecture for Modern Applications',
      category: 'security',
      duration: '55 min',
      date: '2024-08-05',
      views: '1.5K',
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop',
      speaker: {
        name: 'David Kumar',
        role: 'Security Architect',
        avatar: 'https://randomuser.me/api/portraits/men/38.jpg'
      },
      description: 'Implementation guide for Zero Trust security models in cloud-native and hybrid environments.',
      topics: ['Zero Trust Principles', 'Identity Management', 'Network Segmentation', 'Continuous Monitoring'],
      resources: ['Security Checklist', 'Implementation Guide', 'Policy Templates', 'Compliance Mapping']
    }
  ];

  const filteredWebinars = webinars?.filter(webinar => {
    const matchesCategory = selectedCategory === 'all' || webinar?.category === selectedCategory;
    const matchesSearch = webinar?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         webinar?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">Webinar Library</h3>
        <p className="text-secondary">
          Expert-led sessions on complex technology topics with searchable transcripts and downloadable resources
        </p>
      </div>
      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search webinars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setSelectedCategory(category?.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedCategory === category?.id
                  ? 'bg-accent text-white' :'bg-gray-100 text-secondary hover:bg-gray-200'
              }`}
            >
              {category?.name} ({category?.count})
            </button>
          ))}
        </div>
      </div>
      {/* Webinar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWebinars?.map((webinar) => (
          <div key={webinar?.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="relative">
              <Image
                src={webinar?.thumbnail}
                alt={webinar?.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="default"
                  size="lg"
                  iconName="Play"
                  iconPosition="left"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Watch Now
                </Button>
              </div>
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                {webinar?.duration}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-secondary">{webinar?.date}</span>
                <div className="flex items-center space-x-4 text-sm text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="Eye" size={14} />
                    <span>{webinar?.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-yellow-500" />
                    <span>{webinar?.rating}</span>
                  </div>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-primary mb-3">{webinar?.title}</h4>
              <p className="text-secondary mb-4">{webinar?.description}</p>

              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src={webinar?.speaker?.avatar}
                  alt={webinar?.speaker?.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-primary">{webinar?.speaker?.name}</div>
                  <div className="text-sm text-secondary">{webinar?.speaker?.role}</div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="font-medium text-primary mb-2">Key Topics:</h5>
                <div className="flex flex-wrap gap-2">
                  {webinar?.topics?.map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-muted text-secondary text-sm rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h5 className="font-medium text-primary mb-2">Available Resources:</h5>
                <div className="flex flex-wrap gap-2">
                  {webinar?.resources?.map((resource, index) => (
                    <button
                      key={index}
                      className="flex items-center space-x-1 text-accent hover:text-accent/80 text-sm"
                    >
                      <Icon name="Download" size={12} />
                      <span>{resource}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredWebinars?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-secondary mx-auto mb-4" />
          <h4 className="text-lg font-medium text-primary mb-2">No webinars found</h4>
          <p className="text-secondary">Try adjusting your search criteria or browse all categories</p>
        </div>
      )}
    </div>
  );
};

export default WebinarLibrary;