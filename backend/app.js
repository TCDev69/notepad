const express = require("express");
const simpleGit = require("simple-git");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const git = simpleGit();
const SECRET_KEY = "your_secret_key"; // Cambia con un valore sicuro
const REPO_PATH = "./repo";
const USERS_DIR = "./repo/users"; // Cartelle utente nel repo

app.use(bodyParser.json());

// Inizializza il repository Git
const initGitRepo = async () => {
  if (!fs.existsSync(REPO_PATH)) {
    fs.mkdirSync(REPO_PATH, { recursive: true });
    await git.cwd(REPO_PATH).init();
  }
};
initGitRepo();

// Fake database per gli utenti
const users = [];

// Utility: Genera un token JWT
const generateToken = (username) => {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
};

// Utility: Autenticazione JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send("Invalid token.");
  }
};

const usersFile = path.join(__dirname, "users.json"); // File per salvare gli utenti

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Controlla se l'utente esiste già
    const users = JSON.parse(fs.readFileSync(usersFile, "utf8") || "{}");
    if (users[username]) {
        return res.status(400).json({ message: "User already exists." });
    }

    // Crea una password hashata
    const hashedPassword = await bcrypt.hash(password, 10);

    // Registra l'utente
    users[username] = { id: uuidv4(), password: hashedPassword };
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    // Crea la directory Git per l'utente
    const userDir = path.join(__dirname, "repo", "users", username);
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    res.status(201).json({ message: "User registered successfully." });
});

// Login utente
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid username or password." });
  }

  const token = generateToken(username);
  res.json({ token });
});

// Salva un file Markdown
app.post("/save-file", authenticate, async (req, res) => {
  const { content } = req.body;
  const username = req.user.username;

  const userDir = path.join(USERS_DIR, username);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  const filename = uuidv4() + ".md";
  const filePath = path.join(userDir, filename);
  fs.writeFileSync(filePath, content);

  try {
    await git.cwd(REPO_PATH).add(filePath);
    await git.cwd(REPO_PATH).commit(`Saved by ${username}`);
    res.json({ message: "File saved successfully.", filename });
  } catch (err) {
    res.status(500).json({ message: "Error saving file.", error: err.message });
  }
});

// Ottieni la lista dei file
app.get("/get-files", authenticate, (req, res) => {
  const username = req.user.username;
  const userDir = path.join(USERS_DIR, username);

  if (!fs.existsSync(userDir)) {
    return res.json({ files: [] });
  }

  const files = fs.readdirSync(userDir).map((file) => ({
    filename: file,
    path: path.join(userDir, file),
  }));

  res.json({ files });
});

// Avvia il server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
