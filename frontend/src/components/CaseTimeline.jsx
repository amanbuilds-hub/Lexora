import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2, Gavel } from 'lucide-react';

const CaseTimeline = ({ caseData }) => {
  if (!caseData) return <div className="text-center p-10 glass rounded-3xl">No case records found for this prisoner.</div>;

  const statuses = [
    'Registered',
    'Hearing Scheduled',
    'In Progress',
    'Bail Granted',
    'Acquitted',
    'Convicted'
  ];

  const currentStatusIndex = statuses.indexOf(caseData.currentStatus);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Info */}
      <div className="glass p-8 rounded-3xl mb-8 flex flex-wrap justify-between items-center gap-6 border border-white/20">
        <div>
          <h2 className="text-3xl font-bold text-lexora-justice mb-2">Case #{caseData.caseNumber}</h2>
          <p className="text-slate-500 font-medium">{caseData.offenseType}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/50 p-4 rounded-2xl text-center min-w-[120px]">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Arrest Date</p>
            <p className="font-bold text-slate-700">{new Date(caseData.arrestDate).toLocaleDateString()}</p>
          </div>
          <div className="bg-lexora-justice p-4 rounded-2xl text-center min-w-[120px] text-white shadow-lg shadow-blue-200">
            <p className="text-xs uppercase tracking-wider text-blue-200 font-bold mb-1">Next Hearing</p>
            <p className="font-bold">{caseData.nextHearingDate ? new Date(caseData.nextHearingDate).toLocaleDateString() : 'TBD'}</p>
          </div>
        </div>
      </div>

      {/* AI Alert if Flagged */}
      {caseData.isPendingFlagged && (
        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl mb-8 flex items-start gap-4 animate-pulse">
          <AlertTriangle className="text-amber-500 w-8 h-8 shrink-0" />
          <div>
            <h4 className="font-bold text-amber-800 text-lg">Lexora AI Intervention Alert</h4>
            <p className="text-amber-700 leading-relaxed">{caseData.aiAlertMessage}</p>
          </div>
        </div>
      )}

      {/* Status Timeline */}
      <div className="relative mb-12">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 hidden md:block"></div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative z-10">
          {statuses.map((status, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            
            return (
              <div key={status} className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                  isCompleted ? 'bg-lexora-justice text-white shadow-lg' : 'bg-slate-100 text-slate-300'
                } ${isCurrent ? 'ring-4 ring-blue-100 scale-110' : ''}`}>
                  {isCompleted ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                </div>
                <p className={`text-xs font-bold px-2 ${isCompleted ? 'text-lexora-justice' : 'text-slate-400'}`}>
                  {status}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hearing History */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <Gavel className="text-lexora-gold" />
          Hearing History
        </h3>
        <div className="grid gap-4">
          {caseData.hearings?.map((hearing, i) => (
            <div key={i} className="glass p-6 rounded-2xl flex justify-between items-center hover:bg-white transition-colors border border-slate-100">
              <div className="flex gap-4 items-center">
                <div className="bg-slate-100 p-3 rounded-xl">
                  <Calendar className="text-slate-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-700">{new Date(hearing.hearingDate).toLocaleDateString()}</p>
                  <p className="text-slate-500 text-sm">{hearing.outcome}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Next Date</p>
                <p className="font-bold text-lexora-justice">
                  {hearing.nextHearingDate ? new Date(hearing.nextHearingDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          ))}
          {(!caseData.hearings || caseData.hearings.length === 0) && (
            <div className="text-slate-400 italic p-4">No previous hearings recorded.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseTimeline;
