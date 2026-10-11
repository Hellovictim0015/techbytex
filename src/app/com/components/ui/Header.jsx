  import React, { useState, useEffect } from 'react';
  import { Link, useLocation } from 'react-router-dom';
  import Icon from '../AppIcon';
  import Button from './Button';

  const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const navigationItems = [
      { name: 'Home', path: '/homepage', icon: 'Home' },
      { name: 'Solutions', path: '/solutions-overview', icon: 'Layers' },
      { name: 'About', path: '/about-us-ecosystem', icon: 'Users' },
      { name: 'Insights', path: '/technology-insights', icon: 'BookOpen' },
      { name: 'Innovation Lab', path: '/innovation-laboratory', icon: 'Zap' }
    ];

    const secondaryItems = [
      { name: 'Contact', path: '/contact-consultation', icon: 'MessageCircle' }
    ];

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
      setIsMenuOpen(false);
    };

    const isActivePath = (path) => {
      return location?.pathname === path;
    };

    const Logo = () => (
      <Link to="/homepage" className="flex items-center space-x-3 group" onClick={closeMenu}>
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
            GeekyAnts
          </span>
          <span className="text-xs font-medium text-secondary uppercase tracking-wider">
            Pro
          </span>
        </div>
      </Link>
    );

    return (
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-border'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActivePath(item?.path)
                      ? 'bg-accent/10 text-accent border border-accent/20' :'text-secondary hover:text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.name}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/contact-consultation"
                className="text-secondary hover:text-primary transition-colors duration-300 text-sm font-medium"
              >
                Contact
              </Link>
              <Button
                variant="default"
                size="sm"
                iconName="Calendar"
                iconPosition="left"
                className="bg-accent hover:bg-accent/90 text-white"
              >
                Schedule Call
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-muted transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-screen opacity-100 visible' :'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md border-t border-border">
            <nav className="px-4 py-4 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActivePath(item?.path)
                      ? 'bg-accent/10 text-accent border border-accent/20' :'text-secondary hover:text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-border mt-4">
                {secondaryItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={closeMenu}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-secondary hover:text-primary hover:bg-muted transition-all duration-300"
                  >
                    <Icon name={item?.icon} size={20} />
                    <span>{item?.name}</span>
                  </Link>
                ))}
                
                <div className="px-4 py-3">
                  <Button
                    variant="default"
                    size="default"
                    iconName="Calendar"
                    iconPosition="left"
                    fullWidth
                    className="bg-accent hover:bg-accent/90 text-white"
                  >
                    Schedule Strategy Call
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
  };

  export default Header;