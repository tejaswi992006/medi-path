import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // Login to the real FastAPI backend
      const loginResponse = await api.post("/auth/login", {
        email: email.trim(),
        password: password,
      });

      const token = loginResponse.data.access_token;

      if (!token) {
        throw new Error("No access token received.");
      }

      // Save JWT token
      localStorage.setItem("token", token);

      // Get currently logged-in user
      const userResponse = await api.get("/auth/me");

      const user = userResponse.data;

      // Save user information
      localStorage.setItem("medipath_logged_in", "true");
      localStorage.setItem(
        "medipath_username",
        user.name || user.email || email
      );
      localStorage.setItem("medipath_role", String(user.role_id || ""));
      localStorage.setItem(
        "medipath_user_id",
        String(user.id || "")
      );
      localStorage.setItem(
        "medipath_facility_id",
        String(user.facility_id || "")
      );

      // Go to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(
          "Unable to connect to the backend. Make sure the FastAPI server is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9f8] flex items-center justify-center p-5">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0f766e] flex items-center justify-center shadow-lg">
            <span className="text-4xl">🏥</span>
          </div>

          <h1 className="text-4xl font-bold text-[#123c3a] mt-4">
            MediPath
          </h1>

          <p className="text-slate-500 mt-2">
            Rural Health Worker Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#dfeae7] rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-[#123c3a]">
            Health Worker Login
          </h2>

          <p className="text-slate-500 mt-1 mb-6">
            Sign in to access patient services
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block font-semibold text-[#173330] mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Enter your email"
                className="w-full border border-[#dfeae7] rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#2dd4bf] focus:border-[#0f766e]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-[#173330] mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                className="w-full border border-[#dfeae7] rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#2dd4bf] focus:border-[#0f766e]"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f766e] hover:bg-[#115e59] disabled:bg-slate-400 text-white font-semibold py-3 rounded-xl transition-all"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

          </form>

          {/* Backend mode */}
          <div className="mt-5 bg-[#f0fdfa] border border-[#99f6e4] p-3 rounded-xl text-sm text-[#0f766e]">
            <strong>Connected Mode:</strong> Login uses the MediPath FastAPI backend.
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
