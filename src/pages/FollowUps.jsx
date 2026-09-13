import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
  getFollowUps,
  createFollowUp,
} from "../services/followupApi";

import { getPatients, getPatient } from "../services/patientApi";

function FollowUps() {
  const { id } = useParams();

  const [followUps, setFollowUps] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    patientId: id || "",
    followUpDate: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const followUpData = await getFollowUps();
      setFollowUps(followUpData || []);

      if (id) {
        const patientData = await getPatient(id);
        setPatient(patientData || null);

        setForm((previous) => ({
          ...previous,
          patientId: id,
        }));
      } else {
        const patientData = await getPatients();
        setPatients(patientData || []);
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateFollowUp = async (e) => {
    e.preventDefault();

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

    const doctorId = window.localStorage.getItem(
      "medipath_user_id"
    );

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

      setFollowUps((previous) => [
        ...previous,
        newFollowUp,
      ]);

      setSuccess("Follow-up created successfully! ✅");

      setForm((previous) => ({
        ...previous,
        followUpDate: "",
        notes: "",
      }));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f9f8]">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">⏳</div>

              <p className="text-slate-500 font-medium">
                Loading follow-ups...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (id) {
    if (!patient) {
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

    const patientFollowUps = followUps.filter(
      (item) =>
        String(item.patient_id) === String(patient.id)
    );

    return (
      <div className="min-h-screen bg-[#f5f9f8]">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto medipath-page">

              <Link
                to={`/patients/${patient.id}`}
                className="text-[#0f766e] font-semibold"
              >
                ← Back to Patient Profile
              </Link>

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

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
                  {error}
                </div>
              )}

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
                      {patient.user_id}
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
                    {patientFollowUps.map((followUp) => (
                      <div
                        key={followUp.id}
                        className="border border-[#dfeae7] rounded-xl p-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                          <div>
                            <p className="text-xs text-slate-500">
                              Follow-up ID
                            </p>

                            <p className="font-bold text-[#123c3a]">
                              {followUp.id}
                            </p>
                          </div>

                          <span className="inline-flex w-fit px-4 py-2 rounded-full font-semibold text-sm bg-orange-100 text-orange-700">
                            {followUp.status}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mt-5">
                          <div>
                            <p className="text-xs text-slate-500">
                              Follow-up Date
                            </p>

                            <p className="font-semibold text-[#173330] mt-1">
                              {new Date(
                                followUp.follow_up_date
                              ).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Doctor ID
                            </p>

                            <p className="font-semibold text-[#173330] mt-1">
                              {followUp.doctor_id}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Referral ID
                            </p>

                            <p className="font-semibold text-[#173330] mt-1">
                              {followUp.referral_id ?? "None"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Notes
                            </p>

                            <p className="font-semibold text-[#173330] mt-1">
                              {followUp.notes || "No notes"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f9f8]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto medipath-page">

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

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
                {error}
              </div>
            )}

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

            <section className="space-y-4">
              {followUps.map((followUp) => {
                const relatedPatient = patients.find(
                  (item) =>
                    String(item.id) ===
                    String(followUp.patient_id)
                );

                return (
                  <div
                    key={followUp.id}
                    className="medipath-card p-6"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      <div>
                        <p className="text-sm text-[#0f766e] font-semibold">
                          Patient ID: {followUp.patient_id}
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

                      <span className="px-4 py-2 rounded-full font-semibold w-fit bg-orange-100 text-orange-700">
                        {followUp.status}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mt-5">
                      <div className="bg-[#f8fcfb] rounded-xl p-4">
                        <p className="text-xs text-slate-500">
                          Follow-up Date
                        </p>

                        <p className="font-semibold text-[#173330] mt-1">
                          {new Date(
                            followUp.follow_up_date
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-[#f8fcfb] rounded-xl p-4">
                        <p className="text-xs text-slate-500">
                          Doctor ID
                        </p>

                        <p className="font-semibold text-[#173330] mt-1">
                          {followUp.doctor_id}
                        </p>
                      </div>
                    </div>

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
                    </div>
                  </div>
                );
              })}
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default FollowUps;