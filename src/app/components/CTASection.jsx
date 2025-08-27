import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CTASection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e?.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const quickActions = [
    {
      title: 'Schedule Strategy Call',
      description: 'Book a free 30-minute consultation with our technology experts',
      icon: 'Calendar',
      action: 'Schedule Now',
      link: '/contact-consultation',
      color: 'from-accent to-emerald-600',
      highlight: true
    },
    {
      title: 'Explore Solutions',
      description: 'Discover our comprehensive technology solutions portfolio',
      icon: 'Layers',
      action: 'View Solutions',
      link: '/solutions-overview',
      color: 'from-primary to-blue-600',
      highlight: false
    },
    {
      title: 'Innovation Lab',
      description: 'Experience cutting-edge technology demos and prototypes',
      icon: 'Zap',
      action: 'Try Demos',
      link: '/innovation-laboratory',
      color: 'from-purple-500 to-pink-500',
      highlight: false
    }
  ];

  const benefits = [
    'Free technology assessment',
    'Custom solution roadmap',
    'ROI projections & timeline',
    'Risk-free consultation'
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/30 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-200"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Icon name="Rocket" size={16} />
            <span>Ready to Transform?</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Let's build something
            <span className="block text-gradient bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
              extraordinary together
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Join 500+ companies that have transformed their business with our technology solutions. 
            Start your digital transformation journey today.
          </p>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {benefits?.map((benefit, index) => (
              <div
                key={benefit}
                className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon name="Check" size={16} className="text-accent" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {quickActions?.map((action, index) => (
            <div
              key={action?.title}
              className={`relative group ${
                action?.highlight ? 'lg:scale-105 lg:-mt-4' : ''
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {action?.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`relative bg-gradient-to-br ${action?.color} rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-105`}>
                <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
                
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon name={action?.icon} size={32} className="text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{action?.title}</h3>
                  <p className="text-white/90 mb-6 leading-relaxed">{action?.description}</p>
                  
                  <Link to={action?.link}>
                    <Button
                      variant="default"
                      size="lg"
                      iconName="ArrowRight"
                      iconPosition="right"
                      className="bg-white text-slate-900 hover:bg-white/90 font-semibold"
                    >
                      {action?.action}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Icon name="Mail" size={24} className="text-accent" />
              <h3 className="text-2xl font-bold">Stay ahead of the curve</h3>
            </div>
            
            <p className="text-slate-300 mb-6">
              Get weekly insights on emerging technologies, industry trends, and digital transformation strategies.
            </p>

            {isSubscribed ? (
              <div className="flex items-center justify-center space-x-2 text-accent">
                <Icon name="CheckCircle" size={20} />
                <span className="font-medium">Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e?.target?.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-white/60"
                  />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  iconName="Send"
                  iconPosition="right"
                  className="bg-accent hover:bg-accent/90 text-white whitespace-nowrap"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center mt-12">
          <p className="text-slate-300 mb-4">
            Prefer to talk directly? We're here to help.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="tel:+1-555-0123"
              className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-300"
            >
              <Icon name="Phone" size={18} />
              <span className="font-medium">+1 (555) 012-3456</span>
            </a>
            
            <div className="hidden sm:block w-1 h-1 bg-slate-500 rounded-full"></div>
            
            <a
              href="mailto:hello@geekyantspro.com"
              className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-300"
            >
              <Icon name="Mail" size={18} />
              <span className="font-medium">hello@geekyantspro.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;