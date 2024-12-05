// login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("loggedInUser", username);
        navigate("/editor");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <PageHeader
          title="Login"
          description="Welcome back"
          gradient="from-cyan-400 to-blue-500"
        />

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              disabled={isLoading}
              className="mt-1 w-full px-4 py-2 rounded-md bg-gray-200 text-gray-900 
                        disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isLoading}
              className="mt-1 w-full px-4 py-2 rounded-md bg-gray-200 text-gray-900
                        disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white 
                     py-2 px-4 rounded-md hover:opacity-90 disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-700 text-white 
                     py-2 px-4 rounded-md hover:opacity-90 disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}