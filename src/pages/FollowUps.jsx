import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
  getFollowUps,
  createFollowUp,
  updateFollowUpTrackingStage,
} from "../services/followupApi";

import { getPatients, getPatient } from "../services/patientApi";

function FollowUps() {
  const { id } = useParams();

  const [followUps, setFollowUps] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    patientId: id || "",
    followUpDate: "",
    notes: "",
  });

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // Get all follow-ups
      const followUpData = await getFollowUps();
      setFollowUps(Array.isArray(followUpData) ? followUpData : []);

      // Patient-specific page
      if (id) {
        const patientData = await getPatient(id);

        setPatient(patientData || null);

        setForm((previous) => ({
          ...previous,
          patientId: id,
        }));
      } else {
        // All follow-ups page
        const patientData = await getPatients();

        setPatients(Array.isArray(patientData) ? patientData : []);
      }
    } catch (err) {
      console.error("Follow-up loading error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load follow-ups. Make sure the FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE FOLLOW-UP
  // =====================================================

  const handleCreateFollowUp = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.patientId) {
      setError("Please select a patient.");
      return;
    }

    if (!form.followUpDate) {
      setError("Please select a follow-up date and time.");
      return;
    }

    const doctorId = localStorage.getItem("medipath_user_id");

    if (!doctorId) {
      setError("Doctor login information was not found.");
      return;
    }

    try {
      setCreating(true);

      const newFollowUp = await createFollowUp({
        patientId: form.patientId,
        doctorId: doctorId,
        followUpDate: form.followUpDate,
        status: "Scheduled",
        notes: form.notes,
      });

      // Add newly created follow-up immediately
      setFollowUps((previous) => [
        ...previous,
        newFollowUp,
      ]);

      setSuccess("Follow-up created successfully! ✅");

      // Clear form
      setForm((previous) => ({
        ...previous,
        followUpDate: "",
        notes: "",
      }));

      // Reload latest backend data
      await loadData();
    } catch (err) {
      console.error("Create follow-up error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to create follow-up."
      );
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // COMPLETE FOLLOW-UP
  // =====================================================

  const handleCompleteFollowUp = async (followUpId) => {
    setError("");
    setSuccess("");

    try {
      setUpdatingId(followUpId);

      /*
       * IMPORTANT:
       *
       * Backend allowed stages are:
       *
       * Referral Created
       * Referral Accepted
       * Appointment Scheduled
       * Consultation
       * Follow-up
       * Treatment Completed
       *
       * Therefore we MUST send exactly:
       *
       * "Treatment Completed"
       */

      const updatedFollowUp =
        await updateFollowUpTrackingStage(
          followUpId,
          "Treatment Completed"
        );

      // Update the specific follow-up in the UI
      setFollowUps((previous) =>
        previous.map((item) =>
          String(item.id) === String(followUpId)
            ? {
                ...item,
                ...(updatedFollowUp || {}),
                tracking_stage: "Treatment Completed",
                status:
                  updatedFollowUp?.status ||
                  item.status,
              }
            : item
        )
      );

      setSuccess(
        "Follow-up marked as Treatment Completed successfully! ✅"
      );

      // Get latest data from backend
      await loadData();
    } catch (err) {
      console.error(
        "Complete follow-up error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to complete follow-up."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f9f8]">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">
                ⏳
              </div>

              <p className="text-slate-500 font-medium">
                Loading follow-ups...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =====================================================
  // PATIENT NOT FOUND
  // =====================================================

  if (id && !patient) {
    return (
      <div className="min-h-screen bg-[#f5f9f8]">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-[#dfeae7] p-8 text-center">
              <h2 className="text-xl font-bold text-[#123c3a]">
                Patient not found
              </h2>

              <Link
                to="/followups"
                className="inline-block mt-5 medipath-primary-button"
              >
                ← Back to Follow-ups
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =====================================================
  // PATIENT-SPECIFIC FOLLOW-UP PAGE
  // =====================================================

  if (id && patient) {
    const patientFollowUps = followUps.filter(
      (item) =>
        String(item.patient_id) ===
        String(patient.id)
    );

    return (
      <div className="min-h-screen bg-[#f5f9f8]">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto medipath-page">

              {/* Back */}
              <Link
                to={`/patients/${patient.id}`}
                className="text-[#0f766e] font-semibold"
              >
                ← Back to Patient Profile
              </Link>

              {/* Header */}
              <div className="mt-4 mb-6">
                <p className="text-sm font-semibold text-[#0f766e]">
                  Patient Care
                </p>

                <h1 className="text-3xl font-bold text-[#123c3a] mt-1">
                  📅 Follow-up
                </h1>

                <p className="text-slate-500 mt-1">
                  Schedule and view patient follow-up information.
                </p>
              </div>

              {/* Success */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
                  {success}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
                  {error}
                </div>
              )}

              {/* =====================================================
                  PATIENT INFORMATION
              ===================================================== */}

              <section className="medipath-card p-6 mb-6">
                <h2 className="text-xl font-bold text-[#123c3a] mb-5">
                  Patient Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-5">

                  <div>
                    <p className="text-sm text-slate-500">
                      Patient ID
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {patient.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      User ID
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {patient.user_id || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Phone
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {patient.phone || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Gender
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {patient.gender || "Not available"}
                    </p>
                  </div>

                </div>
              </section>

              {/* =====================================================
                  CREATE FOLLOW-UP
              ===================================================== */}

              <section className="medipath-card p-6 mb-6">

                <h2 className="text-xl font-bold text-[#123c3a] mb-2">
                  ➕ Schedule New Follow-up
                </h2>

                <p className="text-slate-500 mb-5">
                  Create a follow-up appointment for this patient.
                </p>

                <form
                  onSubmit={handleCreateFollowUp}
                  className="space-y-5"
                >

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-[#173330] mb-2">
                      Follow-up Date & Time
                    </label>

                    <input
                      type="datetime-local"
                      name="followUpDate"
                      value={form.followUpDate}
                      onChange={handleChange}
                      className="w-full border border-[#cfe0dc] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f766e]"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-[#173330] mb-2">
                      Notes
                    </label>

                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Enter follow-up notes..."
                      className="w-full border border-[#cfe0dc] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f766e]"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={creating}
                    className="medipath-primary-button disabled:opacity-50"
                  >
                    {creating
                      ? "Creating..."
                      : "Create Follow-up"}
                  </button>

                </form>
              </section>

              {/* =====================================================
                  FOLLOW-UP RECORDS
              ===================================================== */}

              <section className="medipath-card p-6">

                <h2 className="text-xl font-bold text-[#123c3a] mb-5">
                  Follow-up Records
                </h2>

                {patientFollowUps.length === 0 ? (
                  <div className="bg-[#f8fcfb] rounded-xl p-6 text-center">
                    <p className="text-slate-500">
                      No follow-up records found for this patient.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">

                    {patientFollowUps.map(
                      (followUp) => {

                        const isUpdating =
                          String(updatingId) ===
                          String(followUp.id);

                        const isCompleted =
                          followUp.tracking_stage ===
                            "Treatment Completed" ||
                          followUp.status ===
                            "Completed" ||
                          followUp.status ===
                            "Treatment Completed";

                        return (
                          <div
                            key={followUp.id}
                            className="border border-[#dfeae7] rounded-xl p-5"
                          >

                            {/* Top */}
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

                              <div>
                                <p className="text-xs text-slate-500">
                                  Follow-up ID
                                </p>

                                <p className="font-bold text-[#123c3a]">
                                  {followUp.id}
                                </p>
                              </div>

                              <span
                                className={`inline-flex w-fit px-4 py-2 rounded-full font-semibold text-sm ${
                                  isCompleted
                                    ? "bg-green-100 text-green-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {isCompleted
                                  ? "Treatment Completed"
                                  : followUp.status ||
                                    "Scheduled"}
                              </span>

                            </div>

                            {/* Details */}
                            <div className="grid sm:grid-cols-2 gap-4 mt-5">

                              {/* Date */}
                              <div>
                                <p className="text-xs text-slate-500">
                                  Follow-up Date
                                </p>

                                <p className="font-semibold text-[#173330] mt-1">
                                  {followUp.follow_up_date
                                    ? new Date(
                                        followUp.follow_up_date
                                      ).toLocaleString()
                                    : "Not available"}
                                </p>
                              </div>

                              {/* Doctor */}
                              <div>
                                <p className="text-xs text-slate-500">
                                  Doctor ID
                                </p>

                                <p className="font-semibold text-[#173330] mt-1">
                                  {followUp.doctor_id ||
                                    "Not available"}
                                </p>
                              </div>

                              {/* Referral */}
                              <div>
                                <p className="text-xs text-slate-500">
                                  Referral ID
                                </p>

                                <p className="font-semibold text-[#173330] mt-1">
                                  {followUp.referral_id ??
                                    "None"}
                                </p>
                              </div>

                              {/* Tracking Stage */}
                              <div>
                                <p className="text-xs text-slate-500">
                                  Tracking Stage
                                </p>

                                <p className="font-semibold text-[#173330] mt-1">
                                  {followUp.tracking_stage ||
                                    "Not available"}
                                </p>
                              </div>

                              {/* Notes */}
                              <div className="sm:col-span-2">
                                <p className="text-xs text-slate-500">
                                  Notes
                                </p>

                                <p className="font-semibold text-[#173330] mt-1">
                                  {followUp.notes ||
                                    "No notes"}
                                </p>
                              </div>

                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-5">

                              <Link
                                to={`/patients/${followUp.patient_id}`}
                                className="flex-1 text-center medipath-primary-button"
                              >
                                View Patient
                              </Link>

                              <Link
                                to={`/patients/${followUp.patient_id}/followup`}
                                className="flex-1 text-center px-5 py-3 rounded-xl border border-[#dfeae7] bg-white text-[#0f766e] font-semibold"
                              >
                                View Follow-up
                              </Link>

                              {/* COMPLETE BUTTON */}
                              {!isCompleted && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCompleteFollowUp(
                                      followUp.id
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="flex-1 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:bg-slate-400"
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : "✓ Complete Follow-up"}
                                </button>
                              )}

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </section>

            </div>
          </main>
        </div>
      </div>
    );
  }

  // =====================================================
  // ALL FOLLOW-UPS PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f9f8]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">

          <div className="max-w-5xl mx-auto medipath-page">

            {/* Header */}
            <div className="mb-7">

              <p className="text-sm font-semibold text-[#0f766e]">
                Patient Care
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#123c3a] mt-1">
                📅 Follow-ups
              </h1>

              <p className="text-slate-500 mt-2">
                Schedule and view patient follow-up records.
              </p>

            </div>

            {/* Success */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
                {success}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
                {error}
              </div>
            )}

            {/* =====================================================
                CREATE FOLLOW-UP
            ===================================================== */}

            <section className="medipath-card p-6 mb-7">

              <h2 className="text-xl font-bold text-[#123c3a] mb-2">
                ➕ Schedule New Follow-up
              </h2>

              <p className="text-slate-500 mb-5">
                Select a patient and schedule their next follow-up.
              </p>

              <form
                onSubmit={handleCreateFollowUp}
                className="space-y-5"
              >

                {/* Patient */}
                <div>

                  <label className="block text-sm font-semibold text-[#173330] mb-2">
                    Patient
                  </label>

                  <select
                    name="patientId"
                    value={form.patientId}
                    onChange={handleChange}
                    className="w-full border border-[#cfe0dc] rounded-xl px-4 py-3 bg-white"
                  >

                    <option value="">
                      Select a patient
                    </option>

                    {patients.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        Patient #{item.id}
                        {item.phone
                          ? ` - ${item.phone}`
                          : ""}
                      </option>
                    ))}

                  </select>

                </div>

                {/* Date */}
                <div>

                  <label className="block text-sm font-semibold text-[#173330] mb-2">
                    Follow-up Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    name="followUpDate"
                    value={form.followUpDate}
                    onChange={handleChange}
                    className="w-full border border-[#cfe0dc] rounded-xl px-4 py-3"
                  />

                </div>

                {/* Notes */}
                <div>

                  <label className="block text-sm font-semibold text-[#173330] mb-2">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter follow-up notes..."
                    className="w-full border border-[#cfe0dc] rounded-xl px-4 py-3"
                  />

                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={creating}
                  className="medipath-primary-button disabled:opacity-50"
                >
                  {creating
                    ? "Creating..."
                    : "Create Follow-up"}
                </button>

              </form>

            </section>

            {/* =====================================================
                ALL FOLLOW-UP RECORDS
            ===================================================== */}

            <section className="space-y-4">

              {followUps.length === 0 ? (
                <div className="medipath-card p-8 text-center">
                  <p className="text-slate-500">
                    No follow-up records found.
                  </p>
                </div>
              ) : (
                followUps.map((followUp) => {

                  const relatedPatient =
                    patients.find(
                      (item) =>
                        String(item.id) ===
                        String(followUp.patient_id)
                    );

                  const isUpdating =
                    String(updatingId) ===
                    String(followUp.id);

                  const isCompleted =
                    followUp.tracking_stage ===
                      "Treatment Completed" ||
                    followUp.status ===
                      "Completed" ||
                    followUp.status ===
                      "Treatment Completed";

                  return (
                    <div
                      key={followUp.id}
                      className="medipath-card p-6"
                    >

                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:justify-between gap-4">

                        <div>

                          <p className="text-sm text-[#0f766e] font-semibold">
                            Patient ID:{" "}
                            {followUp.patient_id}
                          </p>

                          <h2 className="text-xl font-bold text-[#123c3a] mt-1">
                            {relatedPatient
                              ? relatedPatient.name ||
                                `Patient #${relatedPatient.id}`
                              : `Patient #${followUp.patient_id}`}
                          </h2>

                          {relatedPatient?.phone && (
                            <p className="text-slate-500 mt-1">
                              {relatedPatient.phone}
                            </p>
                          )}

                        </div>

                        <span
                          className={`px-4 py-2 rounded-full font-semibold w-fit ${
                            isCompleted
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {isCompleted
                            ? "Treatment Completed"
                            : followUp.status ||
                              "Scheduled"}
                        </span>

                      </div>

                      {/* Details */}
                      <div className="grid sm:grid-cols-2 gap-4 mt-5">

                        <div className="bg-[#f8fcfb] rounded-xl p-4">

                          <p className="text-xs text-slate-500">
                            Follow-up Date
                          </p>

                          <p className="font-semibold text-[#173330] mt-1">
                            {followUp.follow_up_date
                              ? new Date(
                                  followUp.follow_up_date
                                ).toLocaleString()
                              : "Not available"}
                          </p>

                        </div>

                        <div className="bg-[#f8fcfb] rounded-xl p-4">

                          <p className="text-xs text-slate-500">
                            Doctor ID
                          </p>

                          <p className="font-semibold text-[#173330] mt-1">
                            {followUp.doctor_id ||
                              "Not available"}
                          </p>

                        </div>

                        <div className="bg-[#f8fcfb] rounded-xl p-4">

                          <p className="text-xs text-slate-500">
                            Tracking Stage
                          </p>

                          <p className="font-semibold text-[#173330] mt-1">
                            {followUp.tracking_stage ||
                              "Not available"}
                          </p>

                        </div>

                        <div className="bg-[#f8fcfb] rounded-xl p-4">

                          <p className="text-xs text-slate-500">
                            Notes
                          </p>

                          <p className="font-semibold text-[#173330] mt-1">
                            {followUp.notes ||
                              "No notes"}
                          </p>

                        </div>

                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-5">

                        <Link
                          to={`/patients/${followUp.patient_id}`}
                          className="flex-1 text-center medipath-primary-button"
                        >
                          View Patient
                        </Link>

                        <Link
                          to={`/patients/${followUp.patient_id}/followup`}
                          className="flex-1 text-center px-5 py-3 rounded-xl border border-[#dfeae7] bg-white text-[#0f766e] font-semibold"
                        >
                          View Follow-up
                        </Link>

                        {/* COMPLETE */}
                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCompleteFollowUp(
                                followUp.id
                              )
                            }
                            disabled={isUpdating}
                            className="flex-1 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:bg-slate-400"
                          >
                            {isUpdating
                              ? "Updating..."
                              : "✓ Complete Follow-up"}
                          </button>
                        )}

                      </div>

                    </div>
                  );
                })
              )}

            </section>

          </div>

        </main>
      </div>
    </div>
  );
}

export default FollowUps;