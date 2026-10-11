'use client';
import React, { useState } from 'react';

import Icon from '../com/components/AppIcon';

import Button from '../com/components/ui/Button';
import TechnologyRadar from './components/TechnologyRadar';
import InsightCard from './components/InsightCard';
import WebinarLibrary from './components/WebinarLibrary';
import NewsletterSubscription from './components/NewsletterSubscription';
import IndustryContent from './components/IndustryContent';
import InteractiveLearning from './components/InteractiveLearning';

const TechnologyInsights = () => {
  const [activeTab, setActiveTab] = useState('insights');

  const featuredInsights = [
    {
      id: 1,
      title: 'The Future of AI in Enterprise: Beyond ChatGPT Integration',
      category: 'AI/ML',
      excerpt: 'Exploring advanced AI implementations that go beyond simple chatbot integration, including autonomous decision-making systems, predictive analytics, and intelligent process automation that deliver measurable business outcomes.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
      author: {
        name: 'Dr. Sarah Chen',
        role: 'AI Solutions Architect',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      publishDate: '2024-08-23',
      readTime: 12,
      views: '4.2K',
      likes: '287',
      trending: true
    },
    {
      id: 2,
      title: 'Cloud-Native Architecture: Microservices vs. Serverless in 2024',
      category: 'Cloud',
      excerpt: 'Comprehensive analysis of when to choose microservices architecture versus serverless computing, including cost implications, scalability considerations, and real-world implementation strategies for enterprise applications.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      author: {
        name: 'Michael Rodriguez',
        role: 'Cloud Infrastructure Lead',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
      },
      publishDate: '2024-08-21',
      readTime: 15,
      views: '3.8K',
      likes: '234'
    }
  ];

  const recentInsights = [
    {
      id: 3,
      title: 'React 18 Performance Optimization: Advanced Techniques',
      category: 'Web',
      excerpt: 'Deep dive into React 18 performance optimization techniques including concurrent features, automatic batching, and Suspense for data fetching.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
      author: {
        name: 'Jennifer Park',
        role: 'Frontend Architect',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      publishDate: '2024-08-20',
      readTime: 8,
      views: '2.1K',
      likes: '156'
    },
    {
      id: 4,
      title: 'Mobile Security: Zero Trust Implementation for Apps',
      category: 'Mobile',
      excerpt: 'Implementing Zero Trust security principles in mobile applications with practical examples and security frameworks.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop',
      author: {
        name: 'David Kumar',
        role: 'Security Architect',
        avatar: 'https://randomuser.me/api/portraits/men/38.jpg'
      },
      publishDate: '2024-08-19',
      readTime: 10,
      views: '1.9K',
      likes: '143'
    },
    {
      id: 5,
      title: 'Blockchain Beyond Cryptocurrency: Enterprise Use Cases',
      category: 'Blockchain',
      excerpt: 'Exploring practical blockchain applications in supply chain, healthcare, and finance beyond digital currencies.',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop',
      author: {
        name: 'Lisa Thompson',
        role: 'Blockchain Consultant',
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
      },
      publishDate: '2024-08-18',
      readTime: 14,
      views: '2.7K',
      likes: '198'
    },
    {
      id: 6,
      title: 'DevOps Evolution: GitOps and Infrastructure as Code',
      category: 'DevOps',
      excerpt: 'Modern DevOps practices focusing on GitOps workflows and infrastructure automation for scalable deployments.',
      image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=300&h=200&fit=crop',
      author: {
        name: 'Alex Johnson',
        role: 'DevOps Engineer',
        avatar: 'https://randomuser.me/api/portraits/men/29.jpg'
      },
      publishDate: '2024-08-17',
      readTime: 11,
      views: '1.6K',
      likes: '124'
    }
  ];

  const tabs = [
    { id: 'insights', name: 'Latest Insights', icon: 'BookOpen' },
    { id: 'radar', name: 'Technology Radar', icon: 'Radar' },
    { id: 'webinars', name: 'Webinar Library', icon: 'Video' },
    { id: 'industry', name: 'Industry Focus', icon: 'Building' },
    { id: 'learning', name: 'Interactive Learning', icon: 'GraduationCap' }
  ];

  const stats = [
    { label: 'Weekly Insights', value: '50+', icon: 'FileText' },
    { label: 'Expert Contributors', value: '25+', icon: 'Users' },
    { label: 'Technology Areas', value: '12', icon: 'Layers' },
    { label: 'Industry Sectors', value: '8', icon: 'Building' }
  ];

  return (
    <div className="min-h-screen bg-muted">
     
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-800 to-primary/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Technology Insights Hub
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Stay ahead with cutting-edge technology insights, trend analysis, and actionable guidance 
              from industry experts. Transform complex technology decisions into competitive advantages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                iconName="BookOpen"
                iconPosition="left"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Explore Insights
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="Mail"
                iconPosition="left"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Subscribe to Newsletter
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats?.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name={stat?.icon} size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat?.value}</div>
                <div className="text-white/80 text-sm">{stat?.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Navigation Tabs */}
      <section className="bg-white border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-accent text-accent' :'border-transparent text-secondary hover:text-primary hover:border-gray-300'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'insights' && (
          <div className="space-y-12">
            {/* Featured Insights */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-2">Featured Insights</h2>
                  <p className="text-secondary">Deep-dive analysis on the most impactful technology trends</p>
                </div>
                <Button
                  variant="outline"
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredInsights?.map((insight) => (
                  <InsightCard key={insight?.id} insight={insight} featured={true} />
                ))}
              </div>
            </section>

            {/* Recent Insights */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-2">Recent Insights</h2>
                  <p className="text-secondary">Latest technology updates and implementation guides</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-2 border border-border rounded-lg text-sm">
                    <option>All Categories</option>
                    <option>AI/ML</option>
                    <option>Cloud</option>
                    <option>Mobile</option>
                    <option>Web</option>
                    <option>Security</option>
                  </select>
                  <Button
                    variant="outline"
                    iconName="Filter"
                    iconPosition="left"
                    size="sm"
                  >
                    Filter
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentInsights?.map((insight) => (
                  <InsightCard key={insight?.id} insight={insight} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'radar' && <TechnologyRadar />}
        {activeTab === 'webinars' && <WebinarLibrary />}
        {activeTab === 'industry' && <IndustryContent />}
        {activeTab === 'learning' && <InteractiveLearning />}
      </main>
      {/* Newsletter Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSubscription />
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="Layers" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold">GeekyAnts Pro</span>
              </div>
              <p className="text-white/80 mb-4">
                Transforming businesses through cutting-edge technology solutions and strategic insights.
              </p>
              <div className="flex space-x-4">
                <Icon name="Twitter" size={20} className="text-white/60 hover:text-white cursor-pointer" />
                <Icon name="Linkedin" size={20} className="text-white/60 hover:text-white cursor-pointer" />
                <Icon name="Github" size={20} className="text-white/60 hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Insights</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">Latest Articles</a></li>
                <li><a href="#" className="hover:text-white">Technology Radar</a></li>
                <li><a href="#" className="hover:text-white">Industry Reports</a></li>
                <li><a href="#" className="hover:text-white">Webinar Library</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">Implementation Guides</a></li>
                <li><a href="#" className="hover:text-white">Assessment Tools</a></li>
                <li><a href="#" className="hover:text-white">Best Practices</a></li>
                <li><a href="#" className="hover:text-white">Case Studies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">Newsletter</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Events</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; {new Date()?.getFullYear()} GeekyAnts Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TechnologyInsights;