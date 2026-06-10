import React, { useState } from 'react';
import api from '../api/config';
import { ShieldAlert, CheckCircle, Copy, AlertCircle, Info } from 'lucide-react';

const GrievanceForm = () => {
  const [formData, setFormData] = useState({ category: 'Other', description: '' });
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/grievance/submit', formData);
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      alert('Error submitting grievance');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto glass p-12 rounded-[3rem] text-center shadow-2xl animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-4xl font-black text-lexora-justice mb-4">Grievance Submitted</h2>
        <p className="text-slate-500 mb-10 leading-relaxed">
          Your complaint has been recorded anonymously. Our AI has categorized this as <span className={`font-bold ${result.urgency === 'Urgent' ? 'text-red-500' : 'text-blue-500'}`}>{result.urgency}</span>.
        </p>
        
        <div className="bg-slate-50 p-8 rounded-3xl mb-10 border-2 border-dashed border-slate-200">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">Your Anonymous Tracking Token</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl font-mono font-black text-lexora-justice">{result.token}</span>
            <button 
              onClick={() => navigator.clipboard.writeText(result.token)}
              className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-100 transition-colors"
            >
              <Copy size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-400 italic flex items-center justify-center gap-2">
          <Info size={16} /> Save this token. It is the ONLY way to track your case.
        </p>
        
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-12 text-lexora-justice font-bold hover:underline"
        >
          Submit another grievance
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-12 pb-24">
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-black text-lexora-justice mb-4">Grievance Redressal</h2>
        <p className="text-xl text-slate-500">Speak up safely. Your identity is never stored.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-12 rounded-[3rem] shadow-2xl border border-white/20">
        <div className="mb-8">
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Issue Category</label>
          <select 
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-lexora-justice focus:border-lexora-justice outline-none transition-colors"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {['Physical abuse', 'Medical neglect', 'Visitation denied', 'Food deprivation', 'Other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="mb-10">
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Detailed Description</label>
          <textarea 
            required
            rows="6"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 font-medium text-slate-700 focus:border-lexora-justice outline-none transition-colors resize-none"
            placeholder="Describe the incident with dates and locations..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        <div className="bg-amber-50 p-6 rounded-2xl mb-10 flex gap-4 border border-amber-100">
          <ShieldAlert className="text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Anonymous Protection:</strong> We do not store your name, phone number, or relationship to the prisoner with this report. Only the complaint itself is logged.
          </p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-lexora-justice text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {loading ? 'Processing...' : (
            <>
              <AlertCircle size={24} />
              Submit Anonymous Report
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default GrievanceForm;
