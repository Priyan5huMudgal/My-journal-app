import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const JournalDaysPage = () => {
  const { logout } = useAuth();
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [todayDate, setTodayDate] = useState(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  );
  const navigate = useNavigate();

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  useEffect(() => {
    fetchDays();
  }, []);

  const fetchDays = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/journal/days");
      setDays(response.data || []);
    } catch (error) {
      console.error(error);
      setError("");
      setDays([]);
    }
    setLoading(false);
  };

  const openDay = (dayNumber) => {
    console.log("Opening day:", dayNumber);
    navigate(`/journal/${dayNumber}`);
  };

  const openToday = async () => {
    try {
      const response = await api.get("/journal/current");
      const dayNumber = response.data?.dayNumber;
      console.log("Opening today's day:", dayNumber);
      if (dayNumber) {
        navigate(`/journal/${dayNumber}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="journal-index-shell">
      <article className="journal-index-page">
        <header className="journal-index-header">
          <h1 className="journal-title">My Journal</h1>
          <div className="journal-divider"></div>
        </header>

        <section className="journal-index-body">
          {loading ? (
            <p className="journal-status">Loading your journal...</p>
          ) : (
            <div className="journal-entries-list">
              {days &&
                days.length > 0 &&
                days.map((entry) => (
                  <div key={entry.dayNumber} className="journal-entry-row">
                    <div className="entry-date-box">
                      <span>{formatDate(entry.date)}</span>
                    </div>
                    <button
                      className="entry-open-btn"
                      type="button"
                      onClick={() => openDay(entry.dayNumber)}
                    >
                      Open
                    </button>
                  </div>
                ))}

              {!days.some(entry => formatDate(entry.date) === todayDate) && (
                <div className="journal-entry-row today-entry">
                  <div className="entry-date-box">
                    <span>{todayDate}</span>
                  </div>
                  <button
                    className="entry-open-btn"
                    type="button"
                    onClick={openToday}
                  >
                    Open
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        <footer className="journal-index-footer">
          <button
            className="ink-button journal-footer-btn"
            type="button"
            onClick={() => navigate("/info")}
          >
            Profile
          </button>
          <button
            className="ink-button journal-footer-btn"
            type="button"
            onClick={logout}
          >
            Close
          </button>
        </footer>
      </article>
    </main>
  );
};

export default JournalDaysPage;
