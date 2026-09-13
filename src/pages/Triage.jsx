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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    chiefComplaint: "",
    fever: "No",
    breathingDifficulty: "No",
    chestPain: "No",
    duration: "",
    symptoms: "",
    temperature: "",
    heartRate: "",
    respiratoryRate: "",
    spo2: "",
    bloodPressure: "",
    notes: "",
  });

  useEffect(() => {
    async function loadPatient() {
      try {
        const data = await getPatient(id);
        setPatient(data);
      } catch (error) {
        console.error(error);
        setPatient(null);
      }
    }

    loadPatient();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let priority = "Routine";

    if (
      formData.breathingDifficulty === "Yes" ||
      formData.chestPain === "Yes"
    ) {
      priority = "Urgent";
    } else if (formData.fever === "Yes") {
      priority = "Priority";
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

    try {
      setLoading(true);

      const response = await createTriage({
        patientId: patient.id,
        chiefComplaint:
          formData.chiefComplaint || "General clinical assessment",
        symptoms: symptoms,
        temperature: formData.temperature,
        heartRate: formData.heartRate,
        respiratoryRate: formData.respiratoryRate,
        spo2: formData.spo2,
        bloodPressure: formData.bloodPressure,
        urgencyLevel: priority,
        notes: formData.notes || formData.duration || null,
      });

      setResult({
        priority: response.urgency_level || priority,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Triage submission failed:", error);

      alert(
        error.response?.data?.detail ||
          error.message ||
          "Failed to submit triage."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-[#f5f9f8]">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold">
                Patient not found
              </h2>

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

  return (
    <div className="min-h-screen bg-[#f5f9f8]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">

            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm font-semibold text-[#0f766e]">
                  Clinical Assessment
                </p>

                <h1 className="text-3xl font-bold text-[#123c3a]">
                  Triage
                </h1>
              </div>

              <Link
                to={`/patients/${patient.id}`}
                className="bg-white border px-4 py-3 rounded-xl"
              >
                ← Patient Profile
              </Link>
            </div>

            <div className="bg-[#123c3a] text-white rounded-2xl p-5 mb-6">
              <p className="text-lg font-bold">
                {patient.name}
              </p>

              <p className="text-sm text-teal-200">
                Patient ID: {patient.id} • Age: {patient.age} •{" "}
                {patient.gender}
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit}>

                <section className="bg-white rounded-2xl p-6 mb-6">
                  <h2 className="text-lg font-bold mb-4">
                    Chief Complaint
                  </h2>

                  <textarea
                    name="chiefComplaint"
                    value={formData.chiefComplaint}
                    onChange={handleChange}
                    placeholder="e.g. Fever and headache"
                    rows="3"
                    className="w-full border rounded-xl p-3"
                  />
                </section>

                <section className="bg-white rounded-2xl p-6 mb-6">
                  <h2 className="text-lg font-bold mb-5">
                    Symptom Assessment
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <div>
                      <label>Fever?</label>

                      <select
                        name="fever"
                        value={formData.fever}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>

                    <div>
                      <label>Breathing Difficulty?</label>

                      <select
                        name="breathingDifficulty"
                        value={formData.breathingDifficulty}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>

                    <div>
                      <label>Chest Pain?</label>

                      <select
                        name="chestPain"
                        value={formData.chestPain}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>

                    <div>
                      <label>Duration</label>

                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g. 2 days"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label>Other Symptoms</label>

                      <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        placeholder="e.g. headache, cough, body pain"
                        rows="3"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                  </div>
                </section>

                <section className="bg-white rounded-2xl p-6 mb-6">
                  <h2 className="text-lg font-bold mb-5">
                    Vital Signs
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    <div>
                      <label>Temperature (°C)</label>

                      <input
                        type="number"
                        step="0.1"
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label>Heart Rate (bpm)</label>

                      <input
                        type="number"
                        name="heartRate"
                        value={formData.heartRate}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label>Respiratory Rate (/min)</label>

                      <input
                        type="number"
                        name="respiratoryRate"
                        value={formData.respiratoryRate}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label>SpO₂ (%)</label>

                      <input
                        type="number"
                        name="spo2"
                        value={formData.spo2}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label>Blood Pressure</label>

                      <input
                        type="text"
                        name="bloodPressure"
                        value={formData.bloodPressure}
                        onChange={handleChange}
                        placeholder="e.g. 120/80"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                  </div>
                </section>

                <section className="bg-white rounded-2xl p-6 mb-6">
                  <h2 className="text-lg font-bold mb-4">
                    Clinical Notes
                  </h2>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter additional clinical notes..."
                    className="w-full border rounded-xl p-3"
                  />
                </section>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="medipath-primary-button"
                  >
                    {loading ? "Submitting..." : "🩺 Submit Triage"}
                  </button>
                </div>

              </form>
            ) : (
              <div>

                <section className="bg-white rounded-2xl p-6 mb-6">
                  <p className="text-sm text-[#0f766e] font-semibold">
                    Assessment Complete
                  </p>

                  <h2 className="text-2xl font-bold text-[#123c3a]">
                    Triage Result
                  </h2>

                  <div className="mt-5 bg-[#f0fdfa] rounded-xl p-4">
                    <p className="font-bold">
                      Priority: {result.priority}
                    </p>
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-5">
                    Recorded Information
                  </h2>

                  <div className="space-y-4">

                    <p>
                      <strong>Chief Complaint:</strong>{" "}
                      {formData.chiefComplaint ||
                        "General clinical assessment"}
                    </p>

                    <p>
                      <strong>Symptoms:</strong>{" "}
                      {formData.symptoms || "None"}
                    </p>

                    <p>
                      <strong>Temperature:</strong>{" "}
                      {formData.temperature || "Not provided"}
                    </p>

                    <p>
                      <strong>Heart Rate:</strong>{" "}
                      {formData.heartRate || "Not provided"}
                    </p>

                    <p>
                      <strong>Respiratory Rate:</strong>{" "}
                      {formData.respiratoryRate || "Not provided"}
                    </p>

                    <p>
                      <strong>SpO₂:</strong>{" "}
                      {formData.spo2 || "Not provided"}
                    </p>

                    <p>
                      <strong>Blood Pressure:</strong>{" "}
                      {formData.bloodPressure || "Not provided"}
                    </p>

                    <p>
                      <strong>Notes:</strong>{" "}
                      {formData.notes || "Not provided"}
                    </p>

                  </div>
                </section>

                <div className="flex justify-end gap-3 mt-6">

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setResult(null);
                    }}
                    className="px-5 py-3 rounded-xl border bg-white"
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

            <div className="mt-6 bg-[#f0fdfa] rounded-xl p-4">
              <p className="text-sm text-[#115e59]">
                <strong>Note:</strong> Triage is a decision-support
                assessment and does not replace professional clinical
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