import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getPatient } from "../services/patientApi";
import {
  getMedicalRecords,
  createMedicalRecord,
} from "../services/medicalRecordApi";
import { getReferrals } from "../services/referralApi";

function PatientProfile() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [referrals, setReferrals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [recordError, setRecordError] = useState("");
  const [referralError, setReferralError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    diagnosis: "",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  useEffect(() => {
    async function loadPatient() {
      try {
        setLoading(true);
        setError("");

        const data = await getPatient(id);

        if (!data) {
          setError("Patient not found.");
          return;
        }

        setPatient(data);

        // Load medical records
        try {
          const medicalData = await getMedicalRecords();

          const filtered = (medicalData || []).filter(
            (item) =>
              String(item.patient_id) === String(id)
          );

          setRecords(filtered);
        } catch (err) {
          console.error("Medical records error:", err);
          setRecords([]);
        }

        // Load referrals
        try {
          const referralData = await getReferrals();

          const filtered = (referralData || []).filter(
            (item) =>
              String(item.patient_id) === String(id)
          );

          setReferrals(filtered);
        } catch (err) {
          console.error("Referral error:", err);

          setReferralError(
            err.response?.data?.detail ||
              "Unable to load referrals."
          );

          setReferrals([]);
        }
      } catch (err) {
        console.error("Patient error:", err);

        setError(
          err.response?.data?.detail ||
            "Unable to load patient."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPatient();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((oldForm) => ({
      ...oldForm,
      [name]: value,
    }));
  }

  async function handleSaveRecord(event) {
    event.preventDefault();

    setRecordError("");
    setSuccess("");

    if (
      !form.diagnosis &&
      !form.symptoms &&
      !form.treatment &&
      !form.notes
    ) {
      setRecordError(
        "Please enter at least one detail."
      );
      return;
    }

    try {
      setSaving(true);

      const newRecord = await createMedicalRecord({
        patientId: id,
        diagnosis: form.diagnosis,
        symptoms: form.symptoms,
        treatment: form.treatment,
        notes: form.notes,
      });

      setRecords((oldRecords) => [
        ...oldRecords,
        newRecord,
      ]);

      setForm({
        diagnosis: "",
        symptoms: "",
        treatment: "",
        notes: "",
      });

      setSuccess(
        "Medical record created successfully."
      );
    } catch (err) {
      console.error("Create record error:", err);

      setRecordError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to create medical record."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Format backend timestamps correctly.
   *
   * The MediPath backend uses UTC timestamps.
   * If the backend returns a timestamp without a timezone,
   * we treat it as UTC by adding "Z".
   *
   * The browser then converts it automatically to the
   * user's local timezone (IST on your system).
   */
  function formatDateTime(dateValue) {
    if (!dateValue) {
      return "Not available";
    }

    const value = String(dateValue).trim();

    if (!value) {
      return "Not available";
    }

    // Check whether the timestamp already contains
    // a timezone such as Z, +05:30, or -04:00.
    const hasTimezone =
      /[zZ]$|[+-]\d{2}:\d{2}$/.test(value);

    // Backend timestamps without timezone are treated as UTC.
    const utcValue = hasTimezone
      ? value
      : `${value}Z`;

    const date = new Date(utcValue);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f9f8]">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-slate-600">
                Loading patient...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-[#f5f9f8]">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold text-[#123c3a]">
                Patient not found
              </h2>

              <p className="text-slate-500 mt-2">
                {error}
              </p>

              <Link
                to="/patients/search"
                className="inline-block mt-5 bg-[#0f766e] text-white px-5 py-3 rounded-xl"
              >
                Back to Search
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const patientId = patient.id ?? id;

  return (
    <div className="min-h-screen bg-[#f5f9f8]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-bold text-[#0f766e]">
                  PATIENT PROFILE
                </p>

                <h1 className="text-3xl font-bold text-[#123c3a]">
                  Patient #{patientId}
                </h1>

                <p className="text-slate-500 mt-1">
                  Patient information from MediPath API
                </p>
              </div>

              <Link
                to="/patients/search"
                className="bg-white border border-[#dfeae7] text-[#0f766e] px-4 py-2 rounded-xl font-semibold"
              >
                ← Back
              </Link>
            </div>

            {/* Basic Information */}
            <section className="bg-white rounded-2xl border border-[#dfeae7] p-6 mb-6">
              <h2 className="text-xl font-bold text-[#123c3a] mb-5">
                Basic Information
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Info
                  label="Patient ID"
                  value={patient.id}
                />

                <Info
                  label="User ID"
                  value={patient.user_id}
                />

                <Info
                  label="Date of Birth"
                  value={patient.date_of_birth}
                />

                <Info
                  label="Gender"
                  value={patient.gender}
                />

                <Info
                  label="Phone"
                  value={patient.phone}
                />

                <Info
                  label="Address"
                  value={patient.address}
                />

                <Info
                  label="Facility ID"
                  value={patient.facility_id}
                />
              </div>
            </section>

            {/* Medical Records */}
            <section className="bg-white rounded-2xl border border-[#dfeae7] p-6 mb-6">
              <h2 className="text-xl font-bold text-[#123c3a] mb-5">
                Medical Records
              </h2>

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-4">
                  {success}
                </div>
              )}

              {recordError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-4">
                  {recordError}
                </div>
              )}

              {/* Create Medical Record */}
              <form
                onSubmit={handleSaveRecord}
                className="space-y-4"
              >
                <input
                  type="text"
                  name="diagnosis"
                  value={form.diagnosis}
                  onChange={handleChange}
                  placeholder="Diagnosis"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3"
                />

                <textarea
                  name="symptoms"
                  value={form.symptoms}
                  onChange={handleChange}
                  placeholder="Symptoms"
                  rows={3}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3"
                />

                <textarea
                  name="treatment"
                  value={form.treatment}
                  onChange={handleChange}
                  placeholder="Treatment"
                  rows={3}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3"
                />

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Notes"
                  rows={3}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3"
                />

                <button
                  type="submit"
                  disabled={saving}
                  className="medipath-primary-button disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Medical Record"}
                </button>
              </form>

              {/* Previous Medical Records */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-[#123c3a] mb-4">
                  Previous Medical Records
                </h3>

                {records.length === 0 ? (
                  <p className="text-slate-500">
                    No medical records available.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {records.map((record) => (
                      <div
                        key={record.id}
                        className="border border-[#dfeae7] rounded-xl p-4"
                      >
                        <p className="font-bold text-[#123c3a]">
                          Record #{record.id}
                        </p>

                        <p className="mt-2">
                          <strong>Diagnosis:</strong>{" "}
                          {record.diagnosis || "Not available"}
                        </p>

                        <p>
                          <strong>Symptoms:</strong>{" "}
                          {record.symptoms || "Not available"}
                        </p>

                        <p>
                          <strong>Treatment:</strong>{" "}
                          {record.treatment || "Not available"}
                        </p>

                        <p>
                          <strong>Doctor ID:</strong>{" "}
                          {record.doctor_id || "Not available"}
                        </p>

                        <p>
                          <strong>Notes:</strong>{" "}
                          {record.notes || "No notes"}
                        </p>

                        {record.created_at && (
                          <p className="text-sm text-slate-500 mt-2">
                            Created At:{" "}
                            {formatDateTime(record.created_at)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Previous Visits */}
            <section className="bg-white rounded-2xl border border-[#dfeae7] p-6 mb-6">
              <h2 className="text-xl font-bold text-[#123c3a]">
                Previous Visits
              </h2>

              <p className="text-slate-500 mt-2">
                Visit history is not provided by the current backend API.
              </p>
            </section>

            {/* Previous Referrals */}
            <section className="bg-white rounded-2xl border border-[#dfeae7] p-6 mb-6">
              <h2 className="text-xl font-bold text-[#123c3a]">
                Previous Referrals
              </h2>

              <p className="text-slate-500 mt-1">
                Referral history from the MediPath API
              </p>

              {referralError ? (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mt-4">
                  {referralError}
                </div>
              ) : referrals.length === 0 ? (
                <p className="text-slate-500 mt-4">
                  No previous referrals available.
                </p>
              ) : (
                <div className="space-y-4 mt-4">
                  {referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="border border-[#dfeae7] rounded-xl p-4"
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">
                            Referral ID
                          </p>

                          <p className="font-bold text-[#123c3a]">
                            #{referral.id}
                          </p>
                        </div>

                        <span className="medipath-status-pending">
                          {referral.status || "Pending"}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 mt-4">
                        <Info
                          label="From Facility"
                          value={referral.from_facility_id}
                        />

                        <Info
                          label="To Facility"
                          value={referral.to_facility_id}
                        />

                        <Info
                          label="Referred By"
                          value={referral.referred_by}
                        />

                        <Info
                          label="Reason"
                          value={referral.reason}
                        />
                      </div>

                      {referral.referral_date && (
                        <p className="text-sm text-slate-500 mt-4">
                          Referral Date:{" "}
                          {formatDateTime(
                            referral.referral_date
                          )}
                        </p>
                      )}

                      {referral.notes && (
                        <p className="mt-2">
                          <strong>Notes:</strong>{" "}
                          {referral.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Patient Actions */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#123c3a] mb-4">
                Patient Actions
              </h2>

              <div className="grid sm:grid-cols-3 gap-4">
                <Link
                  to={`/patients/${patientId}/triage`}
                  className="bg-[#0f766e] text-white rounded-2xl p-5 text-center font-bold"
                >
                  🩺

                  <div className="mt-2">
                    Start Triage
                  </div>
                </Link>

                <Link
                  to={`/patients/${patientId}/referral`}
                  className="bg-orange-500 text-white rounded-2xl p-5 text-center font-bold"
                >
                  🏥

                  <div className="mt-2">
                    Create Referral
                  </div>
                </Link>

                <Link
                  to={`/patients/${patientId}/followup`}
                  className="bg-green-600 text-white rounded-2xl p-5 text-center font-bold"
                >
                  📅

                  <div className="mt-2">
                    Follow-up
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

function Info({ label, value }) {
  return (
    <div className="bg-[#f8fcfb] border border-[#e9f1ef] rounded-xl p-4">
      <p className="text-xs text-slate-500 uppercase font-semibold">
        {label}
      </p>

      <p className="font-semibold text-[#173330] mt-1">
        {value ?? "Not available"}
      </p>
    </div>
  );
}

export default PatientProfile;