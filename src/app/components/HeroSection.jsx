import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [visitorType, setVisitorType] = useState('default');

  const animations = [
    {
      title: 'Cloud Architecture',
      code: `// Scalable microservices deployment
const services = {
  api: { replicas: 3, cpu: '500m' },
  database: { type: 'PostgreSQL', ha: true },
  cache: { type: 'Redis', cluster: true }
};`
    },
    {
      title: 'AI/ML Pipeline',
      code: `# Advanced machine learning workflow
import tensorflow as tf
model = tf.keras.Sequential([
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Dense(10, activation='softmax')
])`
    },
    {
      title: 'Mobile Development',
      code: `// React Native cross-platform solution
const App = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchUserData().then(setData);
  }, []);
  
  return <NavigationContainer>...</NavigationContainer>;
};`
    }
  ];

  const personalizedMessages = {
    default: {
      headline: 'Technology that transforms',
      subheading: 'Enterprise-grade solutions that scale with your ambitions. From concept to deployment, we build technology that drives real business outcomes.'
    },
    enterprise: {
      headline: 'Enterprise transformation starts here',
      subheading: 'Strategic technology partnerships that modernize your infrastructure while maintaining security and compliance standards.'
    },
    startup: {
      headline: 'Scale faster with proven technology',
      subheading: 'From MVP to market leader—we provide enterprise-grade solutions designed for rapid growth and market expansion.'
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations?.length);
    }, 4000);

    // Simulate visitor detection
    const referrer = document.referrer;
    if (referrer?.includes('enterprise') || referrer?.includes('corporate')) {
      setVisitorType('enterprise');
    } else if (referrer?.includes('startup') || referrer?.includes('founder')) {
      setVisitorType('startup');
    }

    return () => clearInterval(interval);
  }, []);

  const currentMessage = personalizedMessages?.[visitorType];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-200"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-400"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                <Icon name="Zap" size={16} />
                <span>Trusted by 500+ enterprises worldwide</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight">
                {currentMessage?.headline}
              </h1>
              
              <p className="text-xl text-secondary leading-relaxed max-w-2xl">
                {currentMessage?.subheading}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact-consultation">
                <Button
                  variant="default"
                  size="lg"
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg"
                >
                  Start Your Transformation
                </Button>
              </Link>
              
              <Link to="/solutions-overview">
                <Button
                  variant="outline"
                  size="lg"
                  iconName="Play"
                  iconPosition="left"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg"
                >
                  Explore Our Solutions
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-secondary">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-secondary">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-secondary">Support Available</div>
              </div>
            </div>
          </div>

          {/* Animation Side */}
          <div className="relative">
            <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-4 text-slate-400 text-sm font-mono">
                  {animations?.[currentAnimation]?.title}
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 min-h-[300px]">
                <pre className="text-green-400 font-mono text-sm leading-relaxed overflow-hidden">
                  <code className="animate-pulse">
                    {animations?.[currentAnimation]?.code}
                  </code>
                </pre>
              </div>
              
              <div className="flex items-center justify-between mt-4 text-slate-400 text-xs">
                <div className="flex items-center space-x-2">
                  <Icon name="Terminal" size={14} />
                  <span>Production Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Deployment</span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 animate-bounce">
              <Icon name="CheckCircle" size={24} className="text-accent" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 animate-pulse">
              <Icon name="Rocket" size={24} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon name="ChevronDown" size={24} className="text-secondary" />
      </div>
    </section>
  );
};

export default HeroSection;