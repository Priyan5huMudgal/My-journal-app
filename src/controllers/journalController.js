const Journal = require("../models/Journal");
const { nanoid } = require("nanoid");

const createDefaultBlocks = () => [];

exports.getCurrentJournal = async (req, res) => {
  try {
    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if journal entry exists for today
    let journal = await Journal.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    // If no entry for today, create a new day
    if (!journal) {
      const lastJournal = await Journal.findOne({ user: req.user._id }).sort({
        dayNumber: -1,
      });
      const nextDay = lastJournal ? lastJournal.dayNumber + 1 : 1;
      journal = await Journal.create({
        user: req.user._id,
        dayNumber: nextDay,
        date: new Date(),
        title: "My Journal",
        metrics: {
          hoursWorked: "",
          energyLevel: 5,
          focusQuality: 5,
          mood: "Reflective",
        },
        reflections: {},
        accountability: {},
        blocks: createDefaultBlocks(),
        extraPages: [],
        closed: false,
      });
    }
    res.json(journal);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error loading journal", error: error.message });
  }
};

exports.getJournalDays = async (req, res) => {
  try {
    const days = await Journal.find({ user: req.user._id })
      .select(
        "dayNumber date title closed blocks reflections accountability notes",
      )
      .sort({ dayNumber: 1 });

    // Filter out empty journals - keep only those with content
    const populatedDays = days.filter((day) => {
      // Check if has blocks
      if (day.blocks && day.blocks.length > 0) return true;

      // Check if has notes
      if (day.notes && day.notes.trim()) return true;

      // Check if has any reflection content
      const reflections = day.reflections || {};
      const hasReflectionContent = Object.values(reflections).some(
        (val) => val && String(val).trim(),
      );
      if (hasReflectionContent) return true;

      // Check if has any accountability content
      const accountability = day.accountability || {};
      const hasAccountabilityContent = Object.values(accountability).some(
        (val) => val && String(val).trim() && val !== "No",
      );
      if (hasAccountabilityContent) return true;

      return false;
    });

    res.json(populatedDays);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error loading journal days", error: error.message });
  }
};

exports.getJournalDay = async (req, res) => {
  try {
    const dayNumber = Number(req.params.dayNumber);
    const journal = await Journal.findOne({
      user: req.user._id,
      dayNumber,
    });
    if (!journal)
      return res.status(404).json({ message: "Journal day not found" });
    res.json(journal);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error loading journal day", error: error.message });
  }
};

exports.createNextDay = async (req, res) => {
  try {
    const lastJournal = await Journal.findOne({ user: req.user._id }).sort({
      dayNumber: -1,
    });
    const nextDay = lastJournal ? lastJournal.dayNumber + 1 : 1;
    const journal = await Journal.create({
      user: req.user._id,
      dayNumber: nextDay,
      title: "My Journal",
      metrics: {
        hoursWorked: "",
        energyLevel: 5,
        focusQuality: 5,
        mood: "Reflective",
      },
      reflections: {},
      blocks: createDefaultBlocks(),
      extraPages: [],
      closed: false,
    });
    res.status(201).json(journal);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating next day", error: error.message });
  }
};

exports.updateJournal = async (req, res) => {
  const {
    metrics,
    reflections,
    accountability,
    blocks,
    extraPages,
    title,
    notes,
    quote,
  } = req.body;
  try {
    const journal = await Journal.findOne({ user: req.user._id }).sort({
      dayNumber: -1,
    });
    if (!journal)
      return res.status(404).json({ message: "Journal day not found" });
    if (journal.closed)
      return res.status(403).json({ message: "Journal is closed" });

    journal.metrics = metrics || journal.metrics;
    journal.reflections = reflections || journal.reflections;
    journal.accountability = accountability || journal.accountability;
    journal.blocks = blocks || journal.blocks;
    journal.extraPages = extraPages || journal.extraPages;
    journal.title = title || journal.title;
    journal.notes = notes !== undefined ? notes : journal.notes;
    journal.quote = quote !== undefined ? quote : journal.quote;

    await journal.save();
    res.json(journal);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating journal", error: error.message });
  }
};

exports.closeJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({ user: req.user._id }).sort({
      dayNumber: -1,
    });
    if (!journal)
      return res.status(404).json({ message: "Journal day not found" });
    journal.closed = true;
    await journal.save();
    res.json({ message: "This day is now locked", journal });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error closing journal", error: error.message });
  }
};
