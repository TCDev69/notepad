import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import Editor from "./pages/Editor";
import NoteEditor from "./pages/test";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/test" element={<NoteEditor />} />
    </Routes>
  );
}

export default App;
