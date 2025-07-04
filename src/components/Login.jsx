import React from "react";

export default function Login({ token, isValidToken, onChange, onLogin }) {
  return (
    <div className="login-section">
      <input
        id="access_token"
        type="text"
        value={token}
        onChange={(e) => onChange(e.target.value)}
      />
      <button id="login" onClick={onLogin} disabled={!isValidToken}>
        LOGIN
      </button>
      <div>Access Token: {token}</div>
    </div>
  );
}
