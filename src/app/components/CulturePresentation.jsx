"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../com/components/AppIcon';
import Image from '../com/components/AppImage';

const CulturePresentation = () => {
  const [activeTab, setActiveTab] = useState('workplace');

  const cultureTabs = [
    { id: 'workplace', name: 'Workplace', icon: 'Building' },
    { id: 'collaboration', name: 'Collaboration', icon: 'Users' },
    { id: 'innovation', name: 'Innovation Lab', icon: 'Lightbulb' },
    { id: 'community', name: 'Community', icon: 'Heart' }
  ];

  const cultureContent = {
    workplace: {
      title: "Our Collaborative Environment",
      description: "Step inside our offices and experience the energy of innovation, where open spaces foster creativity and focused zones enable deep work.",
      highlights: [
        "Open-concept design promoting cross-team collaboration",
        "Quiet zones for focused development work",
        "Recreational areas for team bonding and relaxation",
        "State-of-the-art technology infrastructure"
      ],
      images: [
        {
          src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
          alt: "Modern office workspace with collaborative areas",
          caption: "Open collaboration spaces"
        },
        {
          src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop",
          alt: "Team members working together in modern office",
          caption: "Team collaboration in action"
        },
        {
          src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop",
          alt: "Comfortable break area with modern furniture",
          caption: "Relaxation and break areas"
        }
      ]
    },
    collaboration: {
      title: "Teamwork in Action",
      description: "Witness how our diverse teams come together to solve complex challenges, sharing knowledge and building solutions that exceed expectations.",
      highlights: [
        "Cross-functional project teams with diverse expertise",
        "Daily stand-ups and collaborative planning sessions",
        "Peer code reviews and knowledge sharing",
        "Mentorship programs for continuous learning"
      ],
      images: [
        {
          src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
          alt: "Team brainstorming session with sticky notes",
          caption: "Collaborative brainstorming sessions"
        },
        {
          src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
          alt: "Developers pair programming together",
          caption: "Pair programming and code reviews"
        },
        {
          src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop",
          alt: "Team meeting around conference table",
          caption: "Strategic planning meetings"
        }
      ]
    },
    innovation: {
      title: "Innovation Laboratory",
      description: "Explore our dedicated innovation spaces where cutting-edge ideas come to life through experimentation, prototyping, and breakthrough thinking.",
      highlights: [
        "Dedicated R&D lab with latest technology",
        "Hackathon events and innovation challenges",
        "Prototype development and testing facilities",
        "Emerging technology exploration programs"
      ],
      images: [
        {
          src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
          alt: "Innovation lab with modern equipment",
          caption: "State-of-the-art innovation lab"
        },
        {
          src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
          alt: "Team working on prototype development",
          caption: "Prototype development sessions"
        },
        {
          src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
          alt: "Technology demonstration and testing",
          caption: "Technology testing and demos"
        }
      ]
    },
    community: {
      title: "Community & Culture",
      description: "Experience the heart of our company culture through team events, community involvement, and the genuine connections that make us a family.",
      highlights: [
        "Regular team building and social events",
        "Community service and volunteer programs",
        "Diversity and inclusion initiatives",
        "Work-life balance and wellness programs"
      ],
      images: [
        {
          src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop",
          alt: "Team celebration and social event",
          caption: "Team celebrations and events"
        },
        {
          src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
          alt: "Community volunteer work",
          caption: "Community service initiatives"
        },
        {
          src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=400&fit=crop",
          alt: "Wellness and fitness activities",
          caption: "Wellness and fitness programs"
        }
      ]
    }
  };

  const currentContent = cultureContent?.[activeTab];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Our{' '}
            <span className="text-gradient bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Culture & Environment
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Behind-the-scenes glimpse into our collaborative environment, innovation labs, and authentic workplace interactions that define our culture.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {cultureTabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab?.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
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
          className="grid lg:grid-cols-2 gap-12 items-start"
        >
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                {currentContent?.title}
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {currentContent?.description}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-slate-900">Key Highlights</h4>
              <div className="space-y-3">
                {currentContent?.highlights?.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="Check" size={14} className="text-emerald-600" />
                    </div>
                    <p className="text-slate-700">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Icon name="Quote" size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-slate-900">Team Testimonial</h5>
                  <p className="text-sm text-slate-600">What our team says</p>
                </div>
              </div>
              <blockquote className="text-slate-700 italic">
                "Working at GeekyAnts Pro feels like being part of a family where everyone's ideas matter. The collaborative environment and focus on innovation make every day exciting and fulfilling."
              </blockquote>
              <div className="flex items-center space-x-3 mt-4">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    alt="Team member"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Alex Kumar</p>
                  <p className="text-xs text-slate-600">Principal Software Architect</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="space-y-6">
            {currentContent?.images?.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src={image?.src}
                    alt={image?.alt}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image?.caption}
                    </p>
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

export default CulturePresentation;