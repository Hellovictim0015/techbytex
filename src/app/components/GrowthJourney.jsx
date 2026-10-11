'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../com/components/AppIcon';

const GrowthJourney = () => {
  const milestones = [
    {
      year: "2018",
      title: "Foundation & Vision",
      description: "Started with a vision to bridge the gap between cutting-edge technology and practical business solutions.",
      achievements: [
        "Founded by industry veterans with 50+ years combined experience",
        "Established core values and company culture",
        "First 5 team members joined",
        "Initial client partnerships formed"
      ],
      metrics: {
        team: "5",
        clients: "3",
        projects: "8"
      },
      icon: "Rocket",
      color: "emerald"
    },
    {
      year: "2019",
      title: "Technology Leadership",
      description: "Emerged as early adopters of cloud-native technologies and modern development practices.",
      achievements: [
        "Became AWS Advanced Consulting Partner",
        "Launched first AI/ML practice",
        "Established remote-first work culture",
        "Won \'Startup of the Year\' award"
      ],
      metrics: {
        team: "25",
        clients: "15",
        projects: "45"
      },
      icon: "Award",
      color: "blue"
    },
    {
      year: "2020",
      title: "Scaling & Innovation",
      description: "Rapid growth while maintaining quality, expanding services and building industry recognition.",
      achievements: [
        "Opened second office location",
        "Launched Innovation Lab initiative",
        "Achieved ISO 27001 certification",
        "First Fortune 500 client partnership"
      ],
      metrics: {
        team: "50",
        clients: "35",
        projects: "120"
      },
      icon: "TrendingUp",
      color: "purple"
    },
    {
      year: "2021",
      title: "Market Expansion",
      description: "Expanded into new markets and verticals while deepening expertise in emerging technologies.",
      achievements: [
        "Entered healthcare and fintech verticals",
        "Launched open-source initiatives",
        "Established university partnerships",
        "Recognized as \'Best Places to Work'"
      ],
      metrics: {
        team: "85",
        clients: "60",
        projects: "200"
      },
      icon: "Globe",
      color: "orange"
    },
    {
      year: "2022",
      title: "Industry Recognition",
      description: "Gained recognition as thought leaders and trusted partners in digital transformation.",
      achievements: [
        "Named \'Technology Partner of the Year'",
        "Spoke at 15+ industry conferences",
        "Published 50+ technical articles",
        "Achieved 98% client satisfaction rate"
      ],
      metrics: {
        team: "120",
        clients: "90",
        projects: "350"
      },
      icon: "Star",
      color: "red"
    },
    {
      year: "2023",
      title: "Global Presence",
      description: "Established international presence while maintaining our commitment to innovation and quality.",
      achievements: [
        "Opened offices in 3 new countries",
        "Launched GeekyAnts Pro brand",
        "Achieved carbon-neutral operations",
        "Established $1M innovation fund"
      ],
      metrics: {
        team: "180",
        clients: "150",
        projects: "500"
      },
      icon: "Building",
      color: "indigo"
    },
    {
      year: "2024",
      title: "Future Forward",
      description: "Continuing to push boundaries with AI, quantum computing research, and sustainable technology solutions.",
      achievements: [
        "Launched AI Research Division",
        "Quantum computing partnerships",
        "Sustainability consulting practice",
        "200+ team members milestone"
      ],
      metrics: {
        team: "200+",
        clients: "200+",
        projects: "750+"
      },
      icon: "Zap",
      color: "emerald"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-600' },
      blue: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600' },
      red: { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-600' },
      indigo: { bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-600' }
    };
    return colors?.[color];
  };

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
              Growth Journey
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From startup to industry leader—our evolution showcases stability, forward momentum, and unwavering commitment to innovation.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-emerald-500 to-blue-500 hidden lg:block"></div>

          {/* Milestones */}
          <div className="space-y-16">
            {milestones?.map((milestone, index) => {
              const colors = getColorClasses(milestone?.color);
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={milestone?.year}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative grid lg:grid-cols-2 gap-8 items-center ${
                    isEven ? '' : 'lg:text-right'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
                    <div className={`w-16 h-16 ${colors?.bg} rounded-full flex items-center justify-center shadow-lg border-4 border-white`}>
                      <Icon name={milestone?.icon} size={24} className="text-white" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className={`${isEven ? 'lg:pr-16' : 'lg:pl-16 lg:col-start-2'} space-y-6`}>
                    <div className="flex items-center space-x-4 lg:hidden">
                      <div className={`w-12 h-12 ${colors?.bg} rounded-xl flex items-center justify-center`}>
                        <Icon name={milestone?.icon} size={20} className="text-white" />
                      </div>
                      <span className={`text-2xl font-bold ${colors?.text}`}>{milestone?.year}</span>
                    </div>

                    <div className="hidden lg:block">
                      <span className={`text-3xl font-bold ${colors?.text}`}>{milestone?.year}</span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{milestone?.title}</h3>
                      <p className="text-lg text-slate-600 leading-relaxed">{milestone?.description}</p>
                    </div>

                    <div className="space-y-3">
                      {milestone?.achievements?.map((achievement, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <div className={`w-5 h-5 ${colors?.light} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Icon name="Check" size={12} className={colors?.text} />
                          </div>
                          <p className="text-slate-700">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Metrics Card */}
                  <div className={`${isEven ? 'lg:pl-16' : 'lg:pr-16 lg:col-start-1 lg:row-start-1'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                        {milestone?.year} Metrics
                      </h4>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className={`w-12 h-12 ${colors?.light} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                            <Icon name="Users" size={20} className={colors?.text} />
                          </div>
                          <div className="text-2xl font-bold text-slate-900">{milestone?.metrics?.team}</div>
                          <div className="text-sm text-slate-600">Team</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`w-12 h-12 ${colors?.light} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                            <Icon name="Building" size={20} className={colors?.text} />
                          </div>
                          <div className="text-2xl font-bold text-slate-900">{milestone?.metrics?.clients}</div>
                          <div className="text-sm text-slate-600">Clients</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`w-12 h-12 ${colors?.light} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                            <Icon name="Briefcase" size={20} className={colors?.text} />
                          </div>
                          <div className="text-2xl font-bold text-slate-900">{milestone?.metrics?.projects}</div>
                          <div className="text-sm text-slate-600">Projects</div>
                        </div>
                      </div>

                      <div className={`mt-4 p-3 ${colors?.light} rounded-lg`}>
                        <p className={`text-sm ${colors?.text} font-medium text-center`}>
                          Year of {milestone?.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Future Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl p-8 text-white">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon name="Telescope" size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Looking Ahead</h3>
              <p className="text-xl opacity-90 leading-relaxed">
                Our journey continues with ambitious goals: quantum computing integration, sustainable technology solutions, and expanding our global impact while maintaining the personal touch that defines our partnerships.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GrowthJourney;