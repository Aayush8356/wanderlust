import React from 'react';

const JournalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Travel Journal</h1>
          <p className="text-gray-600 mb-8">Capture and preserve your travel memories</p>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No journal entries yet</h3>
              <p className="text-gray-600 mb-6">Start documenting your travel experiences!</p>
              <button className="btn-primary">
                Write Your First Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;