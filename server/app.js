const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const authMiddleware = require("./config/authMiddleware");
const helmet = require("helmet");

const app = express();

connectDB();
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

app.get("/style.css", function(req,res){
    res.sendFile(__dirname + "/public/style.css")
})
app.get("/script.js", function(req,res){
    res.sendFile(__dirname + "/public/script.js")
})

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", authMiddleware, require("./routes/tasks"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
