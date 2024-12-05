// Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        
        if (password.length < 8) {
          errors.push("Password must be at least 8 characters long");
        }
        if (!/[A-Z]/.test(password)) {
          errors.push("Password must contain at least one uppercase letter");
        }
        if (!/[a-z]/.test(password)) {
          errors.push("Password must contain at least one lowercase letter");
        }
        if (!/[0-9]/.test(password)) {
          errors.push("Password must contain at least one number");
        }
        if (!/[!@#$%^&*]/.test(password)) {
          errors.push("Password must contain at least one special character (!@#$%^&*)");
        }
        
        return errors;
      };

      const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
    
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            setError(passwordErrors.join("\n"));
            return;
        }
    
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    username: formData.username, 
                    password: formData.password 
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Registration successful");
                navigate("/login");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            setError("Registration failed");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
            <div className="max-w-md mx-auto">
                <PageHeader
                    title="Register"
                    description="Create your account"
                    gradient="from-green-400 to-blue-500"
                />

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
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
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 rounded-md bg-gray-200 text-gray-900"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 rounded-md bg-gray-200 text-gray-900"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-4 rounded-md hover:opacity-90 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="w-full bg-gradient-to-r from-gray-500 to-gray-700 text-white py-2 px-4 rounded-md hover:opacity-90"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}