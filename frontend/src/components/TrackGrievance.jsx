import React, { useState } from 'react';
import axios from 'axios';
import { Search, History, ShieldCheck, Clock, MessageSquare } from 'lucide-react';

const TrackGrievance = () => {
  const [token, setToken] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`https://lexora-wz7z.onrender.com/api/v1/grievance/status/${token}`);
      setData(res.data.data);
    } catch (err) {
      setError('Invalid token or grievance not found.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-24">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-lexora-justice mb-4">Track Your Grievance</h2>
        <p className="text-lg text-slate-500">Enter your 8-digit anonymous token below.</p>
      </div>

      <div className="glass p-8 rounded-[2.5rem] mb-12 shadow-xl border border-white">
        <form onSubmit={handleTrack} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Enter Token (e.g., A1B2C3D4)"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-16 pr-6 font-mono font-bold text-xl uppercase focus:border-lexora-justice outline-none"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-lexora-justice text-white px-10 rounded-2xl font-black hover:bg-opacity-90 transition-all"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 font-bold text-center">{error}</p>}
      </div>

      {data && (
        <div className="animate-in slide-in-from-bottom-10 duration-500">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass p-6 rounded-3xl border border-white shadow-lg">
              <p className="text-xs font-black text-slate-400 uppercase mb-2">Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${data.status === 'Resolved' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
                <h3 className="text-2xl font-black text-lexora-justice">{data.status}</h3>
              </div>
            </div>
            <div className="glass p-6 rounded-3xl border border-white shadow-lg">
              <p className="text-xs font-black text-slate-400 uppercase mb-2">Priority</p>
              <h3 className={`text-2xl font-black ${data.urgency === 'Urgent' ? 'text-red-500' : 'text-blue-500'}`}>{data.urgency}</h3>
            </div>
            <div className="glass p-6 rounded-3xl border border-white shadow-lg">
              <p className="text-xs font-black text-slate-400 uppercase mb-2">Category</p>
              <h3 className="text-xl font-bold text-lexora-justice">{data.category}</h3>
            </div>
          </div>

          {/* Admin Response */}
          {data.response && (
            <div className="bg-blue-50 border-2 border-blue-100 p-8 rounded-[2.5rem] mb-8 flex gap-6">
              <div className="bg-blue-600 p-4 rounded-2xl text-white h-fit">
                <MessageSquare size={24} />
              </div>
              <div>
                <h4 className="font-black text-blue-900 mb-2">Official Resolution Response</h4>
                <p className="text-blue-800 leading-relaxed font-medium">{data.response}</p>
              </div>
            </div>
          )}

          {/* Audit Log */}
          <div className="glass rounded-[2.5rem] overflow-hidden border border-white shadow-xl">
            <div className="p-8 border-b border-slate-100 bg-white/50 flex items-center gap-3">
              <ShieldCheck className="text-lexora-gold" />
              <h4 className="text-xl font-black">Immutable Audit Trail</h4>
            </div>
            <div className="p-8 space-y-8">
              {data.history.map((step, i) => (
                <div key={i} className="flex gap-6 relative">
                  {i !== data.history.length - 1 && <div className="absolute left-6 top-12 w-0.5 h-12 bg-slate-100"></div>}
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-black text-lexora-justice capitalize">{step.action}</span>
                      <span className="text-xs text-slate-400 font-bold">{new Date(step.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 truncate max-w-md">Hash: {step.currentHash}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackGrievance;
