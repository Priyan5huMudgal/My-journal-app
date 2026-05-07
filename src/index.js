const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const journalRoutes = require("./routes/journal");

dotenv.config();
const app = express();

dbConnect();

function dbConnect() {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/my-journal";
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

if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`My Journal backend running on http://localhost:${PORT}`);
});
