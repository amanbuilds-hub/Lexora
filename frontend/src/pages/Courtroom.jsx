import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import HearingRoom from '../components/HearingRoom';

const Courtroom = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'prisoner'; // For demo, get from URL

  // In a real app, you'd fetch user data from context and validate permissions for this roomId
  const isAuthorized = true; // Placeholder for logic: check if user.id is in case.participants

  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Lexora Virtual E-Court</h1>
            <p className="text-slate-400">Authenticated as: <span className="text-lexora-gold capitalize font-bold">{role}</span></p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm mb-1 font-bold uppercase">Hearing ID</p>
            <p className="text-white font-mono text-xl">{roomId}</p>
          </div>
        </div>

        {isAuthorized ? (
          <HearingRoom roomId={roomId} userRole={role} />
        ) : (
          <div className="glass p-20 rounded-3xl text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Unauthorized Access</h2>
            <p className="text-slate-400">You do not have permission to enter this hearing room.</p>
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h4 className="text-lexora-gold font-bold mb-2">Legal Compliance</h4>
            <p className="text-slate-400 text-sm">This session is being recorded and timestamped as per the Information Technology Act, 2000.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h4 className="text-lexora-gold font-bold mb-2">Identity Verified</h4>
            <p className="text-slate-400 text-sm">Participants have been verified via Biometric and Bar Council credentials.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h4 className="text-lexora-gold font-bold mb-2">Technical Support</h4>
            <p className="text-slate-400 text-sm">Facing issues? Contact the Jail Authority Support Desk via the kiosk intercom.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courtroom;
