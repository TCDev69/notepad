import React, { useState } from "react";
import LoginPage from "./pages/login";
import NoteEditor from "./pages/editor";
import RegisterPage from "./pages/register";

function App() {
    const [token, setToken] = useState<string | null>(null);
    const [showRegister, setShowRegister] = useState(false);

    if (!token) {
        return showRegister ? (
            <RegisterPage onRegister={() => setShowRegister(false)} />
        ) : (
            <LoginPage onLogin={(jwt) => setToken(jwt)} />
        );
    }

    return <NoteEditor token={token} />;
}

export default App;
