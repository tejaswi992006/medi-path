import { useEffect, useState } from "react";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/appointments/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to fetch appointments");
        }

        setAppointments(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <section className="page-section">
      <div className="page-title">
        <div>
          <h2>Appointments</h2>
          <p>Upcoming patient visits</p>
        </div>
      </div>

      {loading && <p>Loading appointments...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && appointments.length > 0 && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient ID</th>
                <th>Doctor ID</th>
                <th>Facility ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patient_id}</td>
                  <td>{appointment.doctor_id}</td>
                  <td>{appointment.facility_id}</td>
                  <td>{appointment.appointment_date}</td>
                  <td>
                     <span className={`status-badge ${appointment.status?.toLowerCase()}`}>
                       {appointment.status}
                      </span>
                  </td>
                  <td>{appointment.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <p>No appointments found.</p>
      )}
    </section>
  );
}

export default Appointments;