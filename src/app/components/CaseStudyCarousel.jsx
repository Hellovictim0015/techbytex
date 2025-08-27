import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CaseStudyCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const caseStudies = [
    {
      id: 1,
      client: 'TechCorp Solutions',
      industry: 'Financial Services',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
      challenge: 'Legacy system modernization and digital transformation',
      solution: 'Cloud-native architecture with microservices and AI-powered analytics',
      results: {
        performance: '+300%',
        costs: '-45%',
        time: '6 months',
        satisfaction: '98%'
      },
      testimonial: `GeekyAnts Pro transformed our entire technology infrastructure. The results exceeded our expectations, and their team's expertise was evident throughout the project.`,author: 'Sarah Johnson',position: 'CTO, TechCorp Solutions',authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      technologies: ['React', 'Node.js', 'AWS', 'MongoDB'],
      videoThumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      client: 'HealthTech Innovations',industry: 'Healthcare',logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=100&fit=crop',challenge: 'Patient data management and telemedicine platform development',solution: 'HIPAA-compliant mobile and web applications with real-time communication',
      results: {
        performance: '+250%',costs: '-35%',time: '8 months',satisfaction: '96%'
      },
      testimonial: `The team delivered a comprehensive healthcare solution that not only met our compliance requirements but also provided an exceptional user experience for both patients and providers.`,
      author: 'Dr. Michael Chen',position: 'Chief Medical Officer',authorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      technologies: ['React Native', 'Python', 'PostgreSQL', 'WebRTC'],
      videoThumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      client: 'RetailMax Global',industry: 'E-commerce',logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=100&fit=crop',challenge: 'Scalable e-commerce platform with AI-powered recommendations',solution: 'Microservices architecture with machine learning integration',
      results: {
        performance: '+400%',costs: '-50%',time: '10 months',satisfaction: '99%'
      },
      testimonial: `Our partnership with GeekyAnts Pro resulted in a platform that not only handles our current scale but is built to grow with us. The AI recommendations have significantly improved our conversion rates.`,
      author: 'Emma Rodriguez',position: 'VP of Technology',authorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
      technologies: ['Next.js', 'TensorFlow', 'Kubernetes', 'Redis'],
      videoThumbnail: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&h=400&fit=crop'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % caseStudies?.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, caseStudies?.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % caseStudies?.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + caseStudies?.length) % caseStudies?.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const currentCase = caseStudies?.[currentSlide];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon name="Award" size={16} />
            <span>Client Success Stories</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Transformations that deliver results
          </h2>
          
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Real clients, real challenges, real results. See how we've helped businesses across industries achieve their digital transformation goals.
          </p>
        </div>

        <div className="relative">
          {/* Main Carousel */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Content Side */}
              <div className="p-8 lg:p-12 space-y-8">
                {/* Client Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                    <Image 
                      src={currentCase?.logo} 
                      alt={`${currentCase?.client} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{currentCase?.client}</h3>
                    <p className="text-secondary">{currentCase?.industry}</p>
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Challenge</h4>
                    <p className="text-secondary">{currentCase?.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Solution</h4>
                    <p className="text-secondary">{currentCase?.solution}</p>
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-lg font-semibold text-primary mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentCase?.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-accent">{currentCase?.results?.performance}</div>
                    <div className="text-sm text-secondary">Performance Boost</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{currentCase?.results?.costs}</div>
                    <div className="text-sm text-secondary">Cost Reduction</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{currentCase?.results?.time}</div>
                    <div className="text-sm text-secondary">Delivery Time</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">{currentCase?.results?.satisfaction}</div>
                    <div className="text-sm text-secondary">Satisfaction</div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <blockquote className="text-secondary italic mb-4">
                    "{currentCase?.testimonial}"
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image 
                        src={currentCase?.authorImage} 
                        alt={currentCase?.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{currentCase?.author}</div>
                      <div className="text-sm text-secondary">{currentCase?.position}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Side */}
              <div className="relative bg-slate-100">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
                <div className="relative h-full min-h-[500px] flex items-center justify-center p-8">
                  <div className="w-full max-w-md">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      <Image 
                        src={currentCase?.videoThumbnail} 
                        alt="Case study preview"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                          <Icon name="Play" size={24} className="text-primary ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Icon name="ChevronLeft" size={24} className="text-primary" />
            </button>

            {/* Dots */}
            <div className="flex space-x-2">
              {caseStudies?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-accent scale-125' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Icon name="ChevronRight" size={24} className="text-primary" />
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            iconName="ExternalLink"
            iconPosition="right"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
          >
            View All Case Studies
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyCarousel;