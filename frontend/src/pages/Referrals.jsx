import { useEffect, useState } from "react";

function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReferrals = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "http://127.0.0.1:8000/referrals/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch referrals");
      }

      const data = await response.json();

      setReferrals(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load referrals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  return (
    <section className="page-section">
      <div className="page-title">
        <div>
          <h2>Referrals</h2>
          <p>Patient referral information</p>
        </div>

        <button className="refresh-btn" onClick={fetchReferrals}>
          Refresh
        </button>
      </div>

      {loading && <p>Loading referrals...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && referrals.length > 0 && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient ID</th>
                <th>From Facility</th>
                <th>To Facility</th>
                <th>Referred By</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Referral Date</th>
              </tr>
            </thead>

            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.id}>
                  <td>{referral.id}</td>
                  <td>{referral.patient_id}</td>
                  <td>{referral.from_facility_id}</td>
                  <td>{referral.to_facility_id}</td>
                  <td>{referral.referred_by}</td>
                  <td>{referral.reason}</td>
                  <td>
                     <span className={`status-badge ${referral.status?.toLowerCase()}`}>
                       {referral.status}
                      </span>
                  </td>
                  <td>{referral.referral_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && referrals.length === 0 && (
        <p>No referrals found.</p>
      )}
    </section>
  );
}

export default Referrals;