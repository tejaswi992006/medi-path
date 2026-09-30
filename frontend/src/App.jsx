import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Facilities from "./pages/Facilities";
import Appointments from "./pages/Appointments";
import Referrals from "./pages/Referrals";
import Patients from "./pages/Patients";
import FollowUps from "./pages/Followups";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const [activePage, setActivePage] = useState("Dashboard");

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard  setActivePage={setActivePage}/>;
      case "Doctors":
        return <Doctors />;
      case "Facilities":
        return <Facilities />;
      case "Appointments":
        return <Appointments />;
      case "Referrals":
        return <Referrals />;
      case "Patients":
        return <Patients />;
      case "Follow-ups":
        return <FollowUps />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={() => {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
  }}
/>

      <main className="main-content">
        <Header />
        {renderPage()}
      </main>
    </div>
  );
}

export default App;