const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// ── Routes ──────────────────────────────────────────────
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/interns',  require('./routes/internRoutes'));
app.use('/api/tasks',    require('./routes/taskRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

// Root health check
app.get('/', (req, res) => {
  res.json({ message: 'Intern Tracker API is running 🚀' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
