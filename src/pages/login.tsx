import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
        localStorage.setItem("loggedInUser", username); // Salva il nome utente
        alert("Login successful");
      } else {
        alert(`Error: ${data.message}`);
      }

      navigate("/editor"); // Redirect to editor on success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <PageHeader
          title="Login"
          description="Access your notes"
          gradient="from-purple-400 to-pink-500"
        />

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 rounded-md bg-gray-200 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 rounded-md bg-gray-200 text-gray-900"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white py-2 px-4 rounded-md hover:opacity-90"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-700 text-white py-2 px-4 rounded-md hover:opacity-90"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
