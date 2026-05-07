const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  items: [
    {
      id: { type: String },
      text: { type: String, default: "" },
      checked: { type: Boolean, default: false },
    },
  ],
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const ExtraPageSchema = new mongoose.Schema({
  title: { type: String, default: "Extra Page" },
  background: { type: String, default: "parchment" },
  blocks: [BlockSchema],
});

const JournalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dayNumber: { type: Number, default: 1 },
    date: { type: Date, default: Date.now },
    title: { type: String, default: "My Journal" },
    quote: { type: String, default: "" },
    metrics: {
      hoursWorked: { type: String, default: "" },
      energyLevel: { type: Number, default: 5 },
      focusQuality: { type: Number, default: 5 },
      mood: { type: String, default: "Reflective" },
    },
    reflections: {
      objective: { type: String, default: "" },
      skillsPracticed: { type: String, default: "" },
      tasksCompleted: { type: String, default: "" },
      problemsHit: { type: String, default: "" },
      solutions: { type: String, default: "" },
      keyInsight: { type: String, default: "" },
      biggestMistake: { type: String, default: "" },
      tomorrowPriority: { type: String, default: "" },
    },
    accountability: {
      builtSomething: { type: String, default: "No" },
      avoidedRabbitHoles: { type: String, default: "No" },
      gitHubUpdated: { type: String, default: "No" },
      documentedDecisions: { type: String, default: "No" },
      tookUsefulNotes: { type: String, default: "No" },
      solvedARealProblem: { type: String, default: "No" },
      didDeepWork: { type: String, default: "No" },
      learnedSomethingApplicable: { type: String, default: "No" },
    },
    blocks: [BlockSchema],
    extraPages: [ExtraPageSchema],
    closed: { type: Boolean, default: false },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Journal", JournalSchema);
