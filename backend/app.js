const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const simpleGit = require("simple-git");
const path = require("path");
const fs = require("fs");
const { exec } = require('child_process');
require("dotenv").config();

const app = express();
const port = 5000;
const repoPath = path.join(__dirname, "repo");
const gitUrl = "https://github.com/TCDev69/np-usr.git";
const authToken = process.env.GITHUB_PAT;

const git = simpleGit();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// Clona il repository se non esiste già
(async function setupGitRepo() {
    if (!fs.existsSync(repoPath)) {
        const gitWithAuth = `https://${authToken}@${gitUrl.split("https://")[1]}`;
        await git.clone(gitWithAuth, repoPath);
    }
})();

// Carica gli utenti dal file users.json
const loadUsers = () => {
    const usersFile = path.join(__dirname, "users.json");
    return fs.existsSync(usersFile) ? JSON.parse(fs.readFileSync(usersFile, "utf8")) : {};
};

// Endpoint di login
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users[username];

    if (user && user.password === password) {
        return res.status(200).json({ message: "Login successful" });
    }

    return res.status(401).json({ message: "Invalid username or password" });
});

// Endpoint di registrazione
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const users = loadUsers();

    if (users[username]) {
        return res.status(400).json({ message: "User already exists." });
    }

    users[username] = { username, password };
    fs.writeFileSync(path.join(__dirname, "users.json"), JSON.stringify(users, null, 2));

    const userDir = path.join(repoPath, "users", username);
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    res.status(201).json({ message: "User registered successfully." });
});

app.post("/save-file", (req, res) => {
    const { username, title, content } = req.body;
  
    if (!username || !title || !content) {
      return res.status(400).json({ message: "Missing required fields." });
    }
  
    const userDir = path.join(__dirname, "repo/users", username);
  
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
  
    const filePath = path.join(userDir, `${title}.md`);
  
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error saving file." });
      }
      res.status(200).json({ message: "File saved successfully." });
    });
  });


// Endpoint per ottenere la lista dei file di un utente
app.get("/files/:username", (req, res) => {
    const { username } = req.params;

    const userDir = path.join(repoPath, "users", username);
    if (!fs.existsSync(userDir)) {
        return res.status(404).json({ message: "User directory not found." });
    }

    const files = fs.readdirSync(userDir).filter(file => file.endsWith(".md"));
    res.status(200).json({ files });
});

// Endpoint per ottenere tutti i file degli utenti
app.get("/get-files", (req, res) => {
    const users = loadUsers();
    const userFiles = [];

    for (const username in users) {
        const userDir = path.join(repoPath, "users", username);
        if (fs.existsSync(userDir)) {
            const files = fs.readdirSync(userDir).filter(file => file.endsWith(".md"));
            userFiles.push({ username, files });
        }
    }

    res.status(200).json(userFiles);
});

// Endpoint per salvare una nota con il titolo come nome del file
app.post("/save-file", (req, res) => {
    const { content, username, title } = req.body;

    // Verifica che content, username, e title siano presenti
    if (!content || !username || !title) {
        return res.status(400).json({ message: "Content, username, and title are required." });
    }

    // Percorso della directory dell'utente
    const userDir = path.join(__dirname, "repo", "users", username);

    // Verifica se la cartella dell'utente esiste, altrimenti la crea
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    // Percorso del file con il titolo come nome del file
    const filePath = path.join(userDir, `${title}.md`);

    // Scrittura del file
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).json({ message: "Failed to save note." });
        }

        res.status(200).json({ message: "Note saved successfully." });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
