import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterPatient from "./pages/RegisterPatient";
import PatientSearch from "./pages/PatientSearch";
import PatientProfile from "./pages/PatientProfile";
import Triage from "./pages/Triage";
import Referral from "./pages/Referral";
import FollowUps from "./pages/FollowUps";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Register Patient */}
        <Route
          path="/patients/register"
          element={
            <ProtectedRoute>
              <RegisterPatient />
            </ProtectedRoute>
          }
        />

        {/* Search Patient */}
        <Route
          path="/patients/search"
          element={
            <ProtectedRoute>
              <PatientSearch />
            </ProtectedRoute>
          }
        />

        {/* Patient Profile */}
        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
          }
        />

        {/* Patient Triage */}
        <Route
          path="/patients/:id/triage"
          element={
            <ProtectedRoute>
              <Triage />
            </ProtectedRoute>
          }
        />

        {/* Patient Referral */}
        <Route
          path="/patients/:id/referral"
          element={
            <ProtectedRoute>
              <Referral />
            </ProtectedRoute>
          }
        />

        {/* Patient Follow-up */}
        <Route
          path="/patients/:id/followup"
          element={
            <ProtectedRoute>
              <FollowUps />
            </ProtectedRoute>
          }
        />

        {/* All Follow-ups */}
        <Route
          path="/followups"
          element={
            <ProtectedRoute>
              <FollowUps />
            </ProtectedRoute>
          }
        />

        {/* Temporary Triage menu route */}
        <Route
          path="/triage"
          element={
            <ProtectedRoute>
              <PatientSearch />
            </ProtectedRoute>
          }
        />

        {/* Temporary Referral menu route */}
        <Route
          path="/referral"
          element={
            <ProtectedRoute>
              <PatientSearch />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;