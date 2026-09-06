import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getPatient } from "../services/patientApi";

function PatientProfile() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);

  useEffect(() => {
    getPatient(id).then(setPatient);
  }, [id]);

  /* =========================
     PATIENT NOT FOUND
  ========================== */

  if (!patient) {
    return (
      <div className="min-h-screen bg-[#f5f9f8]">

        <Navbar />

        <div className="flex">

          <Sidebar />

          <main className="flex-1 flex items-center justify-center p-6">

            <div className="bg-white border border-[#dfeae7] rounded-2xl shadow-sm p-8 text-center max-w-md">

              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-3xl">
                🔍
              </div>

              <h2 className="text-xl font-bold text-[#123c3a] mt-5">
                Patient not found
              </h2>

              <p className="mt-2 text-slate-500 text-sm">
                No patient record was found for this Patient ID.
              </p>

              <Link
                to="/patients/search"
                className="inline-flex items-center justify-center mt-5 bg-[#0f766e] hover:bg-[#115e59] text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all"
              >
                ← Back to Search
              </Link>

            </div>

          </main>

        </div>

      </div>
    );
  }

  /* =========================
     SAFE DEFAULTS
  ========================== */

  const visits = patient.visits || [];
  const referrals = patient.referrals || [];
  const followup = patient.followup || {};

  return (
    <div className="min-h-screen bg-[#f5f9f8]">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">

          <div className="max-w-5xl mx-auto medipath-page">

            {/* =========================
                PROFILE HEADER
            ========================== */}

            <section className="mb-7">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#ccfbf1] border border-[#99f6e4] flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#0f766e] shadow-sm">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>

                  <div>

                    <div className="flex items-center gap-2 mb-1">

                      <span className="w-2 h-2 rounded-full bg-[#14b8a6]"></span>

                      <p className="text-[#0f766e] font-bold text-xs tracking-wider uppercase">
                        Patient Profile
                      </p>

                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-[#123c3a]">
                      {patient.name}
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                      Patient ID:{" "}
                      <span className="font-semibold text-[#0f766e]">
                        {patient.id}
                      </span>
                    </p>

                  </div>

                </div>

                <Link
                  to="/patients/search"
                  className="inline-flex items-center justify-center text-[#0f766e] hover:bg-[#ccfbf1] border border-[#dfeae7] px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                >
                  ← Back to Search
                </Link>

              </div>

            </section>


            {/* =========================
                BASIC INFORMATION
            ========================== */}

            <section className="bg-white border border-[#dfeae7] rounded-2xl shadow-sm overflow-hidden mb-6">

              <div className="px-6 sm:px-7 py-5 bg-[#f8fcfb] border-b border-[#e9f1ef]">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#ccfbf1] flex items-center justify-center text-xl">
                    👤
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-[#123c3a]">
                      Basic Information
                    </h2>

                    <p className="text-xs text-slate-500">
                      Patient's personal information
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-6 sm:p-7">

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">


                  {/* Name */}

                  <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Name
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {patient.name}
                    </p>

                  </div>


                  {/* Age */}

                  <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Age
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {patient.age} years
                    </p>

                  </div>


                  {/* Gender */}

                  <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Gender
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {patient.gender}
                    </p>

                  </div>


                  {/* Phone */}

                  <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Phone
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {patient.phone}
                    </p>

                  </div>


                  {/* Village */}

                  <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Village
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {patient.village}
                    </p>

                  </div>


                  {/* Patient ID */}

                  <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-xl p-4">

                    <p className="text-xs uppercase tracking-wide text-[#0f766e] font-semibold">
                      Patient ID
                    </p>

                    <p className="font-bold text-[#0f766e] mt-1">
                      {patient.id}
                    </p>

                  </div>

                </div>

              </div>

            </section>


            {/* =========================
                MEDICAL HISTORY
            ========================== */}

            <section className="bg-white border border-[#dfeae7] rounded-2xl shadow-sm p-6 sm:p-7 mb-6">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-10 h-10 rounded-xl bg-[#ccfbf1] flex items-center justify-center text-xl">
                  🩺
                </div>

                <div>

                  <h2 className="text-lg font-bold text-[#123c3a]">
                    Medical History
                  </h2>

                  <p className="text-xs text-slate-500">
                    Basic medical information
                  </p>

                </div>

              </div>

              <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">

                <p className="text-[#173330] leading-relaxed">
                  {patient.medicalHistory ||
                    "No medical history recorded."}
                </p>

              </div>

            </section>


            {/* =========================
                PREVIOUS VISITS
            ========================== */}

            <section className="bg-white border border-[#dfeae7] rounded-2xl shadow-sm p-6 sm:p-7 mb-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                  🩺
                </div>

                <div>

                  <h2 className="text-lg font-bold text-[#123c3a]">
                    Previous Visits
                  </h2>

                  <p className="text-xs text-slate-500">
                    Patient visit history
                  </p>

                </div>

              </div>


              {visits.length === 0 ? (

                <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-5 text-center">

                  <div className="text-2xl">
                    📋
                  </div>

                  <p className="text-slate-500 text-sm mt-2">
                    No previous visits recorded.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {visits.map((visit, index) => (

                    <div
                      key={index}
                      className="border-l-4 border-[#14b8a6] bg-[#f8fcfb] rounded-r-xl p-4"
                    >

                      <p className="font-bold text-[#123c3a]">
                        {visit.date || "Date not available"}
                      </p>

                      <p className="text-sm text-slate-700 mt-2">
                        <span className="font-semibold">
                          Reason:
                        </span>{" "}
                        {visit.reason || "Not recorded"}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        <span className="font-semibold">
                          Diagnosis:
                        </span>{" "}
                        {visit.diagnosis || "Not recorded"}
                      </p>

                    </div>

                  ))}

                </div>

              )}

            </section>


            {/* =========================
                PREVIOUS REFERRALS
            ========================== */}

            <section className="bg-white border border-[#dfeae7] rounded-2xl shadow-sm p-6 sm:p-7 mb-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
                  🏥
                </div>

                <div>

                  <h2 className="text-lg font-bold text-[#123c3a]">
                    Previous Referrals
                  </h2>

                  <p className="text-xs text-slate-500">
                    Referral history
                  </p>

                </div>

              </div>


              {referrals.length === 0 ? (

                <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-5 text-center">

                  <div className="text-2xl">
                    🏥
                  </div>

                  <p className="text-slate-500 text-sm mt-2">
                    No previous referrals.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {referrals.map((referral, index) => (

                    <div
                      key={index}
                      className="border border-[#e9f1ef] bg-[#f8fcfb] rounded-xl p-4"
                    >

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                        <div>

                          <p className="font-bold text-[#123c3a]">
                            {referral.facility ||
                              "Facility not recorded"}
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            {referral.date ||
                              "Date not available"}
                          </p>

                        </div>

                        <span className="inline-flex w-fit px-3 py-1.5 rounded-full bg-[#ccfbf1] text-[#0f766e] text-xs font-bold">
                          {referral.status || "Pending"}
                        </span>

                      </div>

                      <p className="text-sm text-slate-700 mt-3">
                        <span className="font-semibold">
                          Reason:
                        </span>{" "}
                        {referral.reason || "Not recorded"}
                      </p>

                    </div>

                  ))}

                </div>

              )}

            </section>


            {/* =========================
                FOLLOW-UP
            ========================== */}

            <section className="bg-white border border-[#dfeae7] rounded-2xl shadow-sm p-6 sm:p-7 mb-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                  📅
                </div>

                <div>

                  <h2 className="text-lg font-bold text-[#123c3a]">
                    Follow-up Status
                  </h2>

                  <p className="text-xs text-slate-500">
                    Current follow-up information
                  </p>

                </div>

              </div>


              <div className="flex flex-wrap gap-3">

                <span
                  className={`px-4 py-2 rounded-full font-bold text-sm ${
                    followup.status === "Pending"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {followup.status || "Not scheduled"}
                </span>


                {followup.dueDate && (

                  <span className="px-4 py-2 bg-slate-100 rounded-full text-slate-700 text-sm font-medium">
                    Due: {followup.dueDate}
                  </span>

                )}

              </div>

            </section>


            {/* =========================
                PATIENT ACTIONS
            ========================== */}

            <section>

              <div className="mb-4">

                <h2 className="text-xl font-bold text-[#123c3a]">
                  Patient Actions
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Choose an action to continue patient care.
                </p>

              </div>


              <div className="grid sm:grid-cols-3 gap-4">


                {/* Triage */}

                <Link
                  to={`/patients/${patient.id}/triage`}
                  className="group bg-[#0f766e] hover:bg-[#115e59] text-white text-center p-5 rounded-2xl font-bold shadow-sm hover:shadow-lg transition-all"
                >

                  <div className="text-2xl">
                    🩺
                  </div>

                  <div className="mt-2">
                    Start Triage
                  </div>

                  <div className="text-xs text-teal-100 mt-1">
                    Assess symptoms
                  </div>

                </Link>


                {/* Referral */}

                <Link
                  to={`/patients/${patient.id}/referral`}
                  className="group bg-orange-500 hover:bg-orange-600 text-white text-center p-5 rounded-2xl font-bold shadow-sm hover:shadow-lg transition-all"
                >

                  <div className="text-2xl">
                    🏥
                  </div>

                  <div className="mt-2">
                    Create Referral
                  </div>

                  <div className="text-xs text-orange-100 mt-1">
                    Refer to facility
                  </div>

                </Link>


                {/* Follow-up */}

                <Link
                  to={`/patients/${patient.id}/followup`}
                  className="group bg-green-600 hover:bg-green-700 text-white text-center p-5 rounded-2xl font-bold shadow-sm hover:shadow-lg transition-all"
                >

                  <div className="text-2xl">
                    📅
                  </div>

                  <div className="mt-2">
                    Follow-up
                  </div>

                  <div className="text-xs text-green-100 mt-1">
                    Manage follow-up
                  </div>

                </Link>

              </div>

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}

export default PatientProfile;