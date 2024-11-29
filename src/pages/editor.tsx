import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function NoteEditor({ token }: { token: string }) {
  const [editorValue, setEditorValue] = useState("");
  const [files, setFiles] = useState([]);

  const saveNote = async () => {
    const response = await fetch("http://localhost:5000/save-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: editorValue }),
    });

    const data = await response.json();
    if (data.message) {
      alert("Note saved!");
      fetchFiles();
    }
  };

  const fetchFiles = async () => {
    const response = await fetch("http://localhost:5000/get-files", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setFiles(data.files);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <ReactQuill value={editorValue} onChange={setEditorValue} />
      <button onClick={saveNote}>Save Note</button>
      <div>
        <h2>Your Notes:</h2>
        <ul>
          {files.map((file) => (
            <li key={file.filename}>{file.filename}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
