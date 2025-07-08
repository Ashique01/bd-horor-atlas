const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://hauntedbd.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('Incoming Origin:', origin);

    // Allow requests from Postman, curl, or mobile with no origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

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


