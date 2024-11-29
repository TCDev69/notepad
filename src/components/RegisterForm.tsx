import React, { useState } from "react";

export default function RegisterForm({ onRegister }: { onRegister: () => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("User registered successfully!");
            onRegister();
        } else {
            alert(data.message || "Failed to register.");
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow-md max-w-sm mx-auto">
            <h1 className="text-xl font-bold mb-4">Register</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <button
                onClick={handleRegister}
                className="block w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
                Register
            </button>
        </div>
    );
}
