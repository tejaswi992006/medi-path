import { useEffect, useState } from "react";

const TRACKING_STAGES = [
  "Referral Created",
  "Referral Accepted",
  "Appointment Scheduled",
  "Consultation",
  "Follow-up",
  "Treatment Completed",
];

function FollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFollowUps = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "http://127.0.0.1:8000/follow-ups/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch follow-ups");
      }

      const data = await response.json();
      setFollowUps(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load follow-ups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  // Find the current stage number
  const getCurrentStageIndex = (trackingStage) => {
    const index = TRACKING_STAGES.indexOf(trackingStage);

    // If backend sends an unknown stage,
    // start from the first stage.
    return index === -1 ? 0 : index;
  };

  return (
    <section className="page-section followups-page">

      {/* PAGE HEADER */}
      <div className="page-title">
        <div>
          <h2>Patient Journey Tracking</h2>
          <p>
            Track each patient's referral and treatment journey
          </p>
        </div>

        <button className="refresh-btn" onClick={fetchFollowUps}>
          ↻ Refresh
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="tracking-message">
          Loading patient journeys...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="tracking-error">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && followUps.length === 0 && (
        <div className="tracking-message">
          No patient follow-ups found.
        </div>
      )}

      {/* TRACKING CARDS */}
      {!loading && !error && followUps.length > 0 && (
        <div className="tracking-list">

          {followUps.map((followUp) => {
            const currentStageIndex = getCurrentStageIndex(
              followUp.tracking_stage
            );

            return (
              <div className="tracking-card" key={followUp.id}>

                {/* CARD HEADER */}
                <div className="tracking-card-header">
                  <div>
                    <span className="tracking-label">
                      PATIENT
                    </span>

                    <h3>
                      Patient #{followUp.patient_id}
                    </h3>
                  </div>

                  <div className="tracking-status">
                    {followUp.status}
                  </div>
                </div>

                {/* REFERRAL INFO */}
                <div className="tracking-info">
                  <div>
                    <span>Follow-up ID</span>
                    <strong>#{followUp.id}</strong>
                  </div>

                  <div>
                    <span>Referral ID</span>
                    <strong>
                      {followUp.referral_id
                        ? `#${followUp.referral_id}`
                        : "Not assigned"}
                    </strong>
                  </div>

                  <div>
                    <span>Doctor ID</span>
                    <strong>#{followUp.doctor_id}</strong>
                  </div>

                  <div>
                    <span>Follow-up Date</span>
                    <strong>
                      {new Date(
                        followUp.follow_up_date
                      ).toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* AMAZON STYLE TRACKER */}
                <div className="journey-tracker">

                  {TRACKING_STAGES.map((stage, index) => {

                    const isCompleted =
                      index < currentStageIndex;

                    const isCurrent =
                      index === currentStageIndex;

                    return (
                      <div
                        className={`journey-stage ${
                          isCompleted ? "completed" : ""
                        } ${isCurrent ? "current" : ""}`}
                        key={stage}
                      >

                        {/* ICON */}
                        <div className="journey-icon">
                          {isCompleted
                            ? "✓"
                            : isCurrent
                            ? "●"
                            : "○"}
                        </div>

                        {/* TEXT */}
                        <div className="journey-content">
                          <strong>{stage}</strong>

                          {isCurrent && (
                            <span className="current-label">
                              Current stage
                            </span>
                          )}
                        </div>

                        {/* CONNECTING LINE */}
                        {index < TRACKING_STAGES.length - 1 && (
                          <div
                            className={`journey-line ${
                              index < currentStageIndex
                                ? "completed-line"
                                : ""
                            }`}
                          />
                        )}

                      </div>
                    );
                  })}

                </div>

                {/* CURRENT STAGE */}
                <div className="current-stage-box">
                  <span>Current Patient Status</span>

                  <strong>
                    {followUp.tracking_stage}
                  </strong>
                </div>

                {/* NOTES */}
                {followUp.notes && (
                  <div className="tracking-notes">
                    <span>Doctor's Notes</span>
                    <p>{followUp.notes}</p>
                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default FollowUps;