import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getPatients } from "../services/patientApi";
import { getFollowUps } from "../services/followupApi";
import { getMedicalRecords } from "../services/medicalRecordApi";

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [patientsData, followUpsData, medicalRecordsData] =
        await Promise.all([
          getPatients(),
          getFollowUps(),
          getMedicalRecords(),
        ]);

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setFollowUps(Array.isArray(followUpsData) ? followUpsData : []);
      setMedicalRecords(
        Array.isArray(medicalRecordsData) ? medicalRecordsData : []
      );
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // FOLLOW-UP COUNTS
  // -----------------------------------

  const pendingFollowups = followUps.filter((followUp) => {
    const status = String(followUp.status || "").toLowerCase();

    return status === "pending" || status === "scheduled";
  }).length;

  const completedFollowups = followUps.filter((followUp) => {
    const status = String(followUp.status || "").toLowerCase();

    return status === "completed";
  }).length;

  // -----------------------------------
  // RECORDED VISITS
  // -----------------------------------

  // Each medical record represents a recorded patient visit.
  const totalVisits = medicalRecords.length;

  // -----------------------------------
  // PERCENTAGES
  // -----------------------------------

  const pendingPercentage = patients.length
    ? Math.round((pendingFollowups / patients.length) * 100)
    : 0;

  const completedPercentage = patients.length
    ? Math.round((completedFollowups / patients.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#f5f9f8]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto medipath-page">

            {/* =========================
                WELCOME
            ========================== */}

            <section className="mb-8">
              <div className="relative overflow-hidden bg-gradient-to-r from-[#123c3a] to-[#0f766e] rounded-2xl p-6 sm:p-8 text-white shadow-lg">

                <div className="absolute -right-12 -top-16 w-48 h-48 rounded-full bg-white/5"></div>

                <div className="absolute right-20 -bottom-20 w-56 h-56 rounded-full bg-teal-300/10"></div>

                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#5eead4]"></span>

                      <p className="text-teal-100 text-xs sm:text-sm font-bold tracking-wider">
                        HEALTH WORKER PORTAL
                      </p>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                      Good morning 👋
                    </h1>

                    <p className="text-teal-100 mt-2 text-sm sm:text-base">
                      Manage patients, triage cases and follow-ups
                      from one place.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/patients/register"
                      className="bg-white hover:bg-teal-50 text-[#0f766e] px-4 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all"
                    >
                      + Register Patient
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* =========================
                ERROR
            ========================== */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* =========================
                STATISTICS
            ========================== */}

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

              {/* Total Patients */}

              <div className="medipath-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Patients
                    </p>

                    <p className="text-3xl font-bold text-[#123c3a] mt-2">
                      {loading ? "..." : patients.length}
                    </p>

                    <p className="text-xs text-green-600 mt-2 font-semibold">
                      ✓ Registered patients
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#ccfbf1] flex items-center justify-center text-2xl">
                    👥
                  </div>
                </div>
              </div>

              {/* Pending Follow-ups */}

              <div className="medipath-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Pending Follow-ups
                    </p>

                    <p className="text-3xl font-bold text-[#123c3a] mt-2">
                      {loading ? "..." : pendingFollowups}
                    </p>

                    <p className="text-xs text-orange-600 mt-2 font-semibold">
                      ⚠ Needs attention
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">
                    📅
                  </div>
                </div>
              </div>

              {/* Recorded Visits */}

              <div className="medipath-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Recorded Visits
                    </p>

                    <p className="text-3xl font-bold text-[#123c3a] mt-2">
                      {loading ? "..." : totalVisits}
                    </p>

                    <p className="text-xs text-[#0f766e] mt-2 font-semibold">
                      🩺 Patient visits
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-2xl">
                    🩺
                  </div>
                </div>
              </div>

              {/* Completed Follow-ups */}

              <div className="medipath-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Completed Follow-ups
                    </p>

                    <p className="text-3xl font-bold text-[#123c3a] mt-2">
                      {loading ? "..." : completedFollowups}
                    </p>

                    <p className="text-xs text-green-600 mt-2 font-semibold">
                      ✓ Completed
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
                    ✅
                  </div>
                </div>
              </div>
            </section>

            {/* =========================
                QUICK ACTIONS
            ========================== */}

            <section className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-[#123c3a]">
                  Quick Actions
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Common tasks for today's work
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                {/* Register */}

                <Link
                  to="/patients/register"
                  className="group bg-[#0f766e] hover:bg-[#115e59] text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    ➕
                  </div>

                  <h3 className="text-xl font-bold mt-5">
                    Register Patient
                  </h3>

                  <p className="text-teal-100 text-sm mt-2 leading-relaxed">
                    Create a new patient record with basic
                    medical information.
                  </p>

                  <div className="mt-5 text-sm font-bold">
                    Register now →
                  </div>
                </Link>

                {/* Search */}

                <Link
                  to="/patients/search"
                  className="group bg-white border border-[#dfeae7] hover:border-[#5eead4] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-[#ccfbf1] rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    🔍
                  </div>

                  <h3 className="text-xl font-bold mt-5 text-[#123c3a]">
                    Search Patient
                  </h3>

                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    Find a patient using their Patient ID
                    or phone number.
                  </p>

                  <div className="mt-5 text-sm font-bold text-[#0f766e]">
                    Search records →
                  </div>
                </Link>

                {/* Follow-ups */}

                <Link
                  to="/followups"
                  className="group bg-white border border-[#dfeae7] hover:border-green-300 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    📅
                  </div>

                  <h3 className="text-xl font-bold mt-5 text-[#123c3a]">
                    Follow-ups
                  </h3>

                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    Review patients whose follow-up is
                    pending.
                  </p>

                  <div className="mt-5 text-sm font-bold text-green-600">
                    View follow-ups →
                  </div>
                </Link>
              </div>
            </section>

            {/* =========================
                RECENT PATIENTS
            ========================== */}

            <section className="grid xl:grid-cols-3 gap-6">

              <div className="xl:col-span-2 bg-white border border-[#dfeae7] rounded-2xl shadow-sm overflow-hidden">

                <div className="p-6 border-b border-[#e9f1ef] flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#123c3a]">
                      Recent Patients
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Recently available patient records
                    </p>
                  </div>

                  <Link
                    to="/patients/search"
                    className="text-[#0f766e] hover:text-[#115e59] text-sm font-bold"
                  >
                    View all →
                  </Link>
                </div>

                <div className="p-6">
                  {patients.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 mx-auto rounded-full bg-[#f0fdfa] flex items-center justify-center text-3xl">
                        👥
                      </div>

                      <p className="font-semibold text-slate-700 mt-4">
                        No patients yet
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        Register a patient to get started.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {patients
                        .slice()
                        .reverse()
                        .slice(0, 5)
                        .map((patient) => (
                          <div
                            key={patient.id}
                            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[#f8fcfb] hover:bg-[#f0fdfa] border border-transparent hover:border-[#ccfbf1] transition-all duration-200"
                          >
                            <div className="flex items-center gap-4 min-w-0">

                              <div className="w-11 h-11 shrink-0 rounded-full bg-[#ccfbf1] border border-[#99f6e4] text-[#0f766e] flex items-center justify-center font-bold">
                                {patient.name
                                  ? patient.name.charAt(0).toUpperCase()
                                  : "P"}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 truncate">
                                  {patient.name}
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  {patient.id} •{" "}
                                  {patient.address ||
                                    "Address not available"}
                                </p>
                              </div>
                            </div>

                            <Link
                              to={`/patients/${patient.id}`}
                              className="shrink-0 text-[#0f766e] hover:bg-[#ccfbf1] px-3 py-2 rounded-lg text-sm font-bold transition"
                            >
                              View
                            </Link>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* =========================
                  FOLLOW-UP OVERVIEW
              ========================== */}

              <div className="bg-[#123c3a] text-white rounded-2xl p-6 shadow-lg">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-300 text-sm font-medium">
                      Follow-up Overview
                    </p>

                    <h2 className="text-xl font-bold mt-1">
                      Patient Care
                    </h2>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                    ❤️
                  </div>
                </div>

                {/* Pending */}

                <div className="mt-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-teal-100">
                      Pending
                    </span>

                    <span className="font-bold">
                      {pendingFollowups}
                    </span>
                  </div>

                  <div className="w-full bg-[#0b2927] rounded-full h-2.5">
                    <div
                      className="bg-orange-400 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(pendingPercentage, 100)}%`,
                      }}
                    ></div>
                  </div>

                  <p className="text-xs text-teal-300 mt-2">
                    {pendingPercentage}% of patients
                  </p>
                </div>

                {/* Completed */}

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-teal-100">
                      Completed
                    </span>

                    <span className="font-bold">
                      {completedFollowups}
                    </span>
                  </div>

                  <div className="w-full bg-[#0b2927] rounded-full h-2.5">
                    <div
                      className="bg-green-400 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(completedPercentage, 100)}%`,
                      }}
                    ></div>
                  </div>

                  <p className="text-xs text-teal-300 mt-2">
                    {completedPercentage}% of patients
                  </p>
                </div>

                <Link
                  to="/followups"
                  className="block text-center mt-8 bg-white text-[#123c3a] hover:bg-teal-50 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  Manage Follow-ups →
                </Link>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;