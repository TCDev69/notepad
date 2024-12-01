import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import "react-quill-new/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";

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
    [{ table: true }]
  ],
  autoformat: {
    matching: {
      hashtag: /(?:^|\s)#[a-zA-Z]+/g,
      mention: /(?:^|\s)@[a-zA-Z]+/g
    }
  },
  betterTable: {
    operationMenu: {
      items: {
        unmergeCells: {
          text: 'Unmerge cells'
        }
      }
    }
  },
  imageCompress: {
    quality: 0.7,
    maxWidth: 1000,
    maxHeight: 1000,
    imageType: 'image/jpeg',
    debug: true
  },
  imageDrop: true,
  imageResize: {
    displaySize: true,
    modules: ['Resize', 'DisplaySize', 'Toolbar']
  },
  magicUrl: true,
  markdownShortcuts: {},
  tableUI: true,
};

interface NoteEditorProps {
  token: string;
  username: string;
}

export default function NoteEditor({ token }: { token: string }) {
  const [editorValue, setEditorValue] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);

  const fetchFiles = async () => {
    const username = localStorage.getItem("loggedInUser");
    if (!username) {
      alert("User not logged in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/files/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
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
    async function initQuill() {
      try {
        const Quill = ReactQuill.Quill;
        
        const [
          Autoformat,
          BetterTable,
          ImageCompress,
          ImageDrop,
          MagicUrl,
          MarkdownShortcuts,
          TableUI
        ] = await Promise.all([
          import('quill-autoformat'),
          import('quill-better-table'),
          import('quill-image-compress'),
          import('quill-image-drop-module'),
          import('quill-magic-url'),
          import('quill-markdown-shortcuts'),
          import('quill-table-ui')
        ]);

        // Register modules
        Quill.register({
          'modules/autoformat': Autoformat.default,
          'modules/better-table': BetterTable.default,
          'modules/imageCompress': ImageCompress.default,
          'modules/imageDrop': ImageDrop.default,
          'modules/magicUrl': MagicUrl.default,
          'modules/markdownShortcuts': MarkdownShortcuts.default,
          'modules/tableUI': TableUI.default,
          'formats/table': BetterTable.default.TableCell,
          'formats/table-cell': BetterTable.default.TableCell,
          'formats/table-row': BetterTable.default.TableRow,
          'formats/table-col': BetterTable.default.TableCol
        }, true);

        setEditorLoaded(true);
      } catch (error) {
        console.error('Error loading Quill modules:', error);
      }
    }

    initQuill();
    fetchFiles();
  }, [token]);

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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username, title, content })
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
          <Card>
            <div className="space-y-4">
              <ReactQuill
                value={editorValue}
                onChange={setEditorValue}
                theme="snow"
                placeholder="Inizia a scrivere..."
                className="border p-4 rounded-lg bg-gray-100 text-black"
                modules={modules}
              />
            </div>
          </Card>
        </div>
        <div className="my-6" />
        <Card>
          <h2 className="text-xl font-bold mb-4">Your Notes</h2>
          <ul className="list-disc ml-6">
            {files.map((file, index) => (
              <li key={index} className="text-sm">
                {file}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
