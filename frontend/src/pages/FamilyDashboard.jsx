import React, { useState, useEffect } from 'react';
import api from '../api/config';
import { useNavigate } from 'react-router-dom';
import CaseTimeline from '../components/CaseTimeline';
import { User, MapPin, FileText, CreditCard, ShoppingBag, AlertCircle } from 'lucide-react';

const FamilyDashboard = () => {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await api.get('/cases/my-prisoner/status');
        setCaseData(res.data.data);
      } catch (err) {
        console.log("Using mock data for demonstration");
        setCaseData({
          caseNumber: "LC-2024-8842",
          offenseType: "Section 379 IPC (Theft)",
          arrestDate: "2024-01-15",
          currentStatus: "In Progress",
          nextHearingDate: "2024-06-20",
          isPendingFlagged: true,
          aiAlertMessage: "AI Alert: This case has been pending for over 6 months since arrest (Jan 15 2024). Immediate legal intervention recommended.",
          hearings: [
            { hearingDate: "2024-02-10", outcome: "Initial evidence presented. Adjourned for witness.", nextHearingDate: "2024-03-15" },
            { hearingDate: "2024-03-15", outcome: "Witness testimony recorded. Next date for cross-examination.", nextHearingDate: "2024-04-25" },
            { hearingDate: "2024-04-25", outcome: "Cross-examination completed. Defense arguments scheduled.", nextHearingDate: "2024-06-20" }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-lexora-justice mb-4">Family Dashboard</h1>
            <p className="text-slate-500 text-lg">Monitor legal progress and stay updated on case hearings.</p>
          </div>
          <div className="flex gap-4 mb-1">
             <button onClick={() => navigate('/grievance')} className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all">
                <AlertCircle size={18} /> File Grievance
             </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Prisoner Profile & Quick Actions */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass p-8 rounded-3xl">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-xl">
                  <User size={48} className="text-lexora-justice" />
                </div>
                <h3 className="text-2xl font-bold text-lexora-justice">Rajesh Kumar</h3>
                <p className="text-slate-500 font-medium">Prisoner ID: PX-9921</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl">
                  <MapPin className="text-lexora-gold" size={20} />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Location</p>
                    <p className="font-bold text-slate-700">Tihar Jail No. 4, Delhi</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl">
                  <FileText className="text-lexora-gold" size={20} />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Attorney</p>
                    <p className="font-bold text-slate-700">Adv. Meera Sharma</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/hearing/demo-room?role=family')}
                className="w-full mt-8 bg-lexora-justice text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg"
              >
                Request Virtual Meet
              </button>
            </div>

            {/* Quick Actions */}
            <div className="glass p-8 rounded-3xl">
              <h4 className="text-lg font-bold text-lexora-justice mb-6">Rehab Services</h4>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => navigate('/dashboard/family/earnings')}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl hover:shadow-md transition-all border border-slate-100 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <CreditCard size={20} />
                    </div>
                    <span className="font-bold text-slate-700">View Earnings</span>
                  </div>
                </button>
                <button 
                  onClick={() => navigate('/shop')}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl hover:shadow-md transition-all border border-slate-100 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-lexora-gold/20 rounded-xl text-lexora-gold group-hover:bg-lexora-gold group-hover:text-white transition-colors">
                      <ShoppingBag size={20} />
                    </div>
                    <span className="font-bold text-slate-700">Prison Marketplace</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Timeline View */}
          <div className="lg:col-span-2">
            <CaseTimeline caseData={caseData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyDashboard;
