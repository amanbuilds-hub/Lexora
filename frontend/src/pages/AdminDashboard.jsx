import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/config';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Users, Scale, CreditCard, AlertCircle, Download, LayoutDashboard, UserPlus, Gavel } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#1A237E', '#D4AF37', '#424242', '#0ea5e9', '#ef4444'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        // Mock data for demo
        setStats({
          totalPrisoners: 1240,
          totalEarnings: 854000,
          casesByStatus: [
            { currentStatus: 'Registered', count: 400 },
            { currentStatus: 'Hearing Scheduled', count: 300 },
            { currentStatus: 'In Progress', count: 250 },
            { currentStatus: 'Bail Granted', count: 150 },
            { currentStatus: 'Convicted', count: 140 }
          ],
          skillDistribution: [
            { _id: 'Carpentry', count: 30 },
            { _id: 'Pottery', count: 20 },
            { _id: 'Coding', count: 15 },
            { _id: 'Textile', count: 35 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading Analytics...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-lexora-justice text-white p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="text-lexora-gold" size={32} />
          <h1 className="text-xl font-bold tracking-tighter">LEXORA ADMIN</h1>
        </div>
        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl font-bold text-sm"><LayoutDashboard size={18}/> Dashboard</button>
          <button className="flex items-center gap-3 hover:bg-white/5 p-4 rounded-2xl font-bold text-sm text-blue-200"><Users size={18}/> Prisoners</button>
          <button className="flex items-center gap-3 hover:bg-white/5 p-4 rounded-2xl font-bold text-sm text-blue-200"><Gavel size={18}/> Hearings</button>
          <button className="flex items-center gap-3 hover:bg-white/5 p-4 rounded-2xl font-bold text-sm text-blue-200"><UserPlus size={18}/> Lawyer Approvals</button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-lexora-justice">Prison Command Center</h2>
            <p className="text-slate-500 font-medium">Real-time oversight and administrative analytics.</p>
          </div>
          <div className="flex gap-4">
            <a href="https://lexora-wz7z.onrender.com:5000/api/v1/admin/export/report" className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all">
              <Download size={18} /> Export PDF
            </a>
            <a href="https://lexora-wz7z.onrender.com:5000/api/v1/admin/export/earnings" className="flex items-center gap-2 bg-lexora-justice text-white px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all">
              <Download size={18} /> Export CSV
            </a>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Total Undertrials', value: stats.totalPrisoners, icon: <Users />, color: 'blue' },
            { label: 'Total Earnings (INR)', value: `₹${(stats.totalEarnings/1000).toFixed(1)}k`, icon: <CreditCard />, color: 'gold' },
            { label: 'Active Hearings', value: '42', icon: <Gavel />, color: 'slate' },
            { label: 'Pending Grievances', value: '12', icon: <AlertCircle />, color: 'red' }
          ].map((s, i) => (
            <div key={i} className="glass p-8 rounded-[2.5rem] border border-white shadow-xl">
              <div className="text-slate-400 mb-4">{s.icon}</div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-3xl font-black text-lexora-justice">{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart: Case Status */}
          <div className="glass p-10 rounded-[3rem] border border-white shadow-xl h-[450px]">
            <h4 className="text-xl font-bold mb-8">Case Lifecycle Distribution</h4>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={stats.casesByStatus}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="currentStatus" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#1A237E" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart: Skill Distribution */}
          <div className="glass p-10 rounded-[3rem] border border-white shadow-xl h-[450px]">
            <h4 className="text-xl font-bold mb-8">Vocational Skill Distribution</h4>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={stats.skillDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {stats.skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
