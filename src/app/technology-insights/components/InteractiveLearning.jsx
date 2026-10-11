'use client';
import React, { useState } from 'react';
import Icon from '../../com/components/AppIcon';
import Button from '../../com/components/ui/Button';

const InteractiveLearning = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const learningModules = [
    {
      id: 'cloud-readiness',
      title: 'Cloud Readiness Assessment',
      description: 'Evaluate your organization\'s readiness for cloud migration and get personalized recommendations.',
      icon: 'Cloud',
      duration: '10 min',
      difficulty: 'Intermediate',
      questions: [
        {
          id: 1,
          question: 'What is your current infrastructure setup?',
          type: 'single',
          options: [
            { value: 'on-premise', label: 'Primarily on-premise servers' },
            { value: 'hybrid', label: 'Hybrid cloud and on-premise' },
            { value: 'cloud', label: 'Mostly cloud-based' },
            { value: 'legacy', label: 'Legacy systems with minimal cloud' }
          ]
        },
        {
          id: 2,
          question: 'How would you rate your team\'s cloud expertise?',
          type: 'single',
          options: [
            { value: 'beginner', label: 'Beginner - Limited cloud experience' },
            { value: 'intermediate', label: 'Intermediate - Some cloud projects' },
            { value: 'advanced', label: 'Advanced - Extensive cloud experience' },
            { value: 'expert', label: 'Expert - Cloud-native organization' }
          ]
        },
        {
          id: 3,
          question: 'What are your primary concerns about cloud migration?',
          type: 'multiple',
          options: [
            { value: 'security', label: 'Data security and compliance' },
            { value: 'cost', label: 'Cost management and optimization' },
            { value: 'downtime', label: 'Business continuity and downtime' },
            { value: 'complexity', label: 'Technical complexity' },
            { value: 'vendor-lock', label: 'Vendor lock-in' }
          ]
        }
      ]
    },
    {
      id: 'ai-maturity',
      title: 'AI/ML Maturity Assessment',
      description: 'Assess your organization\'s AI/ML capabilities and discover implementation opportunities.',
      icon: 'Brain',
      duration: '12 min',
      difficulty: 'Advanced',
      questions: [
        {
          id: 1,
          question: 'What is your current data infrastructure maturity?',
          type: 'single',
          options: [
            { value: 'basic', label: 'Basic - Spreadsheets and simple databases' },
            { value: 'structured', label: 'Structured - Data warehouse with some analytics' },
            { value: 'advanced', label: 'Advanced - Data lake with real-time processing' },
            { value: 'mature', label: 'Mature - ML-ready data platform' }
          ]
        },
        {
          id: 2,
          question: 'Which AI/ML use cases are you most interested in?',
          type: 'multiple',
          options: [
            { value: 'automation', label: 'Process automation' },
            { value: 'analytics', label: 'Predictive analytics' },
            { value: 'nlp', label: 'Natural language processing' },
            { value: 'vision', label: 'Computer vision' },
            { value: 'recommendation', label: 'Recommendation systems' }
          ]
        },
        {
          id: 3,
          question: 'What is your biggest AI implementation challenge?',
          type: 'single',
          options: [
            { value: 'data-quality', label: 'Data quality and availability' },
            { value: 'skills', label: 'Lack of AI/ML expertise' },
            { value: 'infrastructure', label: 'Infrastructure limitations' },
            { value: 'roi', label: 'Proving ROI and business value' }
          ]
        }
      ]
    },
    {
      id: 'security-posture',
      title: 'Security Posture Evaluation',
      description: 'Evaluate your current security measures and identify areas for improvement.',
      icon: 'Shield',
      duration: '8 min',
      difficulty: 'Beginner',
      questions: [
        {
          id: 1,
          question: 'How do you currently manage user access?',
          type: 'single',
          options: [
            { value: 'basic', label: 'Username and password only' },
            { value: 'mfa', label: 'Multi-factor authentication' },
            { value: 'sso', label: 'Single sign-on (SSO)' },
            { value: 'zero-trust', label: 'Zero trust architecture' }
          ]
        },
        {
          id: 2,
          question: 'Which security measures do you currently have in place?',
          type: 'multiple',
          options: [
            { value: 'firewall', label: 'Network firewall' },
            { value: 'antivirus', label: 'Endpoint protection' },
            { value: 'backup', label: 'Regular data backups' },
            { value: 'monitoring', label: 'Security monitoring' },
            { value: 'training', label: 'Security awareness training' }
          ]
        },
        {
          id: 3,
          question: 'How often do you conduct security assessments?',
          type: 'single',
          options: [
            { value: 'never', label: 'Never or rarely' },
            { value: 'annual', label: 'Annually' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'continuous', label: 'Continuous monitoring' }
          ]
        }
      ]
    }
  ];

  const handleStartModule = (moduleId) => {
    setActiveModule(moduleId);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    const module = learningModules?.find(m => m?.id === activeModule);
    if (currentQuestion < module.questions?.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getRecommendations = (moduleId, answers) => {
    // Mock recommendation logic based on answers
    const recommendations = {
      'cloud-readiness': [
        'Start with a cloud migration assessment',
        'Implement cloud security best practices',
        'Consider a phased migration approach',
        'Invest in team training and certification'
      ],
      'ai-maturity': [
        'Begin with data quality improvement',
        'Start with simple automation use cases',
        'Build a data science team or partner',
        'Implement MLOps practices'
      ],
      'security-posture': [
        'Implement multi-factor authentication',
        'Establish security monitoring',
        'Create incident response procedures',
        'Regular security training for staff'
      ]
    };
    return recommendations?.[moduleId] || [];
  };

  if (activeModule && !showResults) {
    const module = learningModules?.find(m => m?.id === activeModule);
    const question = module.questions?.[currentQuestion];
    const progress = ((currentQuestion + 1) / module.questions?.length) * 100;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-primary">{module.title}</h3>
            <p className="text-secondary">Question {currentQuestion + 1} of {module.questions?.length}</p>
          </div>
          <button
            onClick={() => setActiveModule(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        {/* Question */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-primary mb-4">{question?.question}</h4>
          
          <div className="space-y-3">
            {question?.options?.map((option) => (
              <label
                key={option?.value}
                className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-muted cursor-pointer transition-colors duration-300"
              >
                <input
                  type={question?.type === 'single' ? 'radio' : 'checkbox'}
                  name={`question-${question?.id}`}
                  value={option?.value}
                  checked={
                    question?.type === 'single'
                      ? answers?.[question?.id] === option?.value
                      : answers?.[question?.id]?.includes(option?.value)
                  }
                  onChange={(e) => {
                    if (question?.type === 'single') {
                      handleAnswer(question?.id, option?.value);
                    } else {
                      const currentAnswers = answers?.[question?.id] || [];
                      if (e?.target?.checked) {
                        handleAnswer(question?.id, [...currentAnswers, option?.value]);
                      } else {
                        handleAnswer(question?.id, currentAnswers?.filter(a => a !== option?.value));
                      }
                    }
                  }}
                  className="mt-1"
                />
                <span className="text-primary">{option?.label}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Previous
          </Button>
          
          <Button
            variant="default"
            onClick={handleNext}
            disabled={!answers?.[question?.id]}
            iconName={currentQuestion === module.questions?.length - 1 ? "CheckCircle" : "ArrowRight"}
            iconPosition="right"
            className="bg-accent hover:bg-accent/90 text-white"
          >
            {currentQuestion === module.questions?.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const module = learningModules?.find(m => m?.id === activeModule);
    const recommendations = getRecommendations(activeModule, answers);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">Assessment Complete!</h3>
          <p className="text-secondary">Here are your personalized recommendations</p>
        </div>
        <div className="bg-accent/5 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-bold text-primary mb-4">Recommended Next Steps</h4>
          <ul className="space-y-3">
            {recommendations?.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Icon name="ArrowRight" size={16} className="text-accent mt-1" />
                <span className="text-secondary">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => setActiveModule(null)}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Modules
          </Button>
          
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            className="bg-accent hover:bg-accent/90 text-white"
          >
            Download Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">Interactive Learning Modules</h3>
        <p className="text-secondary">
          Test your knowledge, assess current technology maturity, and receive personalized improvement recommendations
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules?.map((module) => (
          <div key={module.id} className="border border-border rounded-lg p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name={module.icon} size={24} className="text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-primary">{module.title}</h4>
                <div className="flex items-center space-x-2 text-sm text-secondary">
                  <span>{module.duration}</span>
                  <span>•</span>
                  <span>{module.difficulty}</span>
                </div>
              </div>
            </div>

            <p className="text-secondary mb-6">{module.description}</p>

            <Button
              variant="default"
              fullWidth
              onClick={() => handleStartModule(module.id)}
              iconName="Play"
              iconPosition="left"
              className="bg-accent hover:bg-accent/90 text-white"
            >
              Start Assessment
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-muted rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-accent mt-1" />
          <div>
            <h4 className="font-semibold text-primary mb-2">Why Take These Assessments?</h4>
            <ul className="text-secondary space-y-1">
              <li>• Get personalized technology recommendations</li>
              <li>• Identify gaps in your current setup</li>
              <li>• Receive actionable improvement plans</li>
              <li>• Benchmark against industry standards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveLearning;