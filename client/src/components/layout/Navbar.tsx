import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Handle scroll for navbar hide/show and background change
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state for background change
      setIsScrolled(currentScrollY > 10);
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY < 100) {
        // Always show navbar near top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsVisible(false);
        setIsProfileDropdownOpen(false); // Close dropdown when hiding
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show navbar
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setIsProfileDropdownOpen(false);
      navigate('/');
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home', public: true },
    { path: '/explore', label: 'Explore', public: true },
    { path: '/dashboard', label: 'Dashboard', public: false },
    { path: '/trips', label: 'My Trips', public: false },
    { path: '/journal', label: 'Journal', public: false },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          WanderLog
        </Link>
        
        {/* Desktop Navigation */}
        <div className="navbar-nav desktop-nav">
          {navLinks.map(link => {
            if (!link.public && !isAuthenticated) return null;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="nav-buttons desktop-nav">
          {isAuthenticated ? (
            <div className="profile-dropdown-container" ref={dropdownRef}>
              <button 
                onClick={toggleProfileDropdown}
                className="profile-button"
              >
                <div className="profile-avatar">
                  <span className="profile-initials">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <span className="profile-name">
                  {user?.firstName}
                </span>
                <svg 
                  className={`profile-arrow ${isProfileDropdownOpen ? 'open' : ''}`}
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12"
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>
              
              {isProfileDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-user-info">
                      <div className="dropdown-avatar">
                        <span className="dropdown-initials">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="dropdown-user-details">
                        <div className="dropdown-user-name">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="dropdown-user-email">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                      <span className="dropdown-icon">👤</span>
                      Profile Settings
                    </Link>
                    <Link to="/premium" className="dropdown-item premium-item" onClick={() => setIsProfileDropdownOpen(false)}>
                      <span className="dropdown-icon">✨</span>
                      Upgrade to Premium
                      <span className="premium-badge">PRO</span>
                    </Link>
                    <Link to="/billing" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                      <span className="dropdown-icon">💳</span>
                      Billing & Plans
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                      <span className="dropdown-icon">⚙️</span>
                      Account Settings
                    </Link>
                    <Link to="/help" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                      <span className="dropdown-icon">❓</span>
                      Help & Support
                    </Link>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <span className="dropdown-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link login-button">
                Login
              </Link>
              <Link to="/register" className="btn-primary signup-button">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg 
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path 
              d="M3 12h18M3 6h18M3 18h18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {navLinks.map(link => {
              if (!link.public && !isAuthenticated) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <>
                <div className="mobile-user-info">
                  <div className="mobile-avatar">
                    <span className="mobile-initials">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div className="mobile-user-details">
                    <div className="mobile-user-name">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="mobile-user-email">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="mobile-divider"></div>
                <Link to="/profile" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span className="mobile-icon">👤</span>
                  Profile Settings
                </Link>
                <Link to="/settings" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span className="mobile-icon">⚙️</span>
                  Settings
                </Link>
                <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="mobile-nav-link logout">
                  <span className="mobile-icon">🚪</span>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link login-mobile" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="mobile-nav-link primary signup-mobile" onClick={closeMobileMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;