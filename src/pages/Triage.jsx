import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getPatient } from "../services/patientApi";
import { createTriage } from "../services/triageApi";

function Triage() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fever: "No",
    breathingDifficulty: "No",
    chestPain: "No",
    duration: "",
    temperature: "",
    symptoms: "",
  });

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const data = await getPatient(id);
        setPatient(data);
      } catch (error) {
        console.error("Failed to load patient:", error);
        setPatient(null);
      }
    };

    loadPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let priority = "Routine";
    let message = "Patient can continue with routine follow-up.";

    if (
      formData.breathingDifficulty === "Yes" ||
      formData.chestPain === "Yes"
    ) {
      priority = "Urgent";
      message = "Urgent clinical evaluation is recommended.";
    } else if (formData.fever === "Yes") {
      priority = "Priority";
      message = "Further clinical assessment is recommended.";
    }

    const symptoms = [];

    if (formData.fever === "Yes") {
      symptoms.push("Fever");
    }

    if (formData.breathingDifficulty === "Yes") {
      symptoms.push("Breathing difficulty");
    }

    if (formData.chestPain === "Yes") {
      symptoms.push("Chest pain");
    }

    if (formData.symptoms.trim()) {
      symptoms.push(formData.symptoms.trim());
    }

    const chiefComplaint =
      symptoms.length > 0
        ? symptoms.join(", ")
        : "General clinical assessment";

    try {
      setLoading(true);

      const triageResponse = await createTriage({
        patientId: patient.id,
        chiefComplaint: chiefComplaint,
        symptoms: symptoms,
        temperature: formData.temperature,
        heartRate: null,
        respiratoryRate: null,
        spo2: null,
        bloodPressure: null,
        urgencyLevel: priority,
        notes: formData.duration
          ? `Duration: ${formData.duration}`
          : null,
      });

      setResult({
        priority: triageResponse.urgency_level || priority,
        message: message,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Triage submission failed:", error);

      alert(
        error.response?.data?.detail ||
          error.message ||
          "Failed to submit triage assessment."
      );
    } finally {
      setLoading(false);
    }
  };

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
                className="inline-flex mt-5 bg-[#0f766e] hover:bg-[#115e59] text-white px-5 py-3 rounded-xl font-semibold text-sm transition"
              >
                ← Back to Search
              </Link>
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-5xl mx-auto medipath-page">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-[#0f766e]">
                  Clinical Assessment
                </p>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#123c3a] mt-1">
                  Triage
                </h1>

                <p className="text-slate-500 mt-1">
                  Record symptoms and identify the required priority level.
                </p>
              </div>

              <Link
                to={`/patients/${patient.id}`}
                className="inline-flex items-center justify-center bg-white border border-[#dfeae7] text-[#0f766e] px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#f0fdfa] transition"
              >
                ← Patient Profile
              </Link>
            </div>

            {/* Patient banner */}
            <div className="bg-[#123c3a] text-white rounded-2xl p-5 mb-6 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center text-xl font-bold">
                  {patient.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-lg font-bold">{patient.name}</p>

                  <p className="text-sm text-teal-200">
                    Patient ID: {patient.id} • Age: {patient.age} •{" "}
                    {patient.gender}
                  </p>
                </div>
              </div>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit}>

                {/* Symptoms */}
                <div className="medipath-card p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#ccfbf1] flex items-center justify-center text-xl">
                      🩺
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-[#123c3a]">
                        Symptom Assessment
                      </h2>

                      <p className="text-sm text-slate-500">
                        Enter the patient's current symptoms.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* Fever */}
                    <div>
                      <label className="block text-sm font-semibold text-[#173330] mb-2">
                        Fever?
                      </label>

                      <select
                        name="fever"
                        value={formData.fever}
                        onChange={handleChange}
                        className="w-full border border-[#dfeae7] rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#99f6e4]"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>

                    {/* Breathing Difficulty */}
                    <div>
                      <label className="block text-sm font-semibold text-[#173330] mb-2">
                        Breathing Difficulty?
                      </label>

                      <select
                        name="breathingDifficulty"
                        value={formData.breathingDifficulty}
                        onChange={handleChange}
                        className="w-full border border-[#dfeae7] rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#99f6e4]"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>

                    {/* Chest Pain */}
                    <div>
                      <label className="block text-sm font-semibold text-[#173330] mb-2">
                        Chest Pain?
                      </label>

                      <select
                        name="chestPain"
                        value={formData.chestPain}
                        onChange={handleChange}
                        className="w-full border border-[#dfeae7] rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#99f6e4]"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-semibold text-[#173330] mb-2">
                        Duration
                      </label>

                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g. 2 days"
                        className="w-full border border-[#dfeae7] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#99f6e4]"
                      />
                    </div>

                    {/* Temperature */}
                    <div>
                      <label className="block text-sm font-semibold text-[#173330] mb-2">
                        Temperature (°C)
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleChange}
                        placeholder="e.g. 37.2"
                        className="w-full border border-[#dfeae7] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#99f6e4]"
                      />
                    </div>

                    {/* Other Symptoms */}
                    <div className="md:col-span-3">
                      <label className="block text-sm font-semibold text-[#173330] mb-2">
                        Other Symptoms
                      </label>

                      <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Describe any other symptoms..."
                        className="w-full border border-[#dfeae7] rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-[#99f6e4]"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`medipath-primary-button ${
                        loading ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Submitting..." : "🩺 Submit Triage"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Result */
              <div className="space-y-6">

                {/* Triage Result */}
                <div className="medipath-card p-6">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm font-semibold text-[#0f766e]">
                        Assessment Complete
                      </p>

                      <h2 className="text-2xl font-bold text-[#123c3a] mt-1">
                        Triage Result
                      </h2>
                    </div>

                    <span
                      className={
                        result.priority === "Urgent"
                          ? "medipath-status-urgent"
                          : result.priority === "Priority"
                          ? "medipath-status-pending"
                          : "medipath-status-completed"
                      }
                    >
                      {result.priority}
                    </span>
                  </div>

                  <div className="bg-[#f0fdfa] border border-[#99f6e4] rounded-xl p-4">
                    <p className="text-[#123c3a] font-semibold">
                      {result.message}
                    </p>
                  </div>
                </div>

                {/* Recorded Information */}
                <div className="medipath-card p-6">
                  <h3 className="text-lg font-bold text-[#123c3a] mb-5">
                    Recorded Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Fever */}
                    <div className="bg-[#f8fcfb] rounded-xl p-4">
                      <p className="text-xs text-slate-500">Fever</p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {formData.fever}
                      </p>
                    </div>

                    {/* Breathing */}
                    <div className="bg-[#f8fcfb] rounded-xl p-4">
                      <p className="text-xs text-slate-500">
                        Breathing Difficulty
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {formData.breathingDifficulty}
                      </p>
                    </div>

                    {/* Chest Pain */}
                    <div className="bg-[#f8fcfb] rounded-xl p-4">
                      <p className="text-xs text-slate-500">
                        Chest Pain
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {formData.chestPain}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="bg-[#f8fcfb] rounded-xl p-4">
                      <p className="text-xs text-slate-500">
                        Duration
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {formData.duration || "Not provided"}
                      </p>
                    </div>

                    {/* Temperature */}
                    <div className="bg-[#f8fcfb] rounded-xl p-4">
                      <p className="text-xs text-slate-500">
                        Temperature
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {formData.temperature
                          ? `${formData.temperature} °C`
                          : "Not provided"}
                      </p>
                    </div>

                    {/* Other Symptoms */}
                    <div className="bg-[#f8fcfb] rounded-xl p-4 sm:col-span-2 lg:col-span-1">
                      <p className="text-xs text-slate-500">
                        Other Symptoms
                      </p>

                      <p className="font-semibold text-[#173330] mt-1">
                        {formData.symptoms || "None"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setResult(null);
                    }}
                    className="px-5 py-3 rounded-xl border border-[#dfeae7] bg-white text-[#0f766e] font-semibold hover:bg-[#f0fdfa] transition"
                  >
                    ✏️ Edit Triage
                  </button>

                  <Link
                    to={`/patients/${patient.id}/referral`}
                    className="medipath-primary-button"
                  >
                    🏥 Create Referral
                  </Link>
                </div>
              </div>
            )}

            {/* Notice */}
            <div className="mt-6 bg-[#f0fdfa] border border-[#99f6e4] rounded-xl p-4">
              <p className="text-sm text-[#115e59]">
                <strong>Note:</strong> Triage is a decision-support
                assessment. It does not replace professional clinical
                judgment.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Triage;