module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Join a specific hearing room
    socket.on('join-room', (roomId, role) => {
      socket.join(roomId);
      console.log(`👤 ${role} joined room: ${roomId}`);
      
      // Notify others in the room
      socket.to(roomId).emit('user-joined', { socketId: socket.id, role });
    });

    // WebRTC Signaling
    socket.on('offer', (payload) => {
      io.to(payload.target).emit('offer', {
        offer: payload.offer,
        sender: socket.id
      });
    });

    socket.on('answer', (payload) => {
      io.to(payload.target).emit('answer', {
        answer: payload.answer,
        sender: socket.id
      });
    });

    socket.on('ice-candidate', (payload) => {
      io.to(payload.target).emit('ice-candidate', {
        candidate: payload.candidate,
        sender: socket.id
      });
    });

    // Hearing Notifications
    socket.on('schedule-hearing', (data) => {
      // data: { familyId, caseId, date }
      // In a real app, you'd map familyId to their specific socket
      io.emit('hearing-scheduled', data); // Broadcast for demo
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected');
    });
  });
};
