require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(express.json());

// CORS — allow Vercel frontend and local dev
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    /\.vercel\.app$/,          // any *.vercel.app domain
  ],
  credentials: true,
}));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// Routes
app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/students",  require("./routes/studentRoutes"));
app.use("/api/batches",   require("./routes/batchRoutes"));
app.use("/api/labs",      require("./routes/labRoutes"));
app.use("/api/pc",        require("./routes/pcRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Health-check
app.get("/", (req, res) => {
  res.send("CDMI API Running 🚀");
});

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});