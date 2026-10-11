'use client';
import React, { useState } from 'react';
import Icon from '../../com/components/AppIcon';

const TechnologyRadar = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTech, setSelectedTech] = useState(null);

  const categories = [
    { id: 'all', name: 'All Technologies', icon: 'Layers' },
    { id: 'ai-ml', name: 'AI/ML', icon: 'Brain' },
    { id: 'cloud', name: 'Cloud', icon: 'Cloud' },
    { id: 'mobile', name: 'Mobile', icon: 'Smartphone' },
    { id: 'web', name: 'Web', icon: 'Globe' },
    { id: 'blockchain', name: 'Blockchain', icon: 'Link' }
  ];

  const technologies = [
    {
      id: 1,
      name: 'GPT-4 Integration',
      category: 'ai-ml',
      status: 'adopt',
      maturity: 85,
      riskLevel: 'low',
      timeline: '0-6 months',
      description: 'Advanced language model integration for intelligent applications with proven ROI and enterprise adoption.',
      businessImpact: 'High',
      implementationComplexity: 'Medium'
    },
    {
      id: 2,
      name: 'Kubernetes',
      category: 'cloud',
      status: 'adopt',
      maturity: 92,
      riskLevel: 'low',
      timeline: '0-3 months',
      description: 'Container orchestration platform essential for scalable cloud-native applications.',
      businessImpact: 'High',
      implementationComplexity: 'High'
    },
    {
      id: 3,
      name: 'React Native 0.73',
      category: 'mobile',
      status: 'trial',
      maturity: 78,
      riskLevel: 'medium',
      timeline: '3-9 months',
      description: 'Latest React Native with improved performance and new architecture for cross-platform development.',
      businessImpact: 'Medium',
      implementationComplexity: 'Medium'
    },
    {
      id: 4,
      name: 'WebAssembly',
      category: 'web',
      status: 'assess',
      maturity: 65,
      riskLevel: 'medium',
      timeline: '6-12 months',
      description: 'High-performance web applications with near-native speed for compute-intensive tasks.',
      businessImpact: 'Medium',
      implementationComplexity: 'High'
    },
    {
      id: 5,
      name: 'Quantum Computing APIs',
      category: 'ai-ml',
      status: 'hold',
      maturity: 25,
      riskLevel: 'high',
      timeline: '12+ months',
      description: 'Early-stage quantum computing services for specific computational problems.',
      businessImpact: 'Low',
      implementationComplexity: 'Very High'
    },
    {
      id: 6,
      name: 'Edge Computing',
      category: 'cloud',
      status: 'trial',
      maturity: 70,
      riskLevel: 'medium',
      timeline: '6-9 months',
      description: 'Distributed computing paradigm for reduced latency and improved performance.',
      businessImpact: 'High',
      implementationComplexity: 'High'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'adopt': return 'bg-green-100 text-green-800 border-green-200';
      case 'trial': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assess': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hold': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredTechnologies = selectedCategory === 'all' 
    ? technologies 
    : technologies?.filter(tech => tech?.category === selectedCategory);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">Technology Radar</h3>
        <p className="text-secondary">
          Our perspective on emerging technologies, adoption timelines, and implementation readiness
        </p>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              selectedCategory === category?.id
                ? 'bg-accent text-white' :'bg-gray-100 text-secondary hover:bg-gray-200'
            }`}
          >
            <Icon name={category?.icon} size={16} />
            <span>{category?.name}</span>
          </button>
        ))}
      </div>
      {/* Technology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechnologies?.map((tech) => (
          <div
            key={tech?.id}
            onClick={() => setSelectedTech(tech)}
            className="border border-border rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:border-accent"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-primary">{tech?.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tech?.status)}`}>
                {tech?.status?.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Maturity</span>
                <span className="font-medium">{tech?.maturity}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${tech?.maturity}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className={`font-medium ${getRiskColor(tech?.riskLevel)}`}>
                Risk: {tech?.riskLevel}
              </span>
              <span className="text-secondary">{tech?.timeline}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Technology Detail Modal */}
      {selectedTech && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">{selectedTech?.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedTech?.status)}`}>
                    {selectedTech?.status?.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTech(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <p className="text-secondary mb-6">{selectedTech?.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-secondary">Maturity Level</span>
                    <span className="font-bold text-primary">{selectedTech?.maturity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full"
                      style={{ width: `${selectedTech?.maturity}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm text-secondary mb-1">Risk Assessment</div>
                  <div className={`font-bold ${getRiskColor(selectedTech?.riskLevel)}`}>
                    {selectedTech?.riskLevel?.toUpperCase()}
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm text-secondary mb-1">Business Impact</div>
                  <div className="font-bold text-primary">{selectedTech?.businessImpact}</div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm text-secondary mb-1">Implementation</div>
                  <div className="font-bold text-primary">{selectedTech?.implementationComplexity}</div>
                </div>
              </div>

              <div className="bg-accent/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Clock" size={16} className="text-accent" />
                  <span className="font-semibold text-primary">Recommended Timeline</span>
                </div>
                <p className="text-secondary">{selectedTech?.timeline}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologyRadar;