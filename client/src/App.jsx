import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CoverPage from "./pages/CoverPage";
import RegisterPage from "./pages/RegisterPage";
import JournalPage from "./pages/JournalPage";
import JournalDaysPage from "./pages/JournalDaysPage";
import InfoPage from "./pages/InfoPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <JournalDaysPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journal/:dayNumber"
            element={
              <ProtectedRoute>
                <JournalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/info"
            element={
              <ProtectedRoute>
                <InfoPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
