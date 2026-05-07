const mongoose = require("mongoose");
const Journal = require("../src/models/Journal");
const User = require("../src/models/User");
const { getCurrentJournal } = require("../src/controllers/journalController");

jest.mock("nanoid", () => ({
  nanoid: () => "test-id"
}));

describe("Journal Timeline Logic", () => {
  let user;

  beforeAll(async () => {
    // Connect to test db
    await mongoose.connect("mongodb://127.0.0.1:27017/my-journal-test-db");
    
    await User.deleteMany({});
    await Journal.deleteMany({});

    user = await User.create({
      fullName: "Test User",
      email: "test@test.com",
      username: "testuser",
      password: "password123",
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should assign day 3 when skipping day 3 and journaling on day 4", async () => {
    const today = new Date("2026-05-01T12:00:00Z");
    const tomorrow = new Date("2026-05-02T12:00:00Z");
    const day4 = new Date("2026-05-04T12:00:00Z"); // Skip the 3rd!

    // 1. Simulate Day 1
    await Journal.create({
      user: user._id,
      dayNumber: 1,
      date: today,
      title: "My Journal",
      metrics: { hoursWorked: "5", energyLevel: 5, focusQuality: 5, mood: "Good" },
      closed: true,
      notes: `Entry 1`
    });

    // 2. Simulate Day 2
    await Journal.create({
      user: user._id,
      dayNumber: 2,
      date: tomorrow,
      title: "My Journal",
      metrics: { hoursWorked: "5", energyLevel: 5, focusQuality: 5, mood: "Good" },
      closed: true,
      notes: `Entry 2`
    });

    // 3. Fast forward to Day 4
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
    jest.setSystemTime(day4);

    // Call the controller method
    const req = { user: { _id: user._id } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getCurrentJournal(req, res);

    jest.useRealTimers();

    // The controller should return the newly created journal with dayNumber 3
    expect(res.json).toHaveBeenCalled();
    const resultJournal = res.json.mock.calls[0][0];
    
    expect(resultJournal.dayNumber).toBe(3);
    expect(new Date(resultJournal.date).toDateString()).toBe(day4.toDateString());
  });
});
