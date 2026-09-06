import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { addPatient } from "../mock/mockData";

function RegisterPatient() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    village: "",
    medicalHistory: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [registeredPatient, setRegisteredPatient] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.age ||
      !formData.gender ||
      !formData.phone.trim() ||
      !formData.village.trim()
    ) {
      setError("Please fill all required fields.");
      setSuccess("");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      setSuccess("");
      return;
    }

    const newPatient = addPatient(formData);

    setRegisteredPatient(newPatient);

    setSuccess("Patient registered successfully!");

    setError("");

    setFormData({
      name: "",
      age: "",
      gender: "",
      phone: "",
      village: "",
      medicalHistory: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f9f8]">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">

          <div className="max-w-5xl mx-auto medipath-page">

            {/* =========================
                PAGE HEADER
            ========================== */}

            <section className="mb-7">

              <div className="flex items-center gap-2 mb-2">

                <span className="w-2 h-2 rounded-full bg-[#14b8a6]"></span>

                <p className="text-[#0f766e] font-bold text-xs tracking-wider uppercase">
                  Patient Management
                </p>

              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#123c3a] tracking-tight">
                Register Patient
              </h1>

              <p className="text-slate-500 mt-2">
                Create a new patient record for the health worker.
              </p>

            </section>


            {/* =========================
                SUCCESS MESSAGE
            ========================== */}

            {success && registeredPatient && (

              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 shadow-sm">

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 shrink-0 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                    ✅
                  </div>

                  <div className="flex-1">

                    <h2 className="font-bold text-green-800">
                      {success}
                    </h2>

                    <p className="text-green-700 text-sm mt-1">
                      Patient ID:
                      <strong className="ml-1">
                        {registeredPatient.id}
                      </strong>
                    </p>

                    <p className="text-green-700 text-sm mt-1">
                      You can now search for this patient using
                      their Patient ID or phone number.
                    </p>

                    <button
                      onClick={() =>
                        navigate(
                          `/patients/${registeredPatient.id}`
                        )
                      }
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                    >
                      View Patient Profile →
                    </button>

                  </div>

                </div>

              </div>

            )}


            {/* =========================
                ERROR MESSAGE
            ========================== */}

            {error && (

              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 shadow-sm">

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


            {/* =========================
                FORM CARD
            ========================== */}

            <div className="bg-white border border-[#dfeae7] rounded-2xl shadow-sm overflow-hidden">

              {/* Form Header */}

              <div className="px-6 sm:px-8 py-6 bg-[#f8fcfb] border-b border-[#e9f1ef]">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-[#ccfbf1] border border-[#99f6e4] flex items-center justify-center text-2xl">
                    👤
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-[#123c3a]">
                      Patient Information
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Fields marked with * are required.
                    </p>

                  </div>

                </div>

              </div>


              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8"
              >

                <div className="grid md:grid-cols-2 gap-6">


                  {/* =====================
                      NAME
                  ====================== */}

                  <div>

                    <label className="block text-sm font-semibold text-[#173330] mb-2">
                      Patient Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full border border-[#cddbd8] rounded-xl px-4 py-3 bg-white text-[#173330] placeholder:text-slate-400 transition-all focus:border-[#14b8a6] focus:ring-4 focus:ring-[#ccfbf1]"
                    />

                  </div>


                  {/* =====================
                      AGE
                  ====================== */}

                  <div>

                    <label className="block text-sm font-semibold text-[#173330] mb-2">
                      Age *
                    </label>

                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter age"
                      min="1"
                      max="120"
                      className="w-full border border-[#cddbd8] rounded-xl px-4 py-3 bg-white text-[#173330] placeholder:text-slate-400 transition-all focus:border-[#14b8a6] focus:ring-4 focus:ring-[#ccfbf1]"
                    />

                  </div>


                  {/* =====================
                      GENDER
                  ====================== */}

                  <div>

                    <label className="block text-sm font-semibold text-[#173330] mb-2">
                      Gender *
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border border-[#cddbd8] rounded-xl px-4 py-3 bg-white text-[#173330] transition-all focus:border-[#14b8a6] focus:ring-4 focus:ring-[#ccfbf1]"
                    >

                      <option value="">
                        Select gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>


                  {/* =====================
                      PHONE
                  ====================== */}

                  <div>

                    <label className="block text-sm font-semibold text-[#173330] mb-2">
                      Phone Number *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      maxLength="10"
                      inputMode="numeric"
                      className="w-full border border-[#cddbd8] rounded-xl px-4 py-3 bg-white text-[#173330] placeholder:text-slate-400 transition-all focus:border-[#14b8a6] focus:ring-4 focus:ring-[#ccfbf1]"
                    />

                  </div>


                  {/* =====================
                      VILLAGE
                  ====================== */}

                  <div>

                    <label className="block text-sm font-semibold text-[#173330] mb-2">
                      Village *
                    </label>

                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      placeholder="Enter village name"
                      className="w-full border border-[#cddbd8] rounded-xl px-4 py-3 bg-white text-[#173330] placeholder:text-slate-400 transition-all focus:border-[#14b8a6] focus:ring-4 focus:ring-[#ccfbf1]"
                    />

                  </div>


                  {/* =====================
                      MEDICAL HISTORY
                  ====================== */}

                  <div>

                    <label className="block text-sm font-semibold text-[#173330] mb-2">
                      Basic Medical History
                    </label>

                    <textarea
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleChange}
                      placeholder="Enter basic medical history"
                      rows="4"
                      className="w-full border border-[#cddbd8] rounded-xl px-4 py-3 bg-white text-[#173330] placeholder:text-slate-400 transition-all focus:border-[#14b8a6] focus:ring-4 focus:ring-[#ccfbf1] resize-none"
                    />

                  </div>

                </div>


                {/* =========================
                    FORM ACTIONS
                ========================== */}

                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-[#e9f1ef]">

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-[#0f766e] hover:bg-[#115e59] text-white px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all"
                  >
                    <span>✓</span>
                    Register Patient
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>


            {/* =========================
                DEMO INFORMATION
            ========================== */}

            <section className="mt-6 bg-[#f0fdfa] border border-[#99f6e4] rounded-2xl p-5">

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 shrink-0 bg-white rounded-xl border border-[#ccfbf1] flex items-center justify-center text-xl">
                  💡
                </div>

                <div>

                  <h3 className="font-bold text-[#123c3a]">
                    Development Demo Mode
                  </h3>

                  <p className="text-sm text-[#0f766e] mt-1 leading-relaxed">
                    This patient is currently stored using
                    MediPath mock data. When Member 1's API
                    is connected, this form will send the
                    same information to the backend.
                  </p>

                </div>

              </div>

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}

export default RegisterPatient;