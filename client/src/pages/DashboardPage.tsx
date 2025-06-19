import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'}}>

      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready for your next adventure? Here's what's happening with your travels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 slide-up">
            <div className="card text-center">
              <div className="feature-icon mx-auto mb-4" style={{width: '4rem', height: '4rem'}}>
                <span style={{fontSize: '2rem'}}>✈️</span>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Trips</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>

            <div className="card text-center">
              <div className="feature-icon mx-auto mb-4" style={{width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
                <span style={{fontSize: '2rem'}}>📅</span>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>

            <div className="card text-center">
              <div className="feature-icon mx-auto mb-4" style={{width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                <span style={{fontSize: '2rem'}}>🌍</span>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Countries</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>

            <div className="card text-center">
              <div className="feature-icon mx-auto mb-4" style={{width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>
                <span style={{fontSize: '2rem'}}>📝</span>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Journal Entries</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="card scale-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-heading font-bold text-gray-900">Upcoming Trips</h3>
                <Link
                  to="/trips"
                  className="text-gradient font-semibold hover:opacity-80 transition-opacity"
                >
                  View all →
                </Link>
              </div>
              <div className="text-center py-8">
                <div className="text-6xl mb-4 opacity-50">✈️</div>
                <p className="text-gray-600 mb-6 text-lg">No upcoming trips planned</p>
                <Link
                  to="/trips"
                  className="btn-primary"
                >
                  Plan Your First Trip
                </Link>
              </div>
            </div>

            <div className="card scale-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-heading font-bold text-gray-900">Recent Activity</h3>
                <Link
                  to="/journal"
                  className="text-gradient font-semibold hover:opacity-80 transition-opacity"
                >
                  View journal →
                </Link>
              </div>
              <div className="text-center py-8">
                <div className="text-6xl mb-4 opacity-50">📝</div>
                <p className="text-gray-600 mb-6 text-lg">No journal entries yet</p>
                <Link
                  to="/journal"
                  className="btn-primary"
                >
                  Start Writing
                </Link>
              </div>
            </div>
          </div>

          <div className="card scale-in" style={{background: 'var(--gradient-primary)', animationDelay: '0.4s'}}>
            <div className="flex flex-col md:flex-row items-center justify-between text-white">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                  Ready to explore new destinations?
                </h3>
                <p className="text-blue-100 text-lg">
                  Discover amazing places and get inspired for your next adventure.
                </p>
              </div>
              <div>
                <Link
                  to="/explore"
                  className="btn-secondary bg-white text-purple-600 hover:bg-gray-100"
                >
                  🌍 Explore Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;