const cron = require("node-cron");
const Journal = require("../models/Journal");

/**
 * Auto-close journals at midnight.
 * Any journal entry whose date is before today and is still open (closed: false)
 * will be automatically closed so users don't leave stale days open.
 *
 * Runs every day at 00:00 (midnight).
 */
function startAutoCloseJob() {
  cron.schedule("0 0 * * *", async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const result = await Journal.updateMany(
        { closed: false, date: { $lt: today } },
        { $set: { closed: true } }
      );

      if (result.modifiedCount > 0) {
        console.log(
          `[Auto-Close] Closed ${result.modifiedCount} journal(s) from previous days.`
        );
      }
    } catch (error) {
      console.error("[Auto-Close] Error closing journals:", error.message);
    }
  });

  console.log("[Auto-Close] Cron job scheduled — journals will auto-close at midnight.");
}

module.exports = startAutoCloseJob;
