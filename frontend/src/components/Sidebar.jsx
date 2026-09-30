function Sidebar({ activePage, setActivePage, onLogout }) {
  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Doctors", icon: "⚕" },
    { name: "Facilities", icon: "⌂" },
    { name: "Appointments", icon: "▣" },
    { name: "Referrals", icon: "↗" },
    { name: "Follow-ups", icon: "◷" },
    { name: "Patients", icon: "♙" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">+</div>

        <div>
          <h2>MediPath</h2>
          <span>Healthcare Portal</span>
        </div>
      </div>

      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${
              activePage === item.name ? "active" : ""
            }`}
            onClick={() => setActivePage(item.name)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-help">
          <div className="help-icon">?</div>

          <div>
            <strong>Need Help?</strong>
            <span>Contact support</span>
          </div>
        </div>

        <button className="logout" onClick={onLogout}>
          <span className="logout-icon">↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;