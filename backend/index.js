require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const { connectMongoDB } = require('./src/config/db');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173' || 'https://lexora-1-nmmz.onrender.com', 
  credentials: true 
}));

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests'
});
app.use('/api/v1/auth', limiter);

app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', require('./src/routes/auth.routes.js'));
app.use('/api/v1/admin', require('./src/routes/admin.routes.js'));
app.use('/api/v1/cases', require('./src/routes/case.routes.js'));
app.use('/api/v1/legal', require('./src/routes/legal.routes.js'));
app.use('/api/v1/earnings', require('./src/routes/earning.routes.js'));
app.use('/api/v1/grievance', require('./src/routes/grievance.routes.js'));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Lexora API is healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// Socket.io Signaling & Notifications
const socketHandler = require('./src/utils/socket');
socketHandler(io);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Database Connections (Server starts only after successful MongoDB connection)
    await connectMongoDB();

    // Init Cron Jobs
    require('./src/utils/cron.js')();

    server.listen(PORT, () => {
      console.log(`🚀 Lexora Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
