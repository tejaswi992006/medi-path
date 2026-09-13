import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import createReferral from "../services/referralApi";

function Referral() {
  const { id } = useParams();

  const [facility, setFacility] = useState("");
  const [reason, setReason] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!facility) {
      setError("Please select a destination facility.");
      return;
    }

    if (!reason.trim()) {
      setError("Please enter the reason for referral.");
      return;
    }

    setLoading(true);

    try {
      const result = await createReferral({
        patientId: id,
        toFacilityId: facility,
        reason: reason.trim(),
      });

      if (result && result.success) {
        setSubmitted(true);
      } else {
        setError("Unable to create referral. Please try again.");
      }
    } catch (err) {
      console.error("Referral error:", err);

      if (err.response?.status === 403) {
        setError(
          "Only a doctor account can create referrals with the current backend."
        );
      } else if (err.response?.status === 404) {
        setError("Patient or facility was not found.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(
          "Unable to connect to the backend. Make sure the FastAPI server is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9f8]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-4xl mx-auto medipath-page">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-[#0f766e]">
                  Patient Care
                </p>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#123c3a] mt-1">
                  Create Referral
                </h1>

                <p className="text-slate-500 mt-1">
                  Refer the patient to an appropriate healthcare facility.
                </p>
              </div>

              <Link
                to={`/patients/${id}`}
                className="inline-flex items-center justify-center bg-white border border-[#dfeae7] text-[#0f766e] px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#f0fdfa] transition"
              >
                ← Patient Profile
              </Link>
            </div>

            {!submitted ? (
              <div className="medipath-card p-5 sm:p-7">

                {/* Card heading */}
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-12 h-12 rounded-xl bg-[#ccfbf1] flex items-center justify-center text-2xl">
                    🏥
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#123c3a]">
                      Referral Details
                    </h2>

                    <p className="text-sm text-slate-500">
                      Provide the destination facility and referral reason.
                    </p>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-medium">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Destination Facility */}
                  <div>
                    <label className="block text-sm font-semibold text-[#173330] mb-2">
                      Destination Facility
                    </label>

                    <select
                      value={facility}
                      onChange={(e) => setFacility(e.target.value)}
                      className="w-full border border-[#dfeae7] rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#99f6e4]"
                    >
                      <option value="">
                        Select healthcare facility
                      </option>

                      <option value="1">
                        Medi-Path Demo PHC
                      </option>

                      <option value="2">
                        Medi-Path Demo District Hospital
                      </option>
                    </select>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-semibold text-[#173330] mb-2">
                      Reason for Referral
                    </label>

                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows="6"
                      placeholder="Enter the reason for referring this patient..."
                      className="w-full border border-[#dfeae7] rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-[#99f6e4]"
                    />
                  </div>

                  {/* Patient ID */}
                  <div className="bg-[#f0fdfa] border border-[#99f6e4] rounded-xl p-4">
                    <p className="text-xs text-[#526b67]">
                      Referral for Patient
                    </p>

                    <p className="font-bold text-[#123c3a] mt-1">
                      {id}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">

                    <Link
                      to={`/patients/${id}`}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-[#dfeae7] bg-white text-slate-600 font-semibold hover:bg-slate-50 transition"
                    >
                      Cancel
                    </Link>

                    <button
                      type="submit"
                      disabled={loading}
                      className="medipath-primary-button disabled:opacity-60"
                    >
                      {loading
                        ? "Submitting..."
                        : "🏥 Submit Referral"}
                    </button>

                  </div>
                </form>
              </div>
            ) : (
              /* Success */
              <div className="medipath-card p-6 sm:p-8">

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#dcfce7] flex items-center justify-center text-4xl">
                    ✓
                  </div>

                  <p className="text-sm font-semibold text-[#16a34a] mt-5">
                    Referral Submitted
                  </p>

                  <h2 className="text-2xl font-bold text-[#123c3a] mt-1">
                    Referral Created Successfully
                  </h2>

                  <p className="text-slate-500 mt-2">
                    The referral has been saved to the backend.
                  </p>
                </div>

                {/* Referral Details */}
                <div className="mt-7 space-y-3">

                  <div className="bg-[#f8fcfb] rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Patient ID
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {id}
                    </p>
                  </div>

                  <div className="bg-[#f8fcfb] rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Destination Facility
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {facility === "1"
                        ? "Medi-Path Demo PHC"
                        : "Medi-Path Demo District Hospital"}
                    </p>
                  </div>

                  <div className="bg-[#f8fcfb] rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Reason
                    </p>

                    <p className="font-semibold text-[#173330] mt-1">
                      {reason}
                    </p>
                  </div>

                </div>

                {/* Return */}
                <div className="flex justify-center mt-7">
                  <Link
                    to={`/patients/${id}`}
                    className="medipath-primary-button"
                  >
                    ← Return to Patient Profile
                  </Link>
                </div>
              </div>
            )}

            {/* Notice */}
            <div className="mt-6 bg-[#fff7ed] border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-800">
                <strong>Important:</strong> Referral decisions should be
                based on clinical assessment and the health worker's
                professional judgment.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Referral;