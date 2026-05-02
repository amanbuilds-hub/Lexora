import React, { useState } from 'react';
import GrievanceForm from '../components/GrievanceForm';
import TrackGrievance from '../components/TrackGrievance';

const GrievancePortal = () => {
  const [activeTab, setActiveTab] = useState('submit');

  return (
    <div className="min-h-screen bg-slate-50 pt-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-16">
          <div className="bg-white p-2 rounded-3xl shadow-xl flex gap-2 border border-slate-100">
            <button 
              onClick={() => setActiveTab('submit')}
              className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${
                activeTab === 'submit' ? 'bg-lexora-justice text-white shadow-lg' : 'text-slate-400 hover:text-lexora-justice'
              }`}
            >
              Submit Complaint
            </button>
            <button 
              onClick={() => setActiveTab('track')}
              className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${
                activeTab === 'track' ? 'bg-lexora-justice text-white shadow-lg' : 'text-slate-400 hover:text-lexora-justice'
              }`}
            >
              Track Progress
            </button>
          </div>
        </div>

        {activeTab === 'submit' ? <GrievanceForm /> : <TrackGrievance />}
      </div>
    </div>
  );
};

export default GrievancePortal;
