import React, { useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill-new";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import "react-quill-new/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";
import Quill from "quill";
import ImageCompress from "quill-image-compress";
import { Attributor } from "parchment";

const Size = Quill.import('formats/size');
Size.whitelist = [
  '8px', '10px', '12px', '14px', '16px',
  '18px', '20px', '24px', '32px'
];
Quill.register(Size, true);

Quill.register("modules/imageCompress", ImageCompress);

const modules = {
  toolbar: {
    container: [
      [{ font: [] }],
      [{ size: ["8px", "10px", "12px", "14px", "16px", "18px", "20px", "24px", "32px"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  },
  imageCompress: {
    quality: 0.7,
    maxWidth: 1000,
    maxHeight: 1000,
    imageType: "image/jpeg",
    debug: false,
  },
};
export default function NoteEditor({ token }: { token: string }) {
  const [editorValue, setEditorValue] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async () => {
    const username = localStorage.getItem("loggedInUser");
    if (!username) {
      alert("User not logged in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/files/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to fetch files.");
      }
    } catch (err) {
      alert("Error fetching files.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [token]);

  const loadNote = useCallback(
    async (filename: string) => {
      const username = localStorage.getItem("loggedInUser");
      if (!username) {
        alert("User not logged in.");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5000/files/${username}/${filename}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const content = await response.text();

          setTimeout(() => {
            setEditorValue(content);
            setTitle(filename.replace(".md", ""));
            setIsLoading(false);
          }, 500);
        } else {
          alert("Failed to load note.");
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
        alert("Error loading note.");
        setIsLoading(false);
      }
    },
    [token]
  );

  const saveNote = async () => {
    const username = localStorage.getItem("loggedInUser");
    const content = editorValue;

    if (!username || !content || !title) {
      console.error("Missing required fields");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("http://localhost:5000/save-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, title, content }),
      });

      if (response.ok) {
        console.log("Note saved successfully!");
        await fetchFiles();
      } else {
        console.error("Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Editor di testo"
          description="Scrivi le tue note qui"
          gradient="from-gray-400 to-cyan-500"
        />

        <div className="space-y-8">
          <Card>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 rounded p-3 text-white font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none mb-4"
              placeholder="Enter Title..."
            />
            <button
              onClick={saveNote}
              disabled={isSaving}
              className="w-full px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Note"}
            </button>
          </Card>
            <div className="space-y-4">
              <ReactQuill
                value={editorValue}
                onChange={setEditorValue}
                theme="snow"
                placeholder="Inizia a scrivere..."
                className="border text-black border-transparent backdrop-blur rounded-lg shadow-xl"
                modules={modules}
              />
            </div>
        </div>
        <div className="my-6" />
        <Card>
          <h2 className="text-xl font-bold mb-4">Your Notes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <button
                key={index}
                className={`p-4 bg-gray-700 rounded-lg hover:bg-gray-600 
                  transition-colors duration-200 text-center font-semibold 
                  border border-gray-700 hover:border-cyan-500
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => loadNote(file)}
                disabled={isLoading}
              >
                {file.replace(".md", "")}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
