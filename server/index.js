const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://hauntedbd.netlify.app'
];

// ✅ CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Routes
const storyRoutes = require('./routes/stories');
const adminRoutes = require("./routes/admin");

app.use('/api/stories', storyRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('📡 API Server is running');
});

// ✅ 404 Catch-all handler
app.use((req, res) => {
  const errorMessage = `❌ 404 Not Found: ${req.method} ${req.originalUrl}`;
  console.error(errorMessage);
  res.status(404).json({ error: errorMessage });
});

// DB + Server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error(err));
