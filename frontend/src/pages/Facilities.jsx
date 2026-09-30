import { useEffect, useState } from "react";

function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/facilities/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch facilities");
        }

        return response.json();
      })
      .then((data) => {
        setFacilities(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load facilities");
        setLoading(false);
      });
  }, []);

  return (
    <section className="page-section">

      {/* Page heading */}
      <div className="page-title">
        <div>
          <h2>Facilities</h2>
          <p>Hospital units and service information</p>
        </div>
      </div>

      {loading && <p>Loading facilities...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && facilities.length > 0 && (
        <div className="facility-grid">

          {facilities.map((facility) => (
            <div className="facility-card" key={facility.id}>

              {/* Facility header */}
              <div className="facility-header">

                <div className="facility-icon">
                  🏥
                </div>

                <div>
                  <h3>{facility.name}</h3>

                  <span className="facility-type">
                    {facility.facility_type}
                  </span>
                </div>

              </div>

              {/* Facility details */}
              <div className="facility-details">

                <div className="facility-detail">
                  <span className="facility-detail-icon">📍</span>

                  <div>
                    <small>Address</small>
                    <p>{facility.address}</p>
                  </div>
                </div>

                <div className="facility-detail">
                  <span className="facility-detail-icon">📌</span>

                  <div>
                    <small>District</small>
                    <p>{facility.district}</p>
                  </div>
                </div>

                <div className="facility-detail">
                  <span className="facility-detail-icon">🌐</span>

                  <div>
                    <small>State</small>
                    <p>{facility.state}</p>
                  </div>
                </div>

                <div className="facility-detail">
                  <span className="facility-detail-icon">☎</span>

                  <div>
                    <small>Phone</small>
                    <p>{facility.phone}</p>
                  </div>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {!loading && !error && facilities.length === 0 && (
        <p>No facilities found.</p>
      )}

    </section>
  );
}

export default Facilities