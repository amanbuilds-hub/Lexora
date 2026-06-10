import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Shield } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://lexora-wz7z.onrender.com';
const socket = io(SOCKET_URL);

const HearingRoom = ({ roomId, userRole }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef();

  const servers = {
    iceServers: [
      { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }
    ]
  };

  useEffect(() => {
    // Initialize WebRTC
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      socket.emit('join-room', roomId, userRole);

      socket.on('user-joined', async ({ socketId }) => {
        console.log('User joined, creating offer...');
        await createOffer(socketId, stream);
      });

      socket.on('offer', async ({ offer, sender }) => {
        console.log('Received offer');
        await handleOffer(offer, sender, stream);
      });

      socket.on('answer', async ({ answer }) => {
        console.log('Received answer');
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on('ice-candidate', async ({ candidate }) => {
        if (pcRef.current) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });
    };

    if (isJoined) init();

    return () => {
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      if (localStream) localStream.getTracks().forEach(track => track.stop());
    };
  }, [isJoined]);

  const createPeerConnection = (targetSocketId, stream) => {
    const pc = new RTCPeerConnection(servers);
    
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, target: targetSocketId });
      }
    };

    pcRef.current = pc;
    return pc;
  };

  const createOffer = async (targetSocketId, stream) => {
    const pc = createPeerConnection(targetSocketId, stream);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', { offer, target: targetSocketId });
  };

  const handleOffer = async (offer, senderSocketId, stream) => {
    const pc = createPeerConnection(senderSocketId, stream);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('answer', { answer, target: senderSocketId });
  };

  const toggleMute = () => {
    localStream.getAudioTracks()[0].enabled = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStream.getVideoTracks()[0].enabled = !isVideoOff;
    setIsVideoOff(!isVideoOff);
  };

  if (!isJoined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] glass rounded-3xl p-12 text-center">
        <Shield className="w-20 h-20 text-lexora-justice mb-6" />
        <h2 className="text-3xl font-bold text-lexora-justice mb-4">Secure E-Court Hearing</h2>
        <p className="text-slate-500 max-w-md mb-10">
          You are entering a legally binding virtual hearing for Room #{roomId}. Ensure your hardware is working.
        </p>
        <button 
          onClick={() => setIsJoined(true)}
          className="bg-lexora-justice text-white px-12 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl"
        >
          Join Hearing Room
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-[700px] w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
      {/* Remote Video (Full Screen) */}
      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
        {remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
        ) : (
          <div className="text-slate-500 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center animate-pulse mb-4">
              <Video size={40} />
            </div>
            <p className="font-medium">Waiting for other participant...</p>
          </div>
        )}
      </div>

      {/* Local Video (PIP) */}
      <div className="absolute top-6 right-6 w-48 h-32 bg-slate-700 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-20">
        <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover mirror" />
        {isVideoOff && <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-white"><VideoOff size={24} /></div>}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
        <button 
          onClick={toggleMute}
          className={`p-5 rounded-2xl transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'}`}
        >
          {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
        </button>
        <button 
          onClick={toggleVideo}
          className={`p-5 rounded-2xl transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'}`}
        >
          {isVideoOff ? <VideoOff size={28} /> : <Video size={28} />}
        </button>
        <button 
          className="bg-red-500 hover:bg-red-600 text-white p-5 rounded-2xl transition-all shadow-xl shadow-red-500/20"
          onClick={() => window.location.reload()}
        >
          <PhoneOff size={28} />
        </button>
      </div>

      {/* Status Badge */}
      <div className="absolute top-6 left-6 px-4 py-2 bg-lexora-justice/80 backdrop-blur-md rounded-full text-white text-sm font-bold flex items-center gap-2 border border-white/10">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        SECURE LIVE SESSION: ROOM #{roomId}
      </div>
    </div>
  );
};

export default HearingRoom;
