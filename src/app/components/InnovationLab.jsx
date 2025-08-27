import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InnovationLab = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  const demos = [
    {
      id: 'ai-chat',
      title: 'AI-Powered Chatbot',
      description: 'Experience our intelligent conversational AI that understands context and provides meaningful responses.',
      icon: 'MessageSquare',
      category: 'Artificial Intelligence',
      status: 'Live Demo',
      features: ['Natural Language Processing', 'Context Awareness', 'Multi-language Support'],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'ar-viewer',
      title: '3D Product Viewer',
      description: 'Interactive 3D product visualization with augmented reality capabilities for e-commerce applications.',
      icon: 'Box',
      category: 'Augmented Reality',
      status: 'Beta Access',
      features: ['360° Product View', 'AR Integration', 'Real-time Rendering'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'blockchain',
      title: 'Blockchain Analytics',
      description: 'Real-time blockchain transaction analysis and visualization dashboard with predictive insights.',
      icon: 'Link',
      category: 'Blockchain',
      status: 'Preview',
      features: ['Transaction Tracking', 'Predictive Analytics', 'Security Monitoring'],
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      id: 'iot-dashboard',
      title: 'IoT Control Center',
      description: 'Comprehensive IoT device management and monitoring system with real-time data visualization.',
      icon: 'Wifi',
      category: 'Internet of Things',
      status: 'Live Demo',
      features: ['Device Management', 'Real-time Monitoring', 'Automated Alerts'],
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const emergingTech = [
    { name: 'Quantum Computing', progress: 25, trend: 'up' },
    { name: 'Edge AI', progress: 75, trend: 'up' },
    { name: 'Web3 Integration', progress: 60, trend: 'up' },
    { name: '5G Applications', progress: 45, trend: 'stable' },
    { name: 'Metaverse Platforms', progress: 35, trend: 'up' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/20 to-primary/20"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-200"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon name="Zap" size={16} />
            <span>Innovation Laboratory</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Experience tomorrow's technology today
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Step into our innovation lab where cutting-edge technologies come to life. Test interactive demos and explore the future of digital solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interactive Demos */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-6">Interactive Technology Demos</h3>
            
            <div className="space-y-4">
              {demos?.map((demo, index) => (
                <div
                  key={demo?.id}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    activeDemo === index
                      ? 'bg-white/10 border-accent shadow-lg scale-105'
                      : 'bg-white/5 border-slate-700 hover:bg-white/8 hover:border-slate-600'
                  }`}
                  onClick={() => setActiveDemo(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${demo?.bgColor} ${demo?.textColor}`}>
                      <Icon name={demo?.icon} size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold">{demo?.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          demo?.status === 'Live Demo' ? 'bg-green-500/20 text-green-400' :
                          demo?.status === 'Beta Access'? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {demo?.status}
                        </span>
                      </div>
                      
                      <p className="text-slate-300 text-sm mb-3">{demo?.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {demo?.features?.map((feature) => (
                          <span
                            key={feature}
                            className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {activeDemo === index && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <Button
                        variant="default"
                        size="sm"
                        iconName="ExternalLink"
                        iconPosition="right"
                        className="bg-accent hover:bg-accent/90 text-white"
                      >
                        Try Interactive Demo
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emerging Technologies Radar */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-6">Technology Adoption Radar</h3>
            
            <div className="bg-white/5 rounded-2xl p-6 border border-slate-700">
              <div className="space-y-6">
                {emergingTech?.map((tech, index) => (
                  <div key={tech?.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{tech?.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-400">{tech?.progress}%</span>
                        <Icon 
                          name={tech?.trend === 'up' ? 'TrendingUp' : 'Minus'} 
                          size={16} 
                          className={tech?.trend === 'up' ? 'text-green-400' : 'text-slate-400'} 
                        />
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${tech?.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Innovation Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-slate-700 text-center">
                <div className="text-2xl font-bold text-accent">15+</div>
                <div className="text-sm text-slate-400">Active Experiments</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-slate-700 text-center">
                <div className="text-2xl font-bold text-accent">8</div>
                <div className="text-sm text-slate-400">Patents Filed</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-slate-700 text-center">
                <div className="text-2xl font-bold text-accent">25+</div>
                <div className="text-sm text-slate-400">Research Papers</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-slate-700 text-center">
                <div className="text-2xl font-bold text-accent">100%</div>
                <div className="text-sm text-slate-400">Open Source</div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link to="/innovation-laboratory">
                <Button
                  variant="outline"
                  size="lg"
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="border-2 border-accent text-accent hover:bg-accent hover:text-white"
                >
                  Explore Innovation Lab
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnovationLab;