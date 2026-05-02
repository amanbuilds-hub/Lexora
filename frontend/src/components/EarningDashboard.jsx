import React, { useState, useEffect } from 'react';
import { Wallet, PieChart, ArrowUpRight, History, ShieldCheck } from 'lucide-react';

const EarningDashboard = () => {
  const [stats, setStats] = useState({
    totalEarned: 12450.00,
    familyShare: 7470.00,
    prisonShare: 2490.00,
    rehabShare: 2490.00,
    transactions: [
      { id: 'TX-101', task: 'Handcrafted Chairs', date: '2024-05-01', amount: 1500, hash: '0x3f...a2' },
      { id: 'TX-102', task: 'Terracotta Pottery', date: '2024-04-28', amount: 800, hash: '0x8b...c9' },
      { id: 'TX-103', task: 'Web App Backend', date: '2024-04-25', amount: 5000, hash: '0xf1...d4' }
    ]
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-12">
        <h2 className="text-4xl font-extrabold text-lexora-justice mb-4">Financial Empowerment</h2>
        <p className="text-slate-500 text-lg">Transparent tracking of your family member's rehabilitation earnings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-lexora-justice p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -translate-y-12 translate-x-12 blur-3xl"></div>
          <Wallet className="mb-6 opacity-50" size={32} />
          <p className="text-blue-200 font-bold text-sm uppercase tracking-widest mb-1">Total Family Share (60%)</p>
          <h3 className="text-4xl font-black">₹{stats.familyShare.toLocaleString()}</h3>
          <div className="mt-6 flex items-center gap-2 text-green-400 font-bold text-sm">
            <ArrowUpRight size={16} />
            +12% from last month
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-white shadow-xl">
          <PieChart className="text-lexora-gold mb-6" size={32} />
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-1">Overall Earnings</p>
          <h3 className="text-4xl font-black text-lexora-justice">₹{stats.totalEarned.toLocaleString()}</h3>
          <div className="mt-6 h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-lexora-justice" style={{ width: '60%' }}></div>
            <div className="h-full bg-lexora-gold" style={{ width: '20%' }}></div>
            <div className="h-full bg-slate-300" style={{ width: '20%' }}></div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-white shadow-xl flex flex-col justify-between">
          <div>
            <ShieldCheck className="text-green-500 mb-6" size={32} />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-1">Audit Status</p>
            <h3 className="text-2xl font-black text-lexora-justice">Verified Chain</h3>
          </div>
          <p className="text-slate-500 text-xs mt-4">Every rupee is tracked on our tamper-proof audit log.</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass rounded-[2rem] overflow-hidden border border-white shadow-xl">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <h4 className="text-2xl font-bold flex items-center gap-3">
            <History className="text-lexora-gold" />
            Earning Statement
          </h4>
          <button className="text-lexora-justice font-bold text-sm hover:underline">Download PDF</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest">
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6">Task Description</th>
                <th className="px-8 py-6 text-right">Amount (₹)</th>
                <th className="px-8 py-6 text-center">Blockchain Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.transactions.map((tx, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6 font-bold text-slate-500">{tx.date}</td>
                  <td className="px-8 py-6 font-black text-lexora-justice">{tx.task}</td>
                  <td className="px-8 py-6 text-right font-black text-lexora-justice">₹{tx.amount}</td>
                  <td className="px-8 py-6 text-center">
                    <span className="font-mono text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-400 group-hover:bg-lexora-gold group-hover:text-white transition-colors cursor-help">
                      {tx.hash}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningDashboard;
