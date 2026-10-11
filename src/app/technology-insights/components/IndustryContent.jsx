'use client';
import React, { useState } from 'react';
import Icon from '../../com/components/AppIcon';
import Image from '../../com/components/AppImage';

const IndustryContent = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('healthcare');

  const industries = [
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: 'Heart',
      color: 'bg-red-100 text-red-800',
      description: 'Digital health solutions, HIPAA compliance, and patient experience optimization'
    },
    {
      id: 'finance',
      name: 'Finance & Banking',
      icon: 'CreditCard',
      color: 'bg-blue-100 text-blue-800',
      description: 'Fintech innovation, regulatory compliance, and secure payment systems'
    },
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      icon: 'ShoppingCart',
      color: 'bg-green-100 text-green-800',
      description: 'Omnichannel experiences, inventory management, and customer analytics'
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      icon: 'Settings',
      color: 'bg-orange-100 text-orange-800',
      description: 'Industry 4.0, IoT integration, and supply chain optimization'
    }
  ];

  const industryContent = {
    healthcare: {
      insights: [
        {
          id: 1,
          title: 'HIPAA-Compliant AI Implementation in Healthcare Systems',
          type: 'Case Study',
          readTime: '8 min',
          date: '2024-08-22',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
          excerpt: 'How a major hospital network implemented AI-powered diagnostics while maintaining strict HIPAA compliance and patient data security.',
          tags: ['AI/ML', 'Compliance', 'Security']
        },
        {
          id: 2,
          title: 'Telemedicine Platform Scalability: Lessons from COVID-19',
          type: 'Technical Guide',
          readTime: '12 min',
          date: '2024-08-18',
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
          excerpt: 'Technical architecture and scaling strategies for handling 10x traffic growth in telehealth platforms during pandemic surge.',
          tags: ['Cloud', 'Scalability', 'Architecture']
        },
        {
          id: 3,
          title: 'Patient Data Interoperability: FHIR Implementation Best Practices',
          type: 'Implementation Guide',
          readTime: '15 min',
          date: '2024-08-15',
          image: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=300&h=200&fit=crop',
          excerpt: 'Comprehensive guide to implementing FHIR standards for seamless patient data exchange across healthcare systems.',
          tags: ['Integration', 'Standards', 'Interoperability']
        }
      ],
      regulations: [
        'HIPAA Compliance Requirements',
        'FDA Software as Medical Device (SaMD)',
        'GDPR for Healthcare Data',
        'State Privacy Regulations'
      ],
      opportunities: [
        'AI-Powered Diagnostics',
        'Remote Patient Monitoring',
        'Electronic Health Records (EHR) Optimization',
        'Telehealth Platform Development'
      ]
    },
    finance: {
      insights: [
        {
          id: 1,
          title: 'Open Banking API Security: Zero Trust Implementation',
          type: 'Security Guide',
          readTime: '10 min',
          date: '2024-08-20',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop',
          excerpt: 'Implementing Zero Trust security architecture for Open Banking APIs while maintaining PCI DSS compliance.',
          tags: ['Security', 'APIs', 'Compliance']
        },
        {
          id: 2,
          title: 'Real-time Fraud Detection with Machine Learning',
          type: 'Case Study',
          readTime: '14 min',
          date: '2024-08-16',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
          excerpt: 'How a regional bank reduced fraud losses by 85% using real-time ML models and behavioral analytics.',
          tags: ['AI/ML', 'Fraud Detection', 'Analytics']
        },
        {
          id: 3,
          title: 'Blockchain for Trade Finance: Implementation Roadmap',
          type: 'Strategic Guide',
          readTime: '18 min',
          date: '2024-08-12',
          image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop',
          excerpt: 'Step-by-step roadmap for implementing blockchain-based trade finance solutions with regulatory considerations.',
          tags: ['Blockchain', 'Trade Finance', 'Implementation']
        }
      ],
      regulations: [
        'PCI DSS Compliance',
        'SOX Requirements',
        'Basel III Capital Requirements',
        'Anti-Money Laundering (AML)'
      ],
      opportunities: [
        'Digital Banking Platforms',
        'Cryptocurrency Integration',
        'Robo-Advisory Services',
        'RegTech Solutions'
      ]
    },
    retail: {
      insights: [
        {
          id: 1,
          title: 'Omnichannel Inventory Management: Real-time Synchronization',
          type: 'Technical Guide',
          readTime: '12 min',
          date: '2024-08-19',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
          excerpt: 'Architecture patterns for real-time inventory synchronization across online and offline retail channels.',
          tags: ['Architecture', 'Inventory', 'Real-time']
        },
        {
          id: 2,
          title: 'Personalization at Scale: AI-Driven Product Recommendations',
          type: 'Case Study',
          readTime: '9 min',
          date: '2024-08-14',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
          excerpt: 'How a major e-commerce platform increased conversion rates by 40% using AI-powered personalization engines.',
          tags: ['AI/ML', 'Personalization', 'E-commerce']
        },
        {
          id: 3,
          title: 'Sustainable E-commerce: Green Technology Implementation',
          type: 'Sustainability Report',
          readTime: '11 min',
          date: '2024-08-10',
          image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop',
          excerpt: 'Technology strategies for reducing carbon footprint in e-commerce operations while maintaining performance.',
          tags: ['Sustainability', 'Green Tech', 'Operations']
        }
      ],
      regulations: [
        'GDPR for Customer Data',
        'PCI DSS for Payments',
        'Accessibility Standards (WCAG)',
        'Consumer Protection Laws'
      ],
      opportunities: [
        'AR/VR Shopping Experiences',
        'Voice Commerce Integration',
        'Social Commerce Platforms',
        'Sustainable Technology Solutions'
      ]
    },
    manufacturing: {
      insights: [
        {
          id: 1,
          title: 'Industry 4.0: IoT Sensor Data Analytics for Predictive Maintenance',
          type: 'Implementation Guide',
          readTime: '16 min',
          date: '2024-08-17',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop',
          excerpt: 'Complete guide to implementing IoT-based predictive maintenance systems with real-time analytics and ML models.',
          tags: ['IoT', 'Predictive Analytics', 'Industry 4.0']
        },
        {
          id: 2,
          title: 'Supply Chain Visibility: Blockchain Implementation Case Study',
          type: 'Case Study',
          readTime: '13 min',
          date: '2024-08-13',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&h=200&fit=crop',
          excerpt: 'How a global manufacturer achieved end-to-end supply chain transparency using blockchain technology.',
          tags: ['Blockchain', 'Supply Chain', 'Transparency']
        },
        {
          id: 3,
          title: 'Digital Twin Implementation: From Concept to Production',
          type: 'Technical Guide',
          readTime: '20 min',
          date: '2024-08-08',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
          excerpt: 'Comprehensive guide to implementing digital twin technology for manufacturing process optimization.',
          tags: ['Digital Twin', 'Simulation', 'Optimization']
        }
      ],
      regulations: [
        'ISO 27001 Information Security',
        'IEC 62443 Industrial Cybersecurity',
        'Environmental Compliance (EPA)',
        'Occupational Safety Standards'
      ],
      opportunities: [
        'Smart Factory Automation',
        'Quality Control AI Systems',
        'Energy Management Platforms',
        'Worker Safety IoT Solutions'
      ]
    }
  };

  const selectedContent = industryContent?.[selectedIndustry];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">Industry-Specific Insights</h3>
        <p className="text-secondary">
          Targeted technology guidance addressing regulatory requirements and sector-specific opportunities
        </p>
      </div>
      {/* Industry Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {industries?.map((industry) => (
          <button
            key={industry?.id}
            onClick={() => setSelectedIndustry(industry?.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
              selectedIndustry === industry?.id
                ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${industry?.color}`}>
              <Icon name={industry?.icon} size={24} />
            </div>
            <h4 className="font-semibold text-primary mb-1">{industry?.name}</h4>
            <p className="text-sm text-secondary">{industry?.description}</p>
          </button>
        ))}
      </div>
      {/* Selected Industry Content */}
      <div className="space-y-8">
        {/* Latest Insights */}
        <div>
          <h4 className="text-xl font-bold text-primary mb-4">Latest Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedContent?.insights?.map((insight) => (
              <div key={insight?.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
                <Image
                  src={insight?.image}
                  alt={insight?.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                      {insight?.type}
                    </span>
                    <span className="text-xs text-secondary">{insight?.date}</span>
                  </div>
                  <h5 className="font-semibold text-primary mb-2 line-clamp-2">{insight?.title}</h5>
                  <p className="text-sm text-secondary mb-3 line-clamp-2">{insight?.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {insight?.tags?.map((tag, index) => (
                        <span key={index} className="text-xs bg-muted text-secondary px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-secondary">{insight?.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Landscape */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Shield" size={20} className="text-red-600" />
              <h4 className="text-lg font-bold text-primary">Regulatory Considerations</h4>
            </div>
            <ul className="space-y-2">
              {selectedContent?.regulations?.map((regulation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-red-600 mt-0.5" />
                  <span className="text-secondary">{regulation}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="TrendingUp" size={20} className="text-green-600" />
              <h4 className="text-lg font-bold text-primary">Technology Opportunities</h4>
            </div>
            <ul className="space-y-2">
              {selectedContent?.opportunities?.map((opportunity, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Icon name="ArrowRight" size={16} className="text-green-600 mt-0.5" />
                  <span className="text-secondary">{opportunity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryContent;