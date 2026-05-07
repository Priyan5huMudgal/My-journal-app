const mongoose = require("mongoose");
const Journal = require("./src/models/Journal");
const User = require("./src/models/User");

async function runTest() {
  await mongoose.connect("mongodb://127.0.0.1:27017/my-journal");
  console.log("Connected to DB.");

  // Clean up
  await User.deleteMany({ username: "timeline_tester" });
  
  // 1. Create a dummy user
  const user = await User.create({
    fullName: "Timeline Tester",
    email: "timeline@test.com",
    username: "timeline_tester",
    password: "Password1!",
  });

  // Helper to create a journal entry on a specific date
  const createEntryForDate = async (dayNumber, dateString) => {
    return await Journal.create({
      user: user._id,
      dayNumber: dayNumber,
      date: new Date(dateString),
      title: "My Journal",
      metrics: { hoursWorked: "5", energyLevel: 5, focusQuality: 5, mood: "Good" },
      closed: true,
      notes: `Entry for ${dateString}`
    });
  };

  const today = new Date();
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const day4 = new Date(today);
  day4.setDate(day4.getDate() + 4);

  // 2. User journals today (Day 1)
  await createEntryForDate(1, today.toISOString());
  console.log(`User journaled on TODAY (${today.toDateString()}) -> Assigned Day 1`);

  // 3. User journals tomorrow (Day 2)
  await createEntryForDate(2, tomorrow.toISOString());
  console.log(`User journaled on TOMORROW (${tomorrow.toDateString()}) -> Assigned Day 2`);

  // 4. Now pretend today is 4 days from today.
  // The system logic inside getCurrentJournal:
  const lastJournal = await Journal.findOne({ user: user._id }).sort({ dayNumber: -1 });
  const nextDayNumber = lastJournal ? lastJournal.dayNumber + 1 : 1;
  
  console.log(`\nFast forward 4 days... User opens the app on ${day4.toDateString()}`);
  console.log(`System checks highest day number... It was ${lastJournal.dayNumber}`);
  console.log(`System creates new entry with Day Number: ${nextDayNumber}`);
  
  await createEntryForDate(nextDayNumber, day4.toISOString());

  // 5. Fetch all days for the user
  const allDays = await Journal.find({ user: user._id }).sort({ dayNumber: 1 });
  
  console.log("\n--- Final Journal List ---");
  allDays.forEach(day => {
    console.log(`Day ${day.dayNumber} | Calendar Date: ${day.date.toDateString()}`);
  });

  await mongoose.disconnect();
}

runTest().catch(console.error);
