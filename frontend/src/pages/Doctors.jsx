import { useEffect, useState } from "react";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/doctors/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        return response.json();
      })
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load doctors");
        setLoading(false);
      });
  }, []);

  return (
    <section className="page-section">

      {/* Page heading */}
      <div className="page-title">
        <div>
          <h2>Doctors</h2>
          <p>Available consulting staff</p>
        </div>
      </div>

      {loading && <p>Loading doctors...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && doctors.length > 0 && (
        <div className="doctor-grid">

          {doctors.map((doctor) => (
            <div className="doctor-card" key={doctor.id}>

              {/* Doctor avatar */}
              <div className="doctor-avatar">
                {doctor.name?.charAt(0).toUpperCase()}
              </div>

              {/* Doctor information */}
              <div className="doctor-info">

                <h3>Dr. {doctor.name}</h3>

                <span className="doctor-role">
                  Consulting Doctor
                </span>

                <div className="doctor-details">

                  <div className="doctor-detail">
                    <span className="detail-icon">✉</span>
                    <span>{doctor.email}</span>
                  </div>

                  <div className="doctor-detail">
                    <span className="detail-icon">🏥</span>
                    <span>
                      Facility ID: {doctor.facility_id ?? "Not assigned"}
                    </span>
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {!loading && !error && doctors.length === 0 && (
        <p>No doctors found.</p>
      )}

    </section>
  );
}

export default Doctors;