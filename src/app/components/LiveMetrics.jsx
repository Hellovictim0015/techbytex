import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const LiveMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeProjects: 127,
    clientSatisfaction: 98.5,
    deployments: 1247,
    uptime: 99.9
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setMetrics(prev => ({
          activeProjects: prev?.activeProjects + Math.floor(Math.random() * 3),
          clientSatisfaction: Math.min(99.9, prev?.clientSatisfaction + (Math.random() * 0.1)),
          deployments: prev?.deployments + Math.floor(Math.random() * 5),
          uptime: Math.max(99.5, prev?.uptime + (Math.random() * 0.1 - 0.05))
        }));
        setIsAnimating(false);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const metricCards = [
    {
      icon: 'Activity',
      label: 'Active Projects',
      value: metrics?.activeProjects,
      suffix: '',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      icon: 'Heart',
      label: 'Client Satisfaction',
      value: metrics?.clientSatisfaction?.toFixed(1),
      suffix: '%',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: 'Rocket',
      label: 'Successful Deployments',
      value: metrics?.deployments?.toLocaleString(),
      suffix: '',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: 'Shield',
      label: 'System Uptime',
      value: metrics?.uptime?.toFixed(1),
      suffix: '%',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon name="TrendingUp" size={16} />
            <span>Live Performance Dashboard</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Real-time project metrics
          </h2>
          
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Our commitment to excellence is reflected in these live statistics from our current projects and client partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards?.map((metric, index) => (
            <div
              key={metric?.label}
              className={`bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 ${
                isAnimating ? 'scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric?.bgColor}`}>
                  <Icon name={metric?.icon} size={24} className={metric?.color} />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-secondary">Live</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1">
                  <span className={`text-3xl font-bold ${metric?.color} transition-all duration-500`}>
                    {metric?.value}
                  </span>
                  <span className={`text-lg font-semibold ${metric?.color}`}>
                    {metric?.suffix}
                  </span>
                </div>
                
                <p className="text-sm text-secondary font-medium">
                  {metric?.label}
                </p>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${metric?.color?.replace('text-', 'bg-')} rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min(100, (parseFloat(metric?.value) / 100) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-12 bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-white/80">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-white/80">Expert Engineers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-white/80">Countries Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveMetrics;