import React from 'react';

const TripsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Trips</h1>
          <p className="text-gray-600 mb-8">Plan and manage your travel adventures</p>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✈️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
              <p className="text-gray-600 mb-6">Start planning your first adventure!</p>
              <button className="btn-primary">
                Create Your First Trip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripsPage;