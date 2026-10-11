"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../com/components/AppIcon';
import Image from '../com/components/AppImage';

const TeamShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('leadership');

  const teamCategories = [
    { id: 'leadership', name: 'Leadership', icon: 'Crown' },
    { id: 'engineering', name: 'Engineering', icon: 'Code' },
    { id: 'design', name: 'Design', icon: 'Palette' },
    { id: 'strategy', name: 'Strategy', icon: 'Target' }
  ];

  const teamMembers = {
    leadership: [
      {
        id: 1,
        name: "Sarah Chen",
        role: "Chief Technology Officer",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        expertise: ["Cloud Architecture", "AI/ML Strategy", "Digital Transformation"],
        certifications: ["AWS Solutions Architect", "Google Cloud Professional", "Microsoft Azure Expert"],
        speaking: ["TechCrunch Disrupt 2024", "AWS re:Invent 2023", "Google I/O 2024"],
        openSource: ["Kubernetes Contributor", "TensorFlow Community Lead"],
        story: "Leading digital transformation initiatives for Fortune 500 companies with 15+ years of experience in scalable architecture design at TechbyteX.",
        linkedin: "#",
        twitter: "#",
        github: "#"
      },
      {
        id: 2,
        name: "Marcus Rodriguez",
        role: "Chief Executive Officer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        expertise: ["Business Strategy", "Client Relations", "Market Expansion"],
        certifications: ["Harvard Business School Executive", "Stanford Leadership Program"],
        speaking: ["World Economic Forum 2024", "Davos Technology Summit", "MIT Sloan Conference"],
        openSource: ["Open Source Initiative Board"],
        story: "Visionary leader with a track record of scaling technology companies from startup to global enterprise, focusing on sustainable growth and innovation at TechbyteX.",
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    ],
    engineering: [
      {
        id: 3,
        name: "Alex Kumar",
        role: "Principal Software Architect",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        expertise: ["Microservices", "React/Node.js", "DevOps"],
        certifications: ["Kubernetes Certified", "Docker Expert", "AWS DevOps Professional"],
        speaking: ["React Conf 2024", "Node.js Interactive", "DockerCon 2023"],
        openSource: ["React Core Contributor", "Express.js Maintainer"],
        story: "Passionate about building scalable systems that power millions of users, with expertise in modern web technologies and cloud-native architectures at TechbyteX.",
        linkedin: "#",
        twitter: "#",
        github: "#"
      },
      {
        id: 4,
        name: "Emily Watson",
        role: "Senior Full-Stack Developer",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        expertise: ["Python/Django", "React", "Machine Learning"],
        certifications: ["Google ML Engineer", "Python Institute Certified", "Scrum Master"],
        speaking: ["PyCon 2024", "Django Under the Hood", "ML Conference 2023"],
        openSource: ["Django Contributor", "Scikit-learn Maintainer"],
        story: "Full-stack developer creating intelligent applications and production-grade web and mobile experiences at TechbyteX.",
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    ],
    design: [
      {
        id: 5,
        name: "Jordan Kim",
        role: "Head of Design",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
        expertise: ["UX Strategy", "Design Systems", "User Research"],
        certifications: ["Google UX Design Certificate", "Nielsen Norman Group UX", "Adobe Certified Expert"],
        speaking: ["Design+Research 2024", "UX Week", "Interaction 2023"],
        openSource: ["Design System Community Lead", "Figma Plugin Developer"],
        story: "Design leader focused on creating intuitive experiences that bridge the gap between complex technology and human needs at TechbyteX.",
        linkedin: "#",
        twitter: "#",
        github: "#"
      },
      {
        id: 6,
        name: "Taylor Brooks",
        role: "Senior UI/UX Designer",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
        expertise: ["Interface Design", "Prototyping", "Accessibility"],
        certifications: ["WCAG 2.1 Certified", "Figma Expert", "Adobe Creative Suite Master"],
        speaking: ["A11y Conference 2024", "Design Systems Week", "Figma Config 2023"],
        openSource: ["Accessibility Tools Contributor", "Design Token Standards"],
        story: "Passionate about inclusive design and creating beautiful, accessible interfaces for the apps and websites we build at TechbyteX.",
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    ],
    strategy: [
      {
        id: 7,
        name: "David Park",
        role: "VP of Strategy",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        expertise: ["Digital Strategy", "Innovation Management", "Market Analysis"],
        certifications: ["McKinsey Strategy Certified", "MIT Innovation Leadership", "Lean Six Sigma Black Belt"],
        speaking: ["Strategy Summit 2024", "Innovation Forum", "Digital Transformation Conference"],
        openSource: ["Strategy Framework Contributor"],
        story: "Strategic thinker who helps organizations navigate digital transformation by aligning technology initiatives with business objectives at TechbyteX.",
        linkedin: "#",
        twitter: "#",
        github: "#"
      },
      {
        id: 8,
        name: "Lisa Zhang",
        role: "Director of Client Success",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
        expertise: ["Client Relations", "Project Management", "Agile Methodologies"],
        certifications: ["PMP Certified", "Certified Scrum Master", "Salesforce Admin"],
        speaking: ["Client Success Summit 2024", "Agile Conference", "Project Management Institute"],
        openSource: ["Agile Tools Contributor"],
        story: "Dedicated to ensuring client success through strategic partnership, clear communication, and delivery excellence at TechbyteX.",
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    ]
  };

  const currentMembers = teamMembers[activeCategory] || [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Meet the{' '}
            <span className="text-gradient bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              TechbyteX Team
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            TechbyteX (formerly TechBytex) is a software development company focused on building web and mobile applications. Below are profiles of the experts who design, build, and deliver the apps and websites that power our clients' success.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {teamCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon name={category.icon} size={18} />
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Team Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {currentMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Icon name="CheckCircle" size={16} className="text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                    <p className="text-emerald-600 font-medium">{member.role}</p>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">{member.story}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Recent Speaking</h4>
                      <div className="space-y-1">
                        {member.speaking.slice(0, 2).map((event, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Icon name="Mic" size={12} className="text-emerald-500" />
                            <span className="text-xs text-slate-600">{event}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 pt-2">
                      <a
                        href={member.linkedin}
                        className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                      >
                        <Icon name="Linkedin" size={16} className="text-blue-600" />
                      </a>
                      <a
                        href={member.twitter}
                        className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center hover:bg-sky-200 transition-colors"
                      >
                        <Icon name="Twitter" size={16} className="text-sky-600" />
                      </a>
                      <a
                        href={member.github}
                        className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <Icon name="Github" size={16} className="text-slate-600" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamShowcase;