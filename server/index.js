const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173').split(',');


app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like curl or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
   credentials: true,
}));
app.use(express.json());

const storyRoutes = require('./routes/stories');
const adminRoutes = require("./routes/admin");

app.use('/api/stories', storyRoutes);
app.use("/api/admin", adminRoutes);


app.get('/', (req, res) => {
  res.send('📡 API Server is running');
});
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('🚀 Server running on port 5000')
    );
  })
  .catch(err => console.error(err));


