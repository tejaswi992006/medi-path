function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <h3>{title}</h3>
        <span className="stat-icon">{icon}</span>
      </div>

      <p>{value}</p>
    </div>
  );
}

export default StatCard;