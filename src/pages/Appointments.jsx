import { useEffect, useState } from "react";
import {
  getAppointments,
  createAppointment,
} from "../services/appointmentApi";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    patientId: "",
    facilityId: "1",
    appointmentDate: "",
    reason: "",
  });

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.patientId) {
      setError("Please enter Patient ID.");
      return;
    }

    if (!form.appointmentDate) {
      setError("Please select appointment date and time.");
      return;
    }

    try {
      setCreating(true);

      await createAppointment({
        patientId: form.patientId,
        facilityId: form.facilityId,
        appointmentDate: form.appointmentDate,
        reason: form.reason,
      });

      setSuccess("Appointment created successfully.");

      setForm({
        patientId: "",
        facilityId: "1",
        appointmentDate: "",
        reason: "",
      });

      await loadAppointments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Could not create appointment."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="medipath-page">
      <div className="max-w-6xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Appointments
          </h1>

          <p className="text-slate-500 mt-1">
            Schedule and view patient appointments.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        <div className="medipath-card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Schedule Appointment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient ID
              </label>

              <input
                type="number"
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                placeholder="Example: 1"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Facility
              </label>

              <select
                name="facilityId"
                value={form.facilityId}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="1">
                  Medi-Path Demo PHC
                </option>

                <option value="2">
                  Medi-Path Demo District Hospital
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Appointment Date & Time
              </label>

              <input
                type="datetime-local"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Reason
              </label>

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter reason for appointment"
                rows="3"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="medipath-primary-button disabled:opacity-50"
            >
              {creating
                ? "Scheduling..."
                : "Schedule Appointment"}
            </button>

          </form>
        </div>

        <div className="medipath-card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Existing Appointments
          </h2>

          {loading ? (
            <p className="text-slate-500">
              Loading appointments...
            </p>
          ) : appointments.length === 0 ? (
            <p className="text-slate-500">
              No appointments found.
            </p>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">

                    <div>
                      <p className="font-semibold text-slate-800">
                        Appointment #{appointment.id}
                      </p>

                      <p className="text-sm text-slate-600">
                        Patient ID: {appointment.patient_id}
                      </p>

                      <p className="text-sm text-slate-600">
                        Doctor ID: {appointment.doctor_id}
                      </p>

                      <p className="text-sm text-slate-600">
                        Facility ID: {appointment.facility_id}
                      </p>
                    </div>

                    <span className="medipath-status-pending">
                      {appointment.status}
                    </span>

                  </div>

                  <div className="mt-3 text-sm text-slate-600">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(
                        appointment.appointment_date
                      ).toLocaleString()}
                    </p>

                    {appointment.reason && (
                      <p className="mt-1">
                        <strong>Reason:</strong>{" "}
                        {appointment.reason}
                      </p>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Appointments;