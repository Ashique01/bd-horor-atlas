const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const allowedOrigins = [process.env.FRONTEND_ORIGIN || 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));
app.use(express.json());

const storyRoutes = require('./routes/stories');
const adminRoutes = require("./routes/admin");

app.use('/api/stories', storyRoutes);
app.use("/api/admin", adminRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('🚀 Server running on port 5000')
    );
  })
  .catch(err => console.error(err));


app.get('/', (req, res) => {
  res.send('📡 API Server is running');
});
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});