"use client";

import { useState } from "react";
import { loginAdmin } from "@/app/actions";

export default function AdminLogin() {
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(password);
    if (!success) {
      alert("비밀번호가 틀렸습니다.");
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <h2>관리자 로그인</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
          <button type="submit">로그인</button>
        </form>
      </div>

      <style jsx>{`
        .admin-login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          background-color: #f8fafc;
        }
        .login-card {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .login-card h2 {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: #333;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        input {
          padding: 12px 15px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          outline: none;
        }
        input:focus {
          border-color: #0088cc;
        }
        button {
          padding: 12px;
          background-color: #0088cc;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
        }
        button:hover {
          background-color: #0077b3;
        }
      `}</style>
    </div>
  );
}
