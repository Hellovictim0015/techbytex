'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../com/components/AppIcon';

const ValuesDemo = () => {
  const coreValues = [
    {
      id: 1,
      title: "Empowerment Through Technology",
      description: "We don't just build solutions; we empower organizations to achieve what they never thought possible through strategic technology implementation.",
      icon: "Zap",
      color: "emerald",
      examples: [
        {
          scenario: "Client Challenge",
          description: "A healthcare provider struggling with patient data management across multiple locations."
        },
        {
          scenario: "Our Approach",
          description: "Developed a unified cloud platform that reduced data retrieval time by 80% and improved patient care coordination."
        },
        {
          scenario: "Empowerment Result",
          description: "Client now leads their region in digital healthcare innovation and has expanded to 3 new locations."
        }
      ]
    },
    {
      id: 2,
      title: "Bridge Between Possible & Necessary",
      description: "We excel at identifying what's technically possible today and aligning it with what's strategically necessary for tomorrow's success.",
      icon: "Bridge",
      color: "blue",
      examples: [
        {
          scenario: "Market Reality",
          description: "Retail client needed to compete with e-commerce giants while maintaining their physical presence."
        },
        {
          scenario: "Strategic Bridge",
          description: "Created an omnichannel platform connecting online and offline experiences with AI-powered inventory management."
        },
        {
          scenario: "Future Readiness",
          description: "Client achieved 150% increase in customer engagement and seamless inventory optimization across all channels."
        }
      ]
    },
    {
      id: 3,
      title: "Partnership Beyond Projects",
      description: "We build lasting relationships that extend far beyond project delivery, becoming trusted advisors in our clients' digital transformation journey.",
      icon: "Handshake",
      color: "purple",
      examples: [
        {
          scenario: "Initial Project",
          description: "Started with a mobile app development project for a fintech startup."
        },
        {
          scenario: "Growing Partnership",
          description: "Evolved to provide ongoing architecture consulting, security audits, and scaling support as they grew."
        },
        {
          scenario: "Long-term Success",
          description: "Client successfully raised Series B funding and credits our partnership as key to their technical credibility."
        }
      ]
    },
    {
      id: 4,
      title: "Innovation with Reliability",
      description: "We push the boundaries of what's possible while maintaining the stability and reliability that enterprise clients demand.",
      icon: "Shield",
      color: "orange",
      examples: [
        {
          scenario: "Innovation Challenge",
          description: "Manufacturing client wanted to implement IoT sensors but couldn't risk production downtime."
        },
        {
          scenario: "Reliable Innovation",
          description: "Deployed a phased rollout with redundant systems and real-time monitoring to ensure zero disruption."
        },
        {
          scenario: "Proven Results",
          description: "Achieved 99.9% uptime while reducing maintenance costs by 40% through predictive analytics."
        }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: {
        bg: 'bg-emerald-500',
        light: 'bg-emerald-100',
        text: 'text-emerald-600',
        border: 'border-emerald-200'
      },
      blue: {
        bg: 'bg-blue-500',
        light: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      purple: {
        bg: 'bg-purple-500',
        light: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200'
      },
      orange: {
        bg: 'bg-orange-500',
        light: 'bg-orange-100',
        text: 'text-orange-600',
        border: 'border-orange-200'
      }
    };
    return colors?.[color];
  };

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
            Our Values{' '}
            <span className="text-gradient bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              In Action
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Beyond corporate statements—see how our core values manifest in real client relationships and project outcomes.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="space-y-16">
          {coreValues?.map((value, index) => {
            const colors = getColorClasses(value?.color);
            return (
              <motion.div
                key={value?.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:text-right' : ''}`}>
                  {/* Content */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 ${colors?.bg} rounded-2xl flex items-center justify-center`}>
                        <Icon name={value?.icon} size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{value?.title}</h3>
                        <div className={`w-12 h-1 ${colors?.bg} rounded-full mt-2`}></div>
                      </div>
                    </div>

                    <p className="text-lg text-slate-600 leading-relaxed">
                      {value?.description}
                    </p>

                    <div className={`bg-slate-50 rounded-xl p-6 border-l-4 ${colors?.border}`}>
                      <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                        <Icon name="Lightbulb" size={16} className={`${colors?.text} mr-2`} />
                        Real-World Application
                      </h4>
                      <div className="space-y-4">
                        {value?.examples?.map((example, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <div className={`w-6 h-6 ${colors?.light} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <span className={`text-xs font-bold ${colors?.text}`}>{idx + 1}</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-slate-900 text-sm">{example?.scenario}</h5>
                              <p className="text-slate-600 text-sm">{example?.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className="relative">
                    <div className={`absolute inset-0 ${colors?.light} rounded-3xl transform rotate-6`}></div>
                    <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                      <div className="text-center space-y-6">
                        <div className={`w-20 h-20 ${colors?.bg} rounded-2xl flex items-center justify-center mx-auto`}>
                          <Icon name={value?.icon} size={32} className="text-white" />
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Client Satisfaction</span>
                            <span className="text-sm font-bold text-slate-900">98%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className={`${colors?.bg} h-2 rounded-full`} style={{ width: '98%' }}></div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Project Success Rate</span>
                            <span className="text-sm font-bold text-slate-900">95%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className={`${colors?.bg} h-2 rounded-full`} style={{ width: '95%' }}></div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Long-term Partnerships</span>
                            <span className="text-sm font-bold text-slate-900">87%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className={`${colors?.bg} h-2 rounded-full`} style={{ width: '87%' }}></div>
                          </div>
                        </div>

                        <div className={`${colors?.light} rounded-lg p-4 mt-6`}>
                          <p className={`text-sm ${colors?.text} font-medium`}>
                            "This value drives every decision we make"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuesDemo;