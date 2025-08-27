import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SolutionsPreview = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredSolution, setHoveredSolution] = useState(null);

  const solutions = [
    {
      id: 'mobile',
      category: 'mobile',
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications that deliver exceptional user experiences across iOS and Android platforms.',
      icon: 'Smartphone',
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      features: ['Cross-platform compatibility', 'Native performance', 'Offline functionality', 'Push notifications'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'web',
      category: 'web',
      title: 'Web Applications',
      description: 'Scalable web applications built with modern frameworks, optimized for performance and user engagement.',
      icon: 'Globe',
      technologies: ['React', 'Next.js', 'Node.js', 'TypeScript'],
      features: ['Responsive design', 'SEO optimized', 'Progressive Web App', 'Real-time updates'],
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      id: 'ai',
      category: 'ai',
      title: 'AI/ML Solutions',
      description: 'Intelligent systems powered by machine learning and artificial intelligence to automate and optimize business processes.',
      icon: 'Brain',
      technologies: ['TensorFlow', 'PyTorch', 'OpenAI', 'Python'],
      features: ['Predictive analytics', 'Natural language processing', 'Computer vision', 'Automated decision making'],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'cloud',
      category: 'cloud',
      title: 'Cloud Architecture',
      description: 'Robust cloud infrastructure solutions that scale with your business needs while maintaining security and performance.',
      icon: 'Cloud',
      technologies: ['AWS', 'Azure', 'Google Cloud', 'Kubernetes'],
      features: ['Auto-scaling', 'High availability', 'Disaster recovery', 'Cost optimization'],
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 'transformation',
      category: 'transformation',
      title: 'Digital Transformation',
      description: 'Comprehensive digital transformation strategies that modernize your business processes and technology stack.',
      icon: 'Zap',
      technologies: ['Microservices', 'DevOps', 'API Gateway', 'Monitoring'],
      features: ['Process automation', 'Legacy modernization', 'Data migration', 'Change management'],
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Solutions', icon: 'Grid3X3' },
    { id: 'mobile', label: 'Mobile', icon: 'Smartphone' },
    { id: 'web', label: 'Web', icon: 'Globe' },
    { id: 'ai', label: 'AI/ML', icon: 'Brain' },
    { id: 'cloud', label: 'Cloud', icon: 'Cloud' },
    { id: 'transformation', label: 'Digital Transform', icon: 'Zap' }
  ];

  const filteredSolutions = activeFilter === 'all' 
    ? solutions 
    : solutions?.filter(solution => solution?.category === activeFilter);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon name="Layers" size={16} />
            <span>Comprehensive Solutions Portfolio</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Technology solutions that scale
          </h2>
          
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            From mobile applications to AI-powered systems, we deliver end-to-end solutions that transform how your business operates and grows.
          </p>
        </div>

        {/* Interactive Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters?.map((filter) => (
            <button
              key={filter?.id}
              onClick={() => setActiveFilter(filter?.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter?.id
                  ? 'bg-accent text-white shadow-lg scale-105'
                  : 'bg-white text-secondary hover:text-primary hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon name={filter?.icon} size={16} />
              <span>{filter?.label}</span>
            </button>
          ))}
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSolutions?.map((solution, index) => (
            <div
              key={solution?.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredSolution(solution?.id)}
              onMouseLeave={() => setHoveredSolution(null)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${solution?.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-xl ${solution?.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon name={solution?.icon} size={32} className={solution?.textColor} />
                  </div>
                  
                  {hoveredSolution === solution?.id && (
                    <div className="animate-pulse">
                      <Icon name="ArrowUpRight" size={20} className="text-accent" />
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                  {solution?.title}
                </h3>

                <p className="text-secondary mb-6 leading-relaxed">
                  {solution?.description}
                </p>

                {/* Technologies */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {solution?.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {solution?.features?.slice(0, 3)?.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-accent" />
                      <span className="text-sm text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-accent">Learn More</span>
                  <Icon 
                    name="ArrowRight" 
                    size={16} 
                    className="text-accent group-hover:translate-x-1 transition-transform duration-300" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Link to="/solutions-overview">
            <Button
              variant="default"
              size="lg"
              iconName="ArrowRight"
              iconPosition="right"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4"
            >
              Explore All Solutions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SolutionsPreview;