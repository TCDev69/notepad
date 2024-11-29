import React from "react";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage({ onRegister }: { onRegister: () => void }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <RegisterForm onRegister={onRegister} />
        </div>
    );
}
