import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";

function Dashboard({ setActivePage }) {
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    referrals: 0,
    followUps: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [patients, appointments, referrals, followUps] =
          await Promise.all([
            fetch("http://127.0.0.1:8000/patients/", { headers }),
            fetch("http://127.0.0.1:8000/appointments/", { headers }),
            fetch("http://127.0.0.1:8000/referrals/", { headers }),
            fetch("http://127.0.0.1:8000/follow-ups/", { headers }),
          ]);

        if (
          !patients.ok ||
          !appointments.ok ||
          !referrals.ok ||
          !followUps.ok
        ) {
          throw new Error("Failed to fetch dashboard data");
        }

        const patientData = await patients.json();
        const appointmentData = await appointments.json();
        const referralData = await referrals.json();
        const followUpData = await followUps.json();

        // Dashboard statistics
        setStats({
          patients: patientData.length,
          appointments: appointmentData.length,
          referrals: referralData.length,
          followUps: followUpData.length,
        });

        // Create recent activity list
        const activities = [
          ...appointmentData.map((item) => ({
            icon: "📅",
            type: "Appointment",
            text: `Patient #${item.patient_id}`,
            status: item.status,
            date: item.appointment_date,
          })),

          ...referralData.map((item) => ({
            icon: "🔄",
            type: "Referral",
            text: `Patient #${item.patient_id}`,
            status: item.status,
            date: item.referral_date,
          })),

          ...followUpData.map((item) => ({
            icon: "🩺",
            type: "Follow-up",
            text: `Patient #${item.patient_id}`,
            status: item.status,
            date: item.follow_up_date,
          })),
        ];

        // Sort newest activity first
        activities.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Show only latest 5 activities
        setRecentActivity(activities.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Statistics cards
  const dashboardStats = [
    {
      title: "Total Patients",
      value: loading ? "..." : stats.patients,
      icon: "👥",
    },
    {
      title: "Appointments",
      value: loading ? "..." : stats.appointments,
      icon: "📅",
    },
    {
      title: "Referrals",
      value: loading ? "..." : stats.referrals,
      icon: "🔄",
    },
    {
      title: "Follow-ups",
      value: loading ? "..." : stats.followUps,
      icon: "🩺",
    },
  ];

  return (
    <section className="dashboard-page">

      {/* Dashboard heading */}
      <div className="page-title">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of hospital operations</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>

        <p className="activity-subtitle">
          Current hospital activity overview
        </p>

        <div className="activity-list">

          {recentActivity.map((activity, index) => (
            <div className="activity-item" key={index}>

              <span className="activity-icon">
                {activity.icon}
              </span>

              <div className="activity-content">
                <strong>{activity.type}</strong>

                <span>{activity.text}</span>

                <small>
                  {new Date(activity.date).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
  })}
</small>
              </div>

              <span
                className={`status-badge ${activity.status?.toLowerCase()}`}
              >
                {activity.status}
              </span>

            </div>
          ))}

        </div>

        {/* Empty activity message */}
        {!loading && recentActivity.length === 0 && (
          <p>No recent activity found.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">

        <h2>Quick Actions</h2>

        <p className="activity-subtitle">
          Quickly access important hospital sections
        </p>

        <div className="quick-actions-grid">

          <button
            className="quick-action-btn"
            onClick={() => setActivePage("Doctors")}
          >
            <span>👨‍⚕️</span>
            <strong>View Doctors</strong>
          </button>

          <button
            className="quick-action-btn"
            onClick={() => setActivePage("Patients")}
          >
            <span>👥</span>
            <strong>View Patients</strong>
          </button>

          <button
            className="quick-action-btn"
            onClick={() => setActivePage("Appointments")}
          >
            <span>📅</span>
            <strong>Appointments</strong>
          </button>

          <button
            className="quick-action-btn"
            onClick={() => setActivePage("Referrals")}
          >
            <span>🔄</span>
            <strong>Referrals</strong>
          </button>

        </div>
      </div>

    </section>
  );
}

export default Dashboard;