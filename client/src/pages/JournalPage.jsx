import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const fieldTemplates = {
  text: {
    type: "text",
    title: "Custom Text Field",
    content: "",
  },
  checklist: {
    type: "checklist",
    title: "To-Do List",
    items: [{ id: Date.now().toString(), text: "New item", checked: false }],
  },
  quote: {
    type: "quote",
    title: "Favorite Quote",
    content: "",
  },
  gratitude: {
    type: "text",
    title: "Things I'm Grateful For",
    content: "",
  },
  brainDump: {
    type: "text",
    title: "Brain Dump",
    content: "",
  },
  blockers: {
    type: "text",
    title: "Blockers & Obstacles",
    content: "",
  }
};

const JournalPage = () => {
  const { dayNumber } = useParams();
  const { logout } = useAuth();
  const [journal, setJournal] = useState(null);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!dayNumber) {
      navigate("/journal");
      return;
    }
    console.log("Loading journal for dayNumber:", dayNumber);
    loadJournal(dayNumber);
  }, [dayNumber]);

  const normalizeJournal = (data) => ({
    ...data,
    notes: data.notes || "",
    quote: data.quote || "",
    reflections: data.reflections || {},
    blocks: Array.isArray(data.blocks) ? data.blocks : [],
    title: data.title || "My Journal",
    date: data.date || new Date().toISOString(),
    dayNumber: data.dayNumber || Number(dayNumber) || 1,
    closed: data.closed || false,
  });

  const updateReflection = (field, value) => {
    setJournal((current) => ({
      ...current,
      reflections: {
        ...(current.reflections || {}),
        [field]: value
      }
    }));
  };

  const loadJournal = async (dayNum) => {
    setError("");
    try {
      console.log(`Fetching /journal/day/${dayNum}`);
      const response = await api.get(`/journal/day/${dayNum}`);
      console.log("Loaded journal:", response.data);
      setJournal(normalizeJournal(response.data));
    } catch (err) {
      console.error(err);
      setError("Unable to load this journal day.");
    }
  };

  const saveJournal = async () => {
    if (!journal) return;
    setWorking(true);
    try {
      await api.put("/journal/update", journal);
      setMessage("Journal saved.");
    } catch (err) {
      console.error(err);
      setMessage("Unable to save your journal today.");
    }
    setWorking(false);
  };

  const closeDay = async () => {
    if (!journal) return;
    setWorking(true);
    try {
      await api.put("/journal/close");
      setMessage("Day closed and locked.");
      navigate("/journal");
    } catch (err) {
      console.error(err);
      setMessage("Unable to close this day.");
    }
    setWorking(false);
  };

  const updateNotes = (value) => {
    setJournal((current) => ({ ...current, notes: value }));
  };

  const updateQuote = (value) => {
    setJournal((current) => ({ ...current, quote: value }));
  };

  const addBlock = () => {
    if (!journal) return;
    setJournal((current) => ({
      ...current,
      blocks: [...current.blocks, { type: "text", title: "", content: "", id: Date.now().toString() }],
    }));
  };

  const updateBlock = (id, field, value) => {
    setJournal((current) => ({
      ...current,
      blocks: current.blocks.map((block) =>
        block.id === id ? { ...block, [field]: value } : block,
      ),
    }));
  };

  const removeBlock = (id) => {
    setJournal((current) => ({
      ...current,
      blocks: current.blocks.filter((block) => block.id !== id),
    }));
  };

  const toggleChecklistItem = (blockId, itemId) => {
    setJournal((current) => ({
      ...current,
      blocks: current.blocks.map((block) => {
        if (block.id !== blockId) return block;
        return {
          ...block,
          items: (block.items || []).map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item,
          ),
        };
      }),
    }));
  };

  const updateChecklistItemText = (blockId, itemId, text) => {
    setJournal((current) => ({
      ...current,
      blocks: current.blocks.map((block) => {
        if (block.id !== blockId) return block;
        return {
          ...block,
          items: (block.items || []).map((item) =>
            item.id === itemId ? { ...item, text } : item,
          ),
        };
      }),
    }));
  };

  const addChecklistItem = (blockId) => {
    setJournal((current) => ({
      ...current,
      blocks: current.blocks.map((block) => {
        if (block.id !== blockId) return block;
        return {
          ...block,
          items: [
            ...(block.items || []),
            { id: Date.now().toString(), text: "New item", checked: false },
          ],
        };
      }),
    }));
  };

  if (!journal) {
    return (
      <div className="page-shell">{error || "Loading journal entry..."}</div>
    );
  }

  return (
    <main className="journal-writing-shell">
      <article className="journal-writing-page">
        <header className="journal-entry-header">
          <div className="header-box">
            <p className="journal-entry-date">
              {new Date(journal.date).toDateString()}
            </p>
            <textarea
              value={journal.quote}
              onChange={(e) => updateQuote(e.target.value)}
              placeholder="Your quote of the day..."
              disabled={journal.closed}
              className="header-quote"
            />
          </div>
        </header>

        <section className="journal-notes-section">
          <label className="journal-notes-label">Journal Notes</label>
          <textarea
            value={journal.notes}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="Write your journal entry for today..."
            disabled={journal.closed}
            ref={(el) => {
              if (el) {
                el.style.height = "46px";
                el.style.height = `${el.scrollHeight}px`;
              }
            }}
            onInput={(e) => {
              e.target.style.height = "46px";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
        </section>

        <section className="journal-blocks-container" style={{ marginTop: '12px' }}>
          {[
            { id: "skillsPracticed", label: "Skills Practiced" },
            { id: "tasksCompleted", label: "Tasks Completed" },
            { id: "problemsHit", label: "Problems I Hit" },
            { id: "solutions", label: "How I Solved Them" },
            { id: "keyInsight", label: "Key Insight Discovered Today" },
            { id: "biggestMistake", label: "Biggest Mistake or Wasted Time Today" },
            { id: "tomorrowPriority", label: "Tomorrow's #1 Priority" }
          ].map((field) => (
            <div key={field.id} className="custom-block">
              <div className="block-heading">
                <div style={{ flex: 1, fontFamily: '"Playfair Display", serif', fontSize: '1.05rem', color: 'var(--vintage-brown)', padding: '0 8px' }}>
                  {field.label}
                </div>
              </div>
              <textarea
                value={journal.reflections?.[field.id] || ""}
                onChange={(e) => updateReflection(field.id, e.target.value)}
                disabled={journal.closed}
                placeholder={`...`}
                ref={(el) => {
                  if (el) {
                    el.style.height = "46px";
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
                onInput={(e) => {
                  e.target.style.height = "46px";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
            </div>
          ))}
        </section>

        <section className="journal-blocks-container">
          <AnimatePresence>
            {journal.blocks.map((block) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="custom-block"
              >
                <div className="block-heading">
                  <input
                    value={block.title}
                    onChange={(e) =>
                      updateBlock(block.id, "title", e.target.value)
                    }
                    placeholder="Field title..."
                    disabled={journal.closed}
                  />
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeBlock(block.id)}
                    disabled={journal.closed}
                  >
                    ×
                  </button>
                </div>
                {block.type === "text" && (
                  <textarea
                    value={block.content}
                    onChange={(e) =>
                      updateBlock(block.id, "content", e.target.value)
                    }
                    disabled={journal.closed}
                    placeholder="Type your custom field here..."
                    ref={(el) => {
                      if (el) {
                        el.style.height = "46px";
                        el.style.height = `${el.scrollHeight}px`;
                      }
                    }}
                    onInput={(e) => {
                      e.target.style.height = "46px";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                )}
                {block.type === "quote" && (
                  <textarea
                    value={block.content}
                    onChange={(e) =>
                      updateBlock(block.id, "content", e.target.value)
                    }
                    disabled={journal.closed}
                    placeholder="Write a quote or reflection..."
                    className="quote-block"
                    ref={(el) => {
                      if (el) {
                        el.style.height = "46px";
                        el.style.height = `${el.scrollHeight}px`;
                      }
                    }}
                    onInput={(e) => {
                      e.target.style.height = "46px";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                )}
                {block.type === "checklist" && (
                  <ul className="checklist">
                    {(block.items || []).map((item) => (
                      <li key={item.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() =>
                              toggleChecklistItem(block.id, item.id)
                            }
                            disabled={journal.closed}
                          />
                          <input
                            className="check-item"
                            value={item.text}
                            onChange={(e) =>
                              updateChecklistItemText(
                                block.id,
                                item.id,
                                e.target.value,
                              )
                            }
                            disabled={journal.closed}
                          />
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        <div style={{ position: 'relative', width: '100%', marginTop: '16px' }}>
          <button
            className="add-field-btn"
            type="button"
            onClick={addBlock}
            disabled={journal.closed}
          >
            + Add Field
          </button>
        </div>

        <section className="journal-entry-actions">
          <button
            className="ink-button journal-back-btn"
            type="button"
            onClick={() => navigate("/journal")}
          >
            Back
          </button>

          <button
            className="ink-button journal-back-btn"
            type="button"
            onClick={saveJournal}
            disabled={working || journal.closed}
          >
            Save
          </button>
          <button
            className="ink-button journal-back-btn"
            type="button"
            onClick={closeDay}
            disabled={working || journal.closed}
          >
            Close Day
          </button>
        </section>

        {message && <p className="journal-status">{message}</p>}
        {error && <p className="form-error">{error}</p>}
      </article>
    </main>
  );
};

export default JournalPage;
