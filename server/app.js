const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./config/authMiddleware');
const helmet = require("helmet");

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(express.static('public'));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', authMiddleware, require('./routes/tasks'));

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
