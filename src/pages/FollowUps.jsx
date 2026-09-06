import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getAllPatients,
  getPatientById,
  updateFollowup,
} from "../mock/mockData";

function FollowUps() {
  const { id } = useParams();

  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      const result = getPatientById(id);
      setPatient(result || null);
    } else {
      const allPatients = getAllPatients();

      const followupPatients = allPatients.filter(
        (item) => item.followup
      );

      setPatients(followupPatients);
    }
  }, [id]);

  const handleComplete = (patientId) => {
    const updatedPatient = updateFollowup(
      patientId,
      "Completed"
    );

    if (updatedPatient) {
      setMessage("Follow-up marked as completed.");

      if (id) {
        setPatient({ ...updatedPatient });
      } else {
        setPatients([...getAllPatients()]);
      }
    }
  };

  // --------------------------------
  // Single Patient Follow-up
  // --------------------------------

  if (id) {
    if (!patient) {
      return (
        <div className="min-h-screen bg-slate-100">
          <Navbar />

          <div className="flex">
            <Sidebar />

            <main className="flex-1 flex items-center justify-center p-6">
              <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
                <h2 className="text-xl font-bold text-slate-800">
                  Patient not found
                </h2>

                <Link
                  to="/followups"
                  className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
                >
                  ← Back to Follow-ups
                </Link>
              </div>
            </main>
          </div>
        </div>
      );
    }

    const followup = patient.followup || {};

    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">

              <Link
                to={`/patients/${patient.id}`}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← Back to Patient Profile
              </Link>

              <h1 className="text-3xl font-bold text-slate-800 mt-4">
                📅 Follow-up
              </h1>

              <p className="text-slate-500 mb-6">
                Manage patient follow-up
              </p>

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
                  {message}
                </div>
              )}

              <section className="bg-white rounded-xl border shadow-sm p-6">

                <h2 className="text-xl font-bold text-slate-800 mb-5">
                  Patient Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-5">

                  <div>
                    <p className="text-sm text-slate-500">
                      Patient ID
                    </p>

                    <p className="font-semibold mt-1">
                      {patient.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Name
                    </p>

                    <p className="font-semibold mt-1">
                      {patient.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Phone
                    </p>

                    <p className="font-semibold mt-1">
                      {patient.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Village
                    </p>

                    <p className="font-semibold mt-1">
                      {patient.village}
                    </p>
                  </div>

                </div>

                <div className="border-t mt-6 pt-6">

                  <h3 className="font-bold text-lg text-slate-800 mb-4">
                    Follow-up Details
                  </h3>

                  <div className="flex flex-wrap gap-4">

                    <span
                      className={`px-4 py-2 rounded-full font-semibold ${
                        followup.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {followup.status || "Pending"}
                    </span>

                    {followup.dueDate && (
                      <span className="px-4 py-2 bg-slate-100 rounded-full">
                        Due: {followup.dueDate}
                      </span>
                    )}

                  </div>

                </div>

                {followup.status !== "Completed" && (
                  <button
                    onClick={() => handleComplete(patient.id)}
                    className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    ✓ Mark Follow-up as Completed
                  </button>
                )}

                {followup.status === "Completed" && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 font-semibold text-center">
                    ✓ Follow-up completed successfully.
                  </div>
                )}

              </section>

            </div>
          </main>
        </div>
      </div>
    );
  }

  // --------------------------------
  // All Follow-ups
  // --------------------------------

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-800">
                📅 Follow-ups
              </h1>

              <p className="text-slate-500 mt-1">
                View and manage patient follow-ups.
              </p>
            </div>

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
                {message}
              </div>
            )}

            {patients.length === 0 ? (
              <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                <p className="text-slate-500">
                  No follow-ups available.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">

                {patients.map((item) => {
                  const followup = item.followup || {};

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border shadow-sm p-6"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                          <p className="text-sm text-blue-600 font-semibold">
                            {item.id}
                          </p>

                          <h2 className="text-xl font-bold text-slate-800">
                            {item.name}
                          </h2>

                          <p className="text-slate-500 mt-1">
                            {item.village} • {item.phone}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">

                          <span
                            className={`px-4 py-2 rounded-full font-semibold ${
                              followup.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {followup.status || "Pending"}
                          </span>

                          {followup.dueDate && (
                            <span className="text-sm text-slate-500">
                              Due: {followup.dueDate}
                            </span>
                          )}

                        </div>

                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-5">

                        <Link
                          to={`/patients/${item.id}`}
                          className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                        >
                          View Patient
                        </Link>

                        {followup.status !== "Completed" && (
                          <button
                            onClick={() =>
                              handleComplete(item.id)
                            }
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                          >
                            ✓ Complete Follow-up
                          </button>
                        )}

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default FollowUps;