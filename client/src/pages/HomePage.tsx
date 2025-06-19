import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content fade-in">
          <div className="hero-compass">🧭</div>
          <h1 className="hero-title">
            Your Journey<br />
            <span className="text-gradient">Starts Here</span>
          </h1>
          <p className="hero-subtitle">
            Plan your perfect trips, discover amazing destinations, and capture your travel memories with WanderLog. 
            Your all-in-one travel companion for planning and journaling extraordinary adventures.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary scale-in">
              🚀 Start Planning Your Adventure
            </Link>
            <Link to="/explore" className="btn-secondary scale-in">
              🌍 Explore Destinations
            </Link>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="floating-element floating-1"></div>
        <div className="floating-element floating-2"></div>
        <div className="floating-element floating-3"></div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header slide-up">
            <h2 className="features-title">
              Everything you need for your travels
            </h2>
            <p className="features-subtitle">
              Plan, explore, and remember your adventures with our comprehensive travel toolkit 
              designed for modern explorers who want to make every journey unforgettable.
            </p>
          </div>

          <div className="features-grid">
            <div className="card-feature slide-up">
              <div className="feature-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="feature-title">
                Smart Trip Planning
              </h3>
              <p className="feature-description">
                Create detailed itineraries with AI-powered suggestions, custom packing lists, 
                and collaborative planning tools. Never forget the essentials again.
              </p>
              <div className="feature-tags">
                <span className="feature-tag">Itineraries</span>
                <span className="feature-tag">Packing Lists</span>
                <span className="feature-tag">Collaboration</span>
              </div>
            </div>

            <div className="card-feature slide-up" style={{animationDelay: '0.2s'}}>
              <div className="feature-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="feature-title">
                Destination Discovery
              </h3>
              <p className="feature-description">
                Explore breathtaking destinations with real-time weather forecasts, 
                local insights, and stunning photography to inspire your next adventure.
              </p>
              <div className="feature-tags">
                <span className="feature-tag">Weather</span>
                <span className="feature-tag">Photography</span>
                <span className="feature-tag">Local Tips</span>
              </div>
            </div>

            <div className="card-feature slide-up" style={{animationDelay: '0.4s'}}>
              <div className="feature-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="feature-title">
                Memory Journal
              </h3>
              <p className="feature-description">
                Capture precious moments with rich media journals, mood tracking, 
                and automatic location tagging. Your stories, beautifully preserved.
              </p>
              <div className="feature-tags">
                <span className="feature-tag">Photos</span>
                <span className="feature-tag">Mood Tracking</span>
                <span className="feature-tag">Memories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            Ready to explore<br />
            <span className="text-gradient">the world?</span>
          </h2>
          <p className="cta-subtitle">
            Join thousands of travelers who trust WanderLog to plan their perfect adventures. 
            Your next unforgettable journey starts with a single click.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary">
              🎯 Start Your Journey Today
            </Link>
            <Link to="/explore" className="btn-secondary">
              🔍 Discover Amazing Places
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;