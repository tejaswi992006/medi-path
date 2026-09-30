import { useEffect, useState } from "react";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/patients/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        return response.json();
      })
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load patients");
        setLoading(false);
      });
  }, []);

  const formatDate = (date) => {
    if (!date) return "Not available";

    const formattedDate = new Date(date);

    return formattedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="page-section">
      <div className="page-title">
        <div>
          <h2>Patients</h2>
          <p>Manage and view registered patient records</p>
        </div>

        <div className="patient-count">
          <span>{patients.length}</span>
          <small>Total Patients</small>
        </div>
      </div>

      {loading && (
        <div className="page-message">
          <p>Loading patient records...</p>
        </div>
      )}

      {error && (
        <div className="page-message error-message">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && patients.length > 0 && (
        <div className="patient-table-card">
          <div className="table-header">
            <div>
              <h3>Patient Records</h3>
              <p>Currently registered patients</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Facility</th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="patient-info">
                        <div className="patient-avatar">
                          P{patient.id}
                        </div>

                        <div>
                          <strong>Patient #{patient.id}</strong>
                          <span>Patient ID: {patient.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="date-text">
                        {formatDate(patient.date_of_birth)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`gender-badge ${patient.gender?.toLowerCase()}`}
                      >
                        {patient.gender || "Not specified"}
                      </span>
                    </td>

                    <td>
                      <span className="phone-text">
                        {patient.phone || "Not available"}
                      </span>
                    </td>

                    <td>
                      <span className="address-text">
                        {patient.address || "Not available"}
                      </span>
                    </td>

                    <td>
                      <span className="facility-badge">
                        Facility #{patient.facility_id}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && patients.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No Patients Found</h3>
          <p>There are currently no registered patients.</p>
        </div>
      )}
    </section>
  );
}

export default Patients;