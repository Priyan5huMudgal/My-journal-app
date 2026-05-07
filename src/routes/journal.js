const express = require("express");
const {
  getCurrentJournal,
  getJournalDays,
  getJournalDay,
  createNextDay,
  updateJournal,
  closeJournal,
} = require("../controllers/journalController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/current", getCurrentJournal);
router.get("/days", getJournalDays);
router.get("/day/:dayNumber", getJournalDay);
router.post("/next", createNextDay);
router.put("/update", updateJournal);
router.put("/close", closeJournal);

module.exports = router;
