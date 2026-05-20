import { Chrome, Github } from "lucide-react";
import type React from "react";

function OAuth2Buttons() {
  // backend
  const backendUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8083";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* backend: GET /oauth2/authorization/google */}
      <a
        href={`${backendUrl}/oauth2/authorization/google`}
        style={{ display: "block", textDecoration: "none" }}
      >
        <button
          type="button"
          style={oauthButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
            e.currentTarget.style.borderColor = "#9ca3af";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.borderColor = "#d1d5db";
          }}
        >
          <Chrome style={{ width: "20px", height: "20px", color: "#4285f4" }} />
          <span>Sign up with Google</span>
        </button>
      </a>

      {/* backend: GET /oauth2/authorization/github */}
      <a
        href={`${backendUrl}/oauth2/authorization/github`}
        style={{ display: "block", textDecoration: "none" }}
      >
        <button
          type="button"
          style={oauthButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
            e.currentTarget.style.borderColor = "#9ca3af";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.borderColor = "#d1d5db";
          }}
        >
          <Github style={{ width: "20px", height: "20px", color: "#1a2332" }} />
          <span>Sign up with GitHub</span>
        </button>
      </a>
    </div>
  );
}

const oauthButtonStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1.5px solid #d1d5db",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
  color: "#374151",
  transition: "all 0.2s ease",
  fontFamily: "inherit",
};

export default OAuth2Buttons;
