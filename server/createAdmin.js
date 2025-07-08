const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const username = import .meta.env.USERNAME;
  const password = import.meta.env.PASSWORD;

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, passwordHash });
  await admin.save();
  console.log("Admin user created");
  process.exit(0);
}

createAdmin();
