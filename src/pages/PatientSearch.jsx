import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { searchPatient } from "../services/patientApi";

function PatientSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    setError("");
    setPatient(null);

    const value = searchValue.trim();

    if (!value) {
      setError("Please enter Patient ID or Phone Number.");
      return;
    }

    try {
      setLoading(true);

      const result = await searchPatient(value);

      if (result) {
        setPatient(result);
      } else {
        setError("Patient not found.");
      }
    } catch (err) {
      console.error("Patient search error:", err);

      if (err.response?.status === 404) {
        setError("Patient not found.");
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          "Unable to search patient. Please make sure the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const patientName =
    patient?.name ||
    patient?.user?.name ||
    `Patient #${patient?.id ?? ""}`;

  const patientAge = (() => {
    if (patient?.age !== undefined && patient?.age !== null) {
      return patient.age;
    }

    if (patient?.date_of_birth) {
      const birthDate = new Date(patient.date_of_birth);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();

      const monthDifference =
        today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 &&
          today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    }

    return "Not available";
  })();

  const patientPhone = patient?.phone || "Not available";

  const patientGender = patient?.gender || "Not available";

  const patientAddress =
    patient?.address ||
    patient?.village ||
    "Not available";

  const patientMedicalHistory =
    patient?.medicalHistory ||
    "No medical history recorded.";

  return (
    <div className="min-h-screen bg-[#f5f9f8]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-5xl mx-auto medipath-page">

            {/* PAGE HEADER */}
            <section className="mb-7">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#14b8a6]"></span>

                <p className="text-[#0f766e] font-bold text-xs tracking-wider uppercase">
                  Patient Management
                </p>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#123c3a] tracking-tight">
                Search Patient
              </h1>

              <p className="text-slate-500 mt-2">
                Find an existing patient using their Patient ID or phone
                number.
              </p>
            </section>

            {/* SEARCH CARD */}
            <section className="bg-white border border-[#dfeae7] rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 sm:px-8 py-6 bg-[#f8fcfb] border-b border-[#e9f1ef]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#ccfbf1] border border-[#99f6e4] flex items-center justify-center text-2xl">
                    🔍
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#123c3a]">
                      Find Patient Record
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Enter a Patient ID or registered phone number.
                    </p>
                  </div>
                </div>
              </div>

              {/* SEARCH FORM */}
              <div className="p-6 sm:p-8">
                <form onSubmit={handleSearch}>
                  <label className="block text-sm font-semibold text-[#173330] mb-2">
                    Patient ID / Phone Number
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Example: 1 or 9000000010"
                      className="flex-1 border border-[#cddbd8] rounded-xl px-4 py-3 bg-white text-[#173330] placeholder:text-slate-400 transition-all focus:border-[#14b8a6] focus:ring-4 focus:ring-[#ccfbf1]"
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 bg-[#0f766e] hover:bg-[#115e59] disabled:opacity-60 disabled:cursor-not-allowed text-white px-7 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all"
                    >
                      {loading ? "Searching..." : "🔍 Search"}
                    </button>
                  </div>
                </form>

                {/* ERROR */}
                {error && (
                  <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                        ⚠️
                      </div>

                      <p className="text-red-700 font-semibold text-sm">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* PATIENT RESULT */}
            {patient && (
              <section className="mt-6 bg-white border border-[#dfeae7] rounded-2xl shadow-sm overflow-hidden">

                {/* RESULT HEADER */}
                <div className="px-6 sm:px-8 py-5 bg-[#f0fdfa] border-b border-[#ccfbf1]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#ccfbf1] border-2 border-[#99f6e4] flex items-center justify-center text-[#0f766e] text-xl font-bold">
                      {patientName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-bold text-[#123c3a]">
                          Patient Found
                        </h2>

                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                          ✓ Found
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 mt-1">
                        Patient record successfully retrieved from
                        MediPath API.
                      </p>
                    </div>
                  </div>
                </div>

                {/* PATIENT DETAILS */}
                <div className="p-6 sm:p-8">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Patient ID */}
                    <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide text-[#0f766e] font-semibold">
                        Patient ID
                      </p>

                      <p className="font-bold text-[#0f766e] mt-1">
                        {patient.id}
                      </p>
                    </div>

                    {/* User ID */}
                    <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        User ID
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {patient.user_id ?? "Not available"}
                      </p>
                    </div>

                    {/* Name */}
                    <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Name
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {patientName}
                      </p>
                    </div>

                    {/* Age */}
                    <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Age
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {patientAge === "Not available"
                          ? patientAge
                          : `${patientAge} years`}
                      </p>
                    </div>

                    {/* Gender */}
                    <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Gender
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {patientGender}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Phone
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {patientPhone}
                      </p>
                    </div>

                    {/* Address */}
                    <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Address
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {patientAddress}
                      </p>
                    </div>

                    {/* Facility */}
                    <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Facility ID
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {patient.facility_id ?? "Not available"}
                      </p>
                    </div>

                    {/* Date of Birth */}
                    <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Date of Birth
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {patient.date_of_birth || "Not available"}
                      </p>
                    </div>
                  </div>

                  {/* MEDICAL HISTORY */}
                  <div className="mt-5 bg-[#f0fdfa] border border-[#ccfbf1] rounded-xl p-5">
                    <p className="text-xs uppercase tracking-wide text-[#0f766e] font-bold">
                      Basic Medical History
                    </p>

                    <p className="mt-2 font-medium text-[#173330]">
                      {patientMedicalHistory}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-6 pt-6 border-t border-[#e9f1ef] flex flex-col sm:flex-row gap-3">

                    {/* View Profile */}
                    <Link
                      to={`/patients/${patient.id}`}
                      className="inline-flex items-center justify-center gap-2 bg-white border border-[#0f766e] text-[#0f766e] hover:bg-[#f0fdfa] px-6 py-3 rounded-xl font-bold transition-all"
                    >
                      View Full Patient Profile →
                    </Link>

                    {/* Start Triage */}
                    <Link
                      to={`/patients/${patient.id}/triage`}
                      className="inline-flex items-center justify-center gap-2 bg-[#0f766e] hover:bg-[#115e59] text-white px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all"
                    >
                      🩺 Start Triage
                    </Link>

                  </div>
                </div>
              </section>
            )}

            {/* SEARCH HELP */}
            {!patient && !error && (
              <section className="mt-6 bg-[#f0fdfa] border border-[#99f6e4] rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 bg-white rounded-xl border border-[#ccfbf1] flex items-center justify-center text-xl">
                    💡
                  </div>

                  <div>
                    <h3 className="font-bold text-[#123c3a]">
                      Search Tip
                    </h3>

                    <p className="text-sm text-[#0f766e] mt-1 leading-relaxed">
                      You can search using the backend Patient ID,
                      such as 1, or the patient's registered phone
                      number, such as 9000000010.
                    </p>
                  </div>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default PatientSearch;