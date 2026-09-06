import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    // Mock authentication
    localStorage.setItem("medipath_logged_in", "true");
    localStorage.setItem("medipath_username", username);
    localStorage.setItem("medipath_role", "health_worker");

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-5">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">
            🏥
          </div>

          <h1 className="text-4xl font-bold text-blue-700">
            MediPath
          </h1>

          <p className="text-slate-500 mt-2">
            Rural Health Worker Portal
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <h2 className="text-2xl font-bold">
            Health Worker Login
          </h2>

          <p className="text-slate-500 mt-1 mb-6">
            Sign in to access patient services
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="block font-medium mb-2">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Enter username"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
            >
              Login
            </button>

          </form>

          <div className="mt-5 bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
            <strong>Demo:</strong> Enter any username and password.
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;