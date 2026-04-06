import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function TestRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password, role });
      login(data.access_token, data.refresh_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail?.message || "Register failed");
    }
    setIsLoading(false);
  };

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      width: "100vw", 
      backgroundColor: "#000",
      overflow: "hidden",
      position: "fixed",
      top: 0,
      left: 0
    }}>
      {/* Left Side - Simple Characters */}
      <div style={{ 
        flex: 1, 
        backgroundColor: "#f5f5f5", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center"
      }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#8B5CF6"
          }} />
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#1F2937"
          }} />
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#FB923C"
          }} />
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#FDE047"
          }} />
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div style={{ 
        flex: 1, 
        backgroundColor: "#000", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "0 32px"
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ fontSize: "32px", fontWeight: 600, color: "white", marginBottom: "8px" }}>
            Financial Dashboard
          </div>
          <div style={{ fontSize: "16px", color: "#9CA3AF", marginBottom: "48px" }}>
            Create your account to get started.
          </div>

          {error && (
            <div style={{ 
              padding: "12px", 
              fontSize: "14px", 
              color: "#ef4444", 
              backgroundColor: "#450a0a", 
              border: "1px solid #7f1d1d",
              borderRadius: "8px",
              marginBottom: "24px"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: 500, 
                color: "white", 
                marginBottom: "8px" 
              }}>
                Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "48px",
                  backgroundColor: "#1F2937",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  color: "white",
                  fontSize: "14px",
                  padding: "0 12px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: 500, 
                color: "white", 
                marginBottom: "8px" 
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "48px",
                  backgroundColor: "#1F2937",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  color: "white",
                  fontSize: "14px",
                  padding: "0 12px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: 500, 
                color: "white", 
                marginBottom: "8px" 
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    height: "48px",
                    backgroundColor: "#1F2937",
                    borderRadius: "8px",
                    border: "1px solid #374151",
                    color: "white",
                    fontSize: "14px",
                    padding: "0 40px 0 12px",
                    boxSizing: "border-box"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  {showPassword ? "👁" : "👁"}
                </button>
              </div>
            </div>

            <div>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: 500, 
                color: "white", 
                marginBottom: "8px" 
              }}>
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: "100%",
                  height: "48px",
                  backgroundColor: "#1F2937",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  color: "white",
                  fontSize: "14px",
                  padding: "0 12px",
                  boxSizing: "border-box",
                  cursor: "pointer"
                }}
              >
                <option value="viewer" style={{ backgroundColor: "#1F2937", color: "white" }}>Viewer</option>
                <option value="analyst" style={{ backgroundColor: "#1F2937", color: "white" }}>Analyst</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: "#6366F1",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer"
              }}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>

            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <span style={{ fontSize: "14px", color: "#9CA3AF" }}>
                Already have an account?{" "}
              </span>
              <button
                onClick={() => navigate('/login')}
                style={{ 
                  color: "#6366F1", 
                  background: "none",
                  border: "none",
                  textDecoration: "none",
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
