import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialProof = () => {
  const partners = [
    {
      name: 'Amazon Web Services',
      logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=200&h=100&fit=crop',
      category: 'Cloud Partner',
      certification: 'Advanced Consulting Partner'
    },
    {
      name: 'Google Cloud',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200&h=100&fit=crop',
      category: 'Cloud Partner',
      certification: 'Premier Partner'
    },
    {
      name: 'Microsoft Azure',
      logo: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=200&h=100&fit=crop',
      category: 'Cloud Partner',
      certification: 'Gold Partner'
    },
    {
      name: 'MongoDB',
      logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=100&fit=crop',
      category: 'Database Partner',
      certification: 'Certified Partner'
    },
    {
      name: 'Docker',
      logo: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=200&h=100&fit=crop',
      category: 'DevOps Partner',
      certification: 'Technology Partner'
    },
    {
      name: 'Kubernetes',
      logo: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=200&h=100&fit=crop',
      category: 'Container Platform',
      certification: 'Certified Service Provider'
    }
  ];

  const certifications = [
    {
      title: 'ISO 27001',
      description: 'Information Security Management',
      icon: 'Shield',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'SOC 2 Type II',
      description: 'Security & Availability',
      icon: 'Lock',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'GDPR Compliant',
      description: 'Data Protection Regulation',
      icon: 'UserCheck',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'HIPAA Compliant',
      description: 'Healthcare Data Security',
      icon: 'Heart',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const awards = [
    {
      year: '2024',
      title: 'Best Digital Transformation Partner',
      organization: 'Tech Excellence Awards',
      icon: 'Award'
    },
    {
      year: '2024',
      title: 'Top Mobile App Development Company',
      organization: 'Industry Leaders Summit',
      icon: 'Smartphone'
    },
    {
      year: '2023',
      title: 'Innovation in AI/ML Solutions',
      organization: 'Global Tech Conference',
      icon: 'Brain'
    },
    {
      year: '2023',
      title: 'Excellence in Cloud Architecture',
      organization: 'Cloud Computing Awards',
      icon: 'Cloud'
    }
  ];

  const testimonialStats = [
    { metric: '4.9/5', label: 'Client Rating', icon: 'Star' },
    { metric: '98%', label: 'Project Success Rate', icon: 'CheckCircle' },
    { metric: '95%', label: 'Client Retention', icon: 'Users' },
    { metric: '24/7', label: 'Support Availability', icon: 'Clock' }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon name="Shield" size={16} />
            <span>Trusted & Certified</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Partnerships that power innovation
          </h2>
          
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Our strategic partnerships and industry certifications ensure we deliver solutions that meet the highest standards of security, performance, and reliability.
          </p>
        </div>

        {/* Technology Partners */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-primary text-center mb-8">Technology Partners</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners?.map((partner, index) => (
              <div
                key={partner?.name}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden bg-slate-100 group-hover:scale-110 transition-transform duration-300">
                  <Image 
                    src={partner?.logo} 
                    alt={`${partner?.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h4 className="font-semibold text-primary text-sm mb-1">{partner?.name}</h4>
                <p className="text-xs text-secondary mb-2">{partner?.category}</p>
                <div className="text-xs text-accent font-medium">{partner?.certification}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Compliance */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-primary text-center mb-8">Security & Compliance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications?.map((cert, index) => (
              <div
                key={cert?.title}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${cert?.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={cert?.icon} size={24} className={cert?.color} />
                </div>
                
                <h4 className="font-bold text-primary mb-2">{cert?.title}</h4>
                <p className="text-sm text-secondary">{cert?.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-primary text-center mb-8">Awards & Recognition</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards?.map((award, index) => (
              <div
                key={`${award?.year}-${award?.title}`}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center space-x-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name={award?.icon} size={20} className="text-accent" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-semibold text-accent">{award?.year}</span>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <span className="text-sm text-secondary">{award?.organization}</span>
                  </div>
                  <h4 className="font-semibold text-primary">{award?.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Satisfaction Stats */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Client Satisfaction Metrics</h3>
            <p className="text-white/80">Real feedback from our valued clients</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonialStats?.map((stat, index) => (
              <div
                key={stat?.label}
                className="text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name={stat?.icon} size={20} className="text-white" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat?.metric}</div>
                <div className="text-white/80 text-sm">{stat?.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;