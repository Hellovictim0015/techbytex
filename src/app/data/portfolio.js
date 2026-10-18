// Seed data for the /portfolio page (originally hardcoded in newcom/OurProjects.js).
// The live list is managed from Admin → Portfolio (portfolio_projects table);
// scripts/import-portfolio.mjs copies these into the database and copies each
// imageFile into uploads/portfolio/. Pure data — safe to import from Node scripts.
export const portfolioSeed = [
  {
    "title": "Carlust",
    "subtitle": "Premium Car Rental Platform",
    "seoHeading": "Carlust – React Native Car Rental App Development",
    "description": "Discover, compare, and book your dream car in seconds. Carlust offers a seamless and premium mobile experience for finding the perfect vehicle.",
    "imageFile": "public/carkust.png",
    "altText": "Carlust Car Rental App React Native UI by TechByteX",
    "category": "App",
    "clientType": "Private Startup",
    "role": "Full Stack Development",
    "stats": [
      "🚀 2x Faster Booking",
      "📱 Cross-Platform",
      "🔒 Secure Payments"
    ],
    "technologies": [
      "React Native",
      "Node.js",
      "Express",
      "MongoDB",
      "Google Maps API",
      "Socket.io"
    ],
    "caseStudy": {
      "problem": "Users faced slow loading times and complex booking steps on existing platforms.",
      "solution": "Developed a real-time availability engine using WebSockets and an optimized React Native UI.",
      "result": "Increased user retention by 40% and reduced booking time to under 60 seconds."
    },
    "features": [
      "Seamless Car Discovery & Advanced Filtering",
      "Real-time Booking & Availability Map",
      "Secure In-App Payments & Digital Documentation",
      "Verified User & Host Review System"
    ],
    "link": "https://play.google.com/store/apps/details?id=com.carlust.automotive.app"
  },
  {
    "title": "Floresta Wud",
    "subtitle": "Premium Wood & Interior Solutions",
    "seoHeading": "Floresta Wud – Next.js E-Commerce & Showcase Website",
    "description": "Floresta Wud is a modern website showcasing high-quality wood products and interior solutions with a clean and professional UI.",
    "imageFile": "public/Gemini_Generated_Image_r6lg8xr6lg8xr6lg.png",
    "altText": "Premium Interior Design Website UI Next.js",
    "category": "Website",
    "clientType": "B2B Enterprise",
    "role": "Frontend Developer & UI/UX",
    "stats": [
      "⚡ Sub-second Load",
      "📈 SEO Optimized",
      "🎨 Premium UI"
    ],
    "technologies": [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Node.js"
    ],
    "caseStudy": {
      "problem": "Client's old site had high bounce rates due to poor mobile responsiveness.",
      "solution": "Built a mobile-first, image-heavy Next.js architecture with lazy loading.",
      "result": "Boosted organic traffic by 65% in 3 months."
    },
    "features": [
      "Modern UI with Clean Product Showcase",
      "Responsive Design for Mobile & Desktop",
      "Fast Loading and SEO Optimized",
      "Contact & Inquiry Form Integration"
    ],
    "link": "https://www.florestawud.com/"
  },
  {
    "title": "First Step Movies",
    "subtitle": "Film Production & Media Portfolio",
    "seoHeading": "First Step Movies – Creative Portfolio Website Development",
    "description": "A creative portfolio website for a film production company. It showcases movies, video projects, and media content with a visually engaging design.",
    "imageFile": "public/Gemini_Generated_Image_7kmlwk7kmlwk7kml.png",
    "altText": "Film Production Portfolio Website UI React",
    "category": "Website",
    "clientType": "Media & Entertainment",
    "role": "Frontend React Developer",
    "stats": [
      "🎬 High-Res Media",
      "📱 Fully Responsive",
      "⚡ Fast Streaming"
    ],
    "technologies": [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Node.js"
    ],
    "caseStudy": {
      "problem": "Client needed a highly visual, fast-loading platform to showcase heavy video content.",
      "solution": "Integrated optimized video embeds and Next.js static site generation for peak performance.",
      "result": "Increased client inquiries by 50% and improved site speed score to 95+."
    },
    "features": [
      "Creative Portfolio Showcase for Films & Videos",
      "Modern UI with High-Quality Visual Content",
      "Video Embedding & Media Gallery",
      "Contact & Inquiry Form Integration"
    ],
    "link": "https://www.firststepmovies.com/"
  },
  {
    "title": "Mera Panchayat Pura",
    "subtitle": "Government Information Portal",
    "seoHeading": "Mera Panchayat Pura – Digital India Rural Web Portal",
    "description": "A government-based web portal designed to provide villagers with easy access to panchayat information, schemes, and public services.",
    "imageFile": "public/Gemini_Generated_Image_5bzj615bzj615bzj.png",
    "altText": "Government Panchayat Web Portal Dashboard",
    "category": "Government",
    "clientType": "Government / Public Sector",
    "role": "Lead Full Stack Engineer",
    "stats": [
      "🛡️ Highly Secure",
      "🌍 Multi-lingual",
      "📱 Low-Bandwidth Optimized"
    ],
    "technologies": [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "MySQL"
    ],
    "caseStudy": {
      "problem": "Lack of transparent, accessible digital records for rural communities.",
      "solution": "Created a lightweight, accessible PWA ensuring performance on 3G networks.",
      "result": "Successfully digitized records for 50+ local panchayats."
    },
    "features": [
      "Government Schemes & Updates Listing",
      "Village Information & Public Notices",
      "Secure Data Handling & Authentication",
      "Online Forms & Service Access"
    ],
    "link": "https://www.merapanchayatpura.in/"
  },
  {
    "title": "Revive & Relax Spa",
    "subtitle": "Wellness & Booking Platform",
    "seoHeading": "Revive & Relax Spa – Custom Booking Web App",
    "description": "Your ultimate destination for relaxation, rejuvenation, and inner harmony. A complete digital booking and wellness management system.",
    "imageFile": "src/img2/spa.png",
    "altText": "Spa and Wellness Booking Website Next.js",
    "category": "Website",
    "clientType": "Private Business",
    "role": "Full Stack Developer",
    "stats": [
      "📅 Automated Booking",
      "💳 Online Payments",
      "🎨 Calming UI"
    ],
    "technologies": [
      "React.js",
      "NEXT.js",
      "Node.js",
      "MySQL",
      "Google API",
      "Tailwind CSS"
    ],
    "caseStudy": {
      "problem": "Manual appointment scheduling was causing double-bookings and lost revenue.",
      "solution": "Implemented a real-time calendar booking system connected to Google API.",
      "result": "Reduced scheduling conflicts to 0% and increased bookings by 30%."
    },
    "features": [
      "Luxurious Spa Treatments & Booking",
      "Holistic Wellness Therapies",
      "Premium Organic Products Shop",
      "Steam & Sauna Experience Management"
    ],
    "link": null
  },
  {
    "title": "Hamaradhikar News",
    "subtitle": "Real-time News Portal",
    "seoHeading": "Hamaradhikar News – High Traffic News Web Application",
    "description": "Hamaradhikar is your go-to destination for accurate, timely, and unbiased news coverage with live streaming capabilities.",
    "imageFile": "src/img2/ad.png",
    "altText": "News Portal Website Development React Node",
    "category": "Website",
    "clientType": "Media & Journalism",
    "role": "MERN Stack Developer",
    "stats": [
      "🚀 High Traffic Scalable",
      "📡 Live Streaming",
      "📰 Real-time Updates"
    ],
    "technologies": [
      "React.js",
      "Redux",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Bootstrap"
    ],
    "caseStudy": {
      "problem": "Previous platform crashed during breaking news spikes.",
      "solution": "Migrated to a scalable Node.js + MongoDB architecture with caching.",
      "result": "Achieved 99.9% uptime handling over 100k+ concurrent users."
    },
    "features": [
      "Breaking News & Real-Time Updates",
      "Unbiased & Fact-Based Reporting",
      "Live News Streaming & Video Reports",
      "Interactive Community Engagement"
    ],
    "link": null
  },
  {
    "title": "TestSeries Innovator",
    "subtitle": "EdTech Exam Platform",
    "seoHeading": "TestSeries Innovator – EdTech SaaS App Development",
    "description": "A comprehensive platform designed to help students and professionals excel in competitive exams with smart analytics.",
    "imageFile": "src/img2/ts.png",
    "altText": "EdTech Exam Platform Dashboard Python React",
    "category": "App",
    "clientType": "EdTech Startup",
    "role": "Backend & System Architecture",
    "stats": [
      "📊 Smart Analytics",
      "🔒 Anti-Cheat System",
      "📝 10k+ Questions"
    ],
    "technologies": [
      "Python",
      "Django",
      "PostgreSQL",
      "Stripe",
      "Chakra UI",
      "React.js"
    ],
    "caseStudy": {
      "problem": "Students lacked actionable feedback on their test performance.",
      "solution": "Built a Python-based analytics engine to track weak areas and suggest study plans.",
      "result": "Improved average student test scores by 25% within one semester."
    },
    "features": [
      "Real-Time Exam Simulation",
      "Performance Analytics & Reports",
      "Personalized Study Plans",
      "Expert-Curated Questions"
    ],
    "link": null
  },
  {
    "title": "Hello Victim",
    "subtitle": "Tech Blog & Community",
    "seoHeading": "Hello Victim – AI-Powered Tech Blog Platform",
    "description": "Diving deep into the ever-evolving world of technology, from AI trends to cybersecurity and gaming coverage.",
    "imageFile": "src/img2/gi.png",
    "altText": "Tech Blog Website SEO AI React",
    "category": "Website",
    "clientType": "Independent Creator",
    "role": "Full Stack Developer",
    "stats": [
      "🤖 AI Integrations",
      "📈 SEO Optimized",
      "💬 Community Forums"
    ],
    "technologies": [
      "React.js",
      "OpenAI API",
      "TensorFlow.js",
      "Stripe",
      "MongoDB",
      "OAuth"
    ],
    "caseStudy": {
      "problem": "Content creation was slow and user engagement was low.",
      "solution": "Integrated OpenAI API for content drafting and added an OAuth community forum.",
      "result": "Increased content output by 3x and grew community members by 5,000+."
    },
    "features": [
      "Latest Tech News & Trends",
      "AI & Future Tech Insights",
      "Cybersecurity & Ethical Hacking",
      "Exclusive Deals & Recommendations"
    ],
    "link": null
  },
  {
    "title": "Balodeco Tourism",
    "subtitle": "Eco-Tourism Booking",
    "seoHeading": "Balodeco Tourism – Eco-Friendly Travel Web App",
    "description": "Your gateway to breathtaking destinations, rich cultural experiences, and eco-friendly adventures.",
    "imageFile": "src/img2/ai.png",
    "altText": "Eco Tourism Booking App Python Django",
    "category": "Website",
    "clientType": "Travel Agency",
    "role": "Full Stack Developer",
    "stats": [
      "🌍 Global Destinations",
      "💳 Multi-currency",
      "🌱 Eco-Verified"
    ],
    "technologies": [
      "Python",
      "Django",
      "PostgreSQL",
      "PayPal",
      "HTML/CSS"
    ],
    "caseStudy": {
      "problem": "Client needed a way to highlight eco-friendly packages specifically.",
      "solution": "Developed a custom filtering and booking engine centered around sustainability scores.",
      "result": "Increased premium eco-package sales by 45%."
    },
    "features": [
      "Eco-Friendly Travel Booking",
      "Curated Destinations",
      "Adventure Activities",
      "Wildlife & Nature Conservation"
    ],
    "link": null
  }
];
