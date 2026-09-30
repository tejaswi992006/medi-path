function Header() {
  return (
    <header className="header">
      <div>
        <h1>Hospital Dashboard</h1>
        <p>Welcome to MediPath Hospital Portal</p>
      </div>

      <div className="profile">
        <div className="profile-icon">H</div>

        <div>
          <strong>Hospital Admin</strong>
          <span>Administrator</span>
        </div>
      </div>
    </header>
  );
}

export default Header;