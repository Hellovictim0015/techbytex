'use client'; 
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../com/components/AppIcon';

const GlobalPresence = () => {
  const offices = [
    {
      id: 1,
      city: "San Francisco",
      country: "United States",
      region: "North America",
      type: "Headquarters",
      established: "2018",
      teamSize: "85",
      specializations: ["AI/ML", "Cloud Architecture", "Enterprise Solutions"],
      address: "123 Innovation Drive, San Francisco, CA 94105",
      timezone: "PST (UTC-8)",
      languages: ["English"],
      coordinates: { lat: 37.7749, lng: -122.4194 },
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      keyClients: ["Fortune 500 Tech Companies", "Healthcare Providers", "Financial Services"],
      culturalInsights: [
        "Innovation-first mindset with Silicon Valley entrepreneurial spirit",
        "Diverse team representing 15+ nationalities",
        "Strong focus on emerging technologies and R&D"
      ]
    },
    {
      id: 2,
      city: "London",
      country: "United Kingdom",
      region: "Europe",
      type: "Regional Hub",
      established: "2021",
      teamSize: "45",
      specializations: ["Fintech", "Regulatory Compliance", "Digital Banking"],
      address: "456 Tech Square, London EC2A 4DP",
      timezone: "GMT (UTC+0)",
      languages: ["English", "French", "German"],
      coordinates: { lat: 51.5074, lng: -0.1278 },
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop",
      keyClients: ["European Banks", "Insurance Companies", "Government Agencies"],
      culturalInsights: [
        "Deep understanding of European regulatory landscape",
        "Multicultural team with strong EU market knowledge",
        "Focus on privacy-first and GDPR-compliant solutions"
      ]
    },
    {
      id: 3,
      city: "Singapore",
      country: "Singapore",
      region: "Asia Pacific",
      type: "Regional Hub",
      established: "2022",
      teamSize: "35",
      specializations: ["Mobile Development", "E-commerce", "Supply Chain"],
      address: "789 Marina Bay, Singapore 018956",
      timezone: "SGT (UTC+8)",
      languages: ["English", "Mandarin", "Malay"],
      coordinates: { lat: 1.3521, lng: 103.8198 },
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop",
      keyClients: ["E-commerce Platforms", "Logistics Companies", "Manufacturing"],
      culturalInsights: [
        "Gateway to Asian markets with local expertise",
        "Strong relationships with regional technology partners",
        "Focus on scalable solutions for rapid market growth"
      ]
    },
    {
      id: 4,
      city: "Toronto",
      country: "Canada",
      region: "North America",
      type: "Development Center",
      established: "2023",
      teamSize: "25",
      specializations: ["Healthcare Tech", "Clean Energy", "Government Solutions"],
      address: "321 Innovation Way, Toronto, ON M5V 3A8",
      timezone: "EST (UTC-5)",
      languages: ["English", "French"],
      coordinates: { lat: 43.6532, lng: -79.3832 },
      image: "https://images.unsplash.com/photo-1517391823881-a6ca7e1b8c8c?w=600&h=400&fit=crop",
      keyClients: ["Healthcare Systems", "Clean Tech Startups", "Public Sector"],
      culturalInsights: [
        "Strong focus on sustainable and ethical technology",
        "Bilingual capabilities for Canadian market",
        "Expertise in healthcare and government compliance"
      ]
    }
  ];

  const globalStats = [
    { label: "Countries", value: "4", icon: "Globe" },
    { label: "Time Zones", value: "4", icon: "Clock" },
    { label: "Languages", value: "6+", icon: "MessageCircle" },
    { label: "Local Partnerships", value: "50+", icon: "Handshake" }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Our{' '}
            <span className="text-gradient bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Global Presence
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Strategic office locations worldwide with regional expertise, local market understanding, and cultural adaptation capabilities for enterprise clients.
          </p>
        </motion.div>

        {/* Global Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {globalStats?.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name={stat?.icon} size={24} className="text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{stat?.value}</div>
              <div className="text-slate-600 font-medium">{stat?.label}</div>
            </div>
          ))}
        </motion.div>

        {/* World Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl p-8 mb-16 shadow-sm border border-slate-200"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Global Office Network</h3>
            <p className="text-slate-600">Strategic locations across major technology hubs</p>
          </div>
          
          <div className="relative h-96 bg-slate-100 rounded-xl overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="GeekyAnts Pro Global Offices"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=37.7749,-122.4194&z=2&output=embed"
              className="rounded-xl"
            />
            
            {/* Office Markers Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {offices?.map((office, index) => (
                <div
                  key={office?.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  style={{
                    left: `${25 + (index * 20)}%`,
                    top: `${30 + (index % 2 * 20)}%`
                  }}
                >
                  <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium text-slate-900 shadow-lg whitespace-nowrap">
                    {office?.city}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Office Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {offices?.map((office, index) => (
            <motion.div
              key={office?.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${office?.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      office?.type === 'Headquarters' ?'bg-emerald-500 text-white' 
                        : office?.type === 'Regional Hub' ?'bg-blue-500 text-white' :'bg-purple-500 text-white'
                    }`}>
                      {office?.type}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold">{office?.city}</h3>
                    <p className="text-white/90 text-sm">{office?.country} • {office?.region}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Established</span>
                    <div className="font-medium text-slate-900">{office?.established}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Team Size</span>
                    <div className="font-medium text-slate-900">{office?.teamSize} members</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Timezone</span>
                    <div className="font-medium text-slate-900">{office?.timezone}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Languages</span>
                    <div className="font-medium text-slate-900">{office?.languages?.join(', ')}</div>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {office?.specializations?.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Clients */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Key Client Sectors</h4>
                  <div className="space-y-2">
                    {office?.keyClients?.map((client, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-slate-600">{client}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cultural Insights */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Cultural Insights</h4>
                  <div className="space-y-2">
                    {office?.culturalInsights?.map((insight, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <Icon name="Lightbulb" size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-start space-x-2">
                    <Icon name="MapPin" size={16} className="text-slate-400 mt-0.5" />
                    <span className="text-sm text-slate-600">{office?.address}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expansion Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl p-8 text-white text-center"
        >
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="Rocket" size={32} className="text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Expanding Our Reach</h3>
            <p className="text-xl opacity-90 leading-relaxed mb-6">
              We're actively expanding to new markets including Australia, Germany, and Brazil to better serve our global clients and tap into regional talent pools.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Icon name="MapPin" size={16} />
                <span>Sydney 2025</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Icon name="MapPin" size={16} />
                <span>Berlin 2025</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Icon name="MapPin" size={16} />
                <span>São Paulo 2026</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalPresence;