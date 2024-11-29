import React from "react";
import LoginForm from "../components/LoginForm";

export default function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <LoginForm onLogin={onLogin} />
    </div>
  );
}
