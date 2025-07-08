const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const username = "admin";
  const password = "Action.027";

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, passwordHash });
  await admin.save();
  console.log("Admin user created");
  process.exit(0);
}

createAdmin();
