const dotenv = require("dotenv");
dotenv.config({ override: true });

const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const journalRoutes = require("./routes/journal");
const startAutoCloseJob = require("./cron/autoCloseJournals");
const app = express();

dbConnect();

function dbConnect() {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/my-journal";
  console.log("MONGO_URI starts with:", mongoUri.substring(0, 30) + "...");
  connectDB(mongoUri);
}

app.use(cors());
app.use(bodyParser.json({ limit: "12mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/ping', (req, res) => {
  res.json({ message: 'My Journal backend is awake' });
});

app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`My Journal backend running on http://localhost:${PORT}`);
  startAutoCloseJob();
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Run: taskkill /F /IM node.exe`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});
