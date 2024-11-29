import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";

import "react-quill/dist/quill.snow.css"; // Mantieni il tema Snow di Quill

export default function Bbase2() {
  const [editorValue, setEditorValue] = useState<string>("");

  const handleEditorChange = (value: string) => {
    setEditorValue(value);
  };

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
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
            <div className="space-y-4">
              <ReactQuill
                value={editorValue}
                onChange={handleEditorChange}
                theme="snow"
                modules={modules}
                placeholder="Inizia a scrivere..."
                className="border p-4 rounded-lg bg-gray-100 text-black"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
