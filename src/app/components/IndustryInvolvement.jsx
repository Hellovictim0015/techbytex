"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../com/components/AppIcon';
import Image from '../com/components/AppImage';

const IndustryInvolvement = () => {
  const [activeTab, setActiveTab] = useState('speaking');

  const involvementTabs = [
    { id: 'speaking', name: 'Conference Speaking', icon: 'Mic' },
    { id: 'opensource', name: 'Open Source', icon: 'Github' },
    { id: 'community', name: 'Community', icon: 'Users' },
    { id: 'recognition', name: 'Recognition', icon: 'Award' }
  ];

  const involvementData = {
    speaking: {
      title: "Conference Speaking & Thought Leadership",
      description: "Our team regularly shares insights and innovations at major industry conferences worldwide.",
      items: [
        {
          event: "AWS re:Invent 2024",
          speaker: "Sarah Chen, CTO",
          topic: "Scaling AI Workloads in the Cloud",
          audience: "5,000+ attendees",
          date: "December 2024",
          location: "Las Vegas, USA",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
          highlights: ["Keynote presentation", "Live demo of AI platform", "Q&A with industry leaders"]
        },
        {
          event: "Google I/O 2024",
          speaker: "Alex Kumar, Principal Architect",
          topic: "Modern Web Architecture Patterns",
          audience: "3,500+ attendees",
          date: "May 2024",
          location: "Mountain View, USA",
          image: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=300&fit=crop",
          highlights: ["Technical deep-dive", "Open source project launch", "Developer workshop"]
        },
        {
          event: "TechCrunch Disrupt 2024",
          speaker: "Marcus Rodriguez, CEO",
          topic: "The Future of Enterprise Technology",
          audience: "8,000+ attendees",
          date: "October 2024",
          location: "San Francisco, USA",
          image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop",
          highlights: ["Startup pitch judge", "Panel discussion", "Media interviews"]
        }
      ]
    },
    opensource: {
      title: "Open Source Project Leadership",
      description: "Contributing to the global developer community through open source projects and initiatives.",
      items: [
        {
          project: "ReactFlow Pro",
          maintainer: "Alex Kumar",
          description: "Advanced React component library for building interactive node-based UIs",
          stats: "15K+ GitHub stars, 2M+ weekly downloads",
          contributors: "150+ contributors",
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
          highlights: ["Used by 500+ companies", "Featured in React docs", "Active community support"]
        },
        {
          project: "CloudNative Toolkit",
          maintainer: "Sarah Chen",
          description: "Comprehensive toolkit for cloud-native application development and deployment",
          stats: "8K+ GitHub stars, 500K+ downloads",
          contributors: "75+ contributors",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
          highlights: ["CNCF sandbox project", "Multi-cloud support", "Enterprise adoption"]
        },
        {
          project: "AI Ethics Framework",
          maintainer: "Emily Watson",
          description: "Open framework for implementing ethical AI practices in enterprise applications",
          stats: "5K+ GitHub stars, 100K+ downloads",
          contributors: "40+ contributors",
          image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
          highlights: ["Industry standard adoption", "Academic partnerships", "Policy influence"]
        }
      ]
    },
    community: {
      title: "Technology Community Contributions",
      description: "Active participation in technology communities, fostering knowledge sharing and collaboration.",
      items: [
        {
          community: "React Developer Community",
          role: "Core Organizer",
          members: "50,000+ members",
          activities: "Monthly meetups, workshops, mentorship programs",
          impact: "Helped 1,000+ developers advance their careers",
          image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop",
          highlights: ["Monthly tech talks", "Mentorship program", "Job placement assistance"]
        },
        {
          community: "Women in Tech Initiative",
          role: "Founding Sponsor",
          members: "25,000+ members",
          activities: "Scholarships, coding bootcamps, career guidance",
          impact: "Supported 500+ women entering tech careers",
          image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop",
          highlights: ["Annual scholarship program", "Coding bootcamp partnerships", "Leadership development"]
        },
        {
          community: "Open Source Sustainability Fund",
          role: "Board Member",
          members: "100+ projects supported",
          activities: "Funding, mentorship, infrastructure support",
          impact: "Distributed $2M+ to open source projects",
          image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
          highlights: ["Project sustainability focus", "Maintainer support", "Infrastructure funding"]
        }
      ]
    },
    recognition: {
      title: "Industry Recognition & Awards",
      description: "Recognition from industry peers and organizations for our contributions to technology and innovation.",
      items: [
        {
          award: "Technology Innovation Award 2024",
          organization: "Tech Industry Association",
          category: "AI/ML Solutions",
          achievement: "Revolutionary healthcare AI platform",
          date: "November 2024",
          image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=300&fit=crop",
          highlights: ["Industry-first innovation", "Patient outcome improvement", "Scalable solution design"]
        },
        {
          award: "Best Workplace Culture 2024",
          organization: "Great Place to Work",
          category: "Technology Companies",
          achievement: "Outstanding employee satisfaction and culture",
          date: "September 2024",
          image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
          highlights: ["98% employee satisfaction", "Diversity & inclusion leadership", "Innovation culture"]
        },
        {
          award: "Sustainability Leadership Award",
          organization: "Green Tech Alliance",
          category: "Carbon Neutral Operations",
          achievement: "First carbon-neutral tech consultancy",
          date: "June 2024",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
          highlights: ["100% renewable energy", "Carbon offset programs", "Sustainable practices"]
        }
      ]
    }
  };

  const currentData = involvementData?.[activeTab];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Industry{' '}
            <span className="text-gradient bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Leadership & Impact
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Active industry participation through conference speaking, open-source leadership, community contributions, and thought leadership recognition.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {involvementTabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab?.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon name={tab?.icon} size={18} />
              <span>{tab?.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">{currentData?.title}</h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">{currentData?.description}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentData?.items?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item?.image}
                    alt={item?.event || item?.project || item?.community || item?.award}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-bold text-lg">
                      {item?.event || item?.project || item?.community || item?.award}
                    </h4>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {activeTab === 'speaking' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Icon name="User" size={16} className="text-emerald-600" />
                        <span className="text-sm font-medium text-slate-900">{item?.speaker}</span>
                      </div>
                      <p className="text-slate-600">{item?.topic}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{item?.audience}</span>
                        <span>{item?.date}</span>
                      </div>
                    </>
                  )}

                  {activeTab === 'opensource' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Icon name="User" size={16} className="text-emerald-600" />
                        <span className="text-sm font-medium text-slate-900">{item?.maintainer}</span>
                      </div>
                      <p className="text-slate-600">{item?.description}</p>
                      <div className="text-sm text-slate-500">
                        <div>{item?.stats}</div>
                        <div>{item?.contributors}</div>
                      </div>
                    </>
                  )}

                  {activeTab === 'community' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Icon name="Users" size={16} className="text-emerald-600" />
                        <span className="text-sm font-medium text-slate-900">{item?.role}</span>
                      </div>
                      <p className="text-slate-600">{item?.activities}</p>
                      <div className="text-sm text-slate-500">
                        <div>{item?.members}</div>
                        <div className="font-medium text-emerald-600">{item?.impact}</div>
                      </div>
                    </>
                  )}

                  {activeTab === 'recognition' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Icon name="Award" size={16} className="text-emerald-600" />
                        <span className="text-sm font-medium text-slate-900">{item?.organization}</span>
                      </div>
                      <p className="text-slate-600">{item?.achievement}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{item?.category}</span>
                        <span>{item?.date}</span>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-slate-900">Key Highlights</h5>
                    <div className="space-y-1">
                      {item?.highlights?.map((highlight, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          <span className="text-xs text-slate-600">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustryInvolvement;