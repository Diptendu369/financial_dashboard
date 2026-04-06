import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const orangeRef = useRef(null);
  const yellowRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.access_token, data.refresh_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail?.message || "Login failed");
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  const calculateEyePosition = (characterRef) => {
    if (!characterRef.current) return { x: 0, y: 0 };
    
    const rect = characterRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let targetX = mouseX;
    let targetY = mouseY;
    
    // If typing password, look to the left
    if (isTypingPassword) {
      targetX = centerX - 100;
      targetY = centerY;
    }
    
    const deltaX = targetX - centerX;
    const deltaY = targetY - centerY;
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(8, Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 10);
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
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
      {/* Left Side - Animated Characters */}
      <div style={{ 
        flex: 1, 
        backgroundColor: "#f5f5f5", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Characters Container */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {/* Purple Character */}
          <div 
            ref={purpleRef}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#8B5CF6",
              position: "relative",
              animation: "float 3s ease-in-out infinite"
            }}
          >
            {/* Eyes - white circles with pupils */}
            <div style={{
              position: "absolute",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "white",
              top: "25px",
              left: "15px",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "black",
                top: "4px",
                left: "4px",
                transform: `translate(${calculateEyePosition(purpleRef).x}px, ${calculateEyePosition(purpleRef).y}px)`,
                transition: "transform 0.1s ease-out"
              }} />
            </div>
            <div style={{
              position: "absolute",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "white",
              top: "25px",
              right: "15px",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "black",
                top: "4px",
                left: "4px",
                transform: `translate(${calculateEyePosition(purpleRef).x}px, ${calculateEyePosition(purpleRef).y}px)`,
                transition: "transform 0.1s ease-out"
              }} />
            </div>
          </div>

          {/* Black Character */}
          <div 
            ref={blackRef}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#1F2937",
              position: "relative",
              animation: "float 3.5s ease-in-out infinite"
            }}
          >
            {/* Eyes - white circles with pupils */}
            <div style={{
              position: "absolute",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "white",
              top: "25px",
              left: "18px",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "black",
                top: "3.5px",
                left: "3.5px",
                transform: `translate(${calculateEyePosition(blackRef).x}px, ${calculateEyePosition(blackRef).y}px)`,
                transition: "transform 0.1s ease-out"
              }} />
            </div>
            <div style={{
              position: "absolute",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "white",
              top: "25px",
              right: "18px",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "black",
                top: "3.5px",
                left: "3.5px",
                transform: `translate(${calculateEyePosition(blackRef).x}px, ${calculateEyePosition(blackRef).y}px)`,
                transition: "transform 0.1s ease-out"
              }} />
            </div>
          </div>

          {/* Orange Character */}
          <div 
            ref={orangeRef}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#FB923C",
              position: "relative",
              animation: "float 4s ease-in-out infinite"
            }}
          >
            {/* Eyes - black dots that move */}
            <div style={{
              position: "absolute",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "black",
              top: "28px",
              left: "20px",
              transform: `translate(${calculateEyePosition(orangeRef).x}px, ${calculateEyePosition(orangeRef).y}px)`,
              transition: "transform 0.1s ease-out"
            }} />
            <div style={{
              position: "absolute",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "black",
              top: "28px",
              right: "20px",
              transform: `translate(${calculateEyePosition(orangeRef).x}px, ${calculateEyePosition(orangeRef).y}px)`,
              transition: "transform 0.1s ease-out"
            }} />
          </div>

          {/* Yellow Character */}
          <div 
            ref={yellowRef}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#FDE047",
              position: "relative",
              animation: "float 3.2s ease-in-out infinite"
            }}
          >
            {/* Eyes - black dots that move */}
            <div style={{
              position: "absolute",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "black",
              top: "28px",
              left: "20px",
              transform: `translate(${calculateEyePosition(yellowRef).x}px, ${calculateEyePosition(yellowRef).y}px)`,
              transition: "transform 0.1s ease-out"
            }} />
            <div style={{
              position: "absolute",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "black",
              top: "28px",
              right: "20px",
              transform: `translate(${calculateEyePosition(yellowRef).x}px, ${calculateEyePosition(yellowRef).y}px)`,
              transition: "transform 0.1s ease-out"
            }} />
            {/* Mouth - horizontal line */}
            <div style={{
              position: "absolute",
              width: "20px",
              height: "2px",
              backgroundColor: "black",
              bottom: "25px",
              left: "50%",
              transform: "translateX(-50%)"
            }} />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
            Welcome back!
          </div>
          <div style={{ fontSize: "16px", color: "#9CA3AF", marginBottom: "48px" }}>
            Please enter your details.
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
                Email
              </label>
              <input
                type="email"
                placeholder="anna@gmail.com"
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
                  onFocus={() => setIsTypingPassword(true)}
                  onBlur={() => setIsTypingPassword(false)}
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

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", marginBottom: "24px" }}>
              <label style={{ 
                display: "flex", 
                alignItems: "center", 
                fontSize: "14px", 
                color: "#9CA3AF",
                cursor: "pointer"
              }}>
                <input
                  type="checkbox"
                  style={{ marginRight: "8px" }}
                />
                Remember for 30 days
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{ 
                  color: "#6366F1", 
                  background: "none", 
                  border: "none", 
                  fontSize: "14px",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Forgot password?
              </button>
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
              {isLoading ? "Signing in..." : "Log in"}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: "16px"
              }}
            >
              Log in with Google
            </button>

            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <span style={{ fontSize: "14px", color: "#9CA3AF" }}>
                Don't have an account?{" "}
              </span>
              <button
                type="button"
                onClick={() => window.location.href = '/register'}
                style={{ 
                  color: "#6366F1", 
                  background: "none",
                  border: "none",
                  textDecoration: "none",
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
