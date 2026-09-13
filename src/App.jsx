import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterPatient from "./pages/RegisterPatient";
import PatientSearch from "./pages/PatientSearch";
import PatientProfile from "./pages/PatientProfile";
import Referral from "./pages/Referral";
import FollowUps from "./pages/FollowUps";
import Appointments from "./pages/Appointments";
import Triage from "./pages/Triage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            LOGIN
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =========================
            DASHBOARD
        ========================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
            REGISTER PATIENT
        ========================== */}

        <Route
          path="/patients/register"
          element={
            <ProtectedRoute>
              <RegisterPatient />
            </ProtectedRoute>
          }
        />

        {/* =========================
            SEARCH PATIENT
        ========================== */}

        <Route
          path="/patients/search"
          element={
            <ProtectedRoute>
              <PatientSearch />
            </ProtectedRoute>
          }
        />

        {/* =========================
            PATIENT PROFILE
        ========================== */}

        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
          }
        />

        {/* =========================
            TRIAGE MENU
            Search for patient first
        ========================== */}

        <Route
          path="/triage"
          element={
            <ProtectedRoute>
              <PatientSearch />
            </ProtectedRoute>
          }
        />

        {/* =========================
            PATIENT TRIAGE
        ========================== */}

        <Route
          path="/patients/:id/triage"
          element={
            <ProtectedRoute>
              <Triage />
            </ProtectedRoute>
          }
        />

        {/* =========================
            PATIENT REFERRAL
        ========================== */}

        <Route
          path="/patients/:id/referral"
          element={
            <ProtectedRoute>
              <Referral />
            </ProtectedRoute>
          }
        />

        {/* =========================
            PATIENT FOLLOW-UP
        ========================== */}

        <Route
          path="/patients/:id/followup"
          element={
            <ProtectedRoute>
              <FollowUps />
            </ProtectedRoute>
          }
        />

        {/* =========================
            ALL FOLLOW-UPS
        ========================== */}

        <Route
          path="/followups"
          element={
            <ProtectedRoute>
              <FollowUps />
            </ProtectedRoute>
          }
        />

        {/* =========================
            APPOINTMENTS
        ========================== */}

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />

        {/* =========================
            REFERRAL MENU ENTRY
            Search for patient first
        ========================== */}

        <Route
          path="/referral"
          element={
            <ProtectedRoute>
              <PatientSearch />
            </ProtectedRoute>
          }
        />

        {/* =========================
            DEFAULT
        ========================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;