const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const sanitize = require('mongo-sanitize');

router.post('/register', async (req, res) => {
  var { username, password } = req.body;

  username = sanitize(username);
  password = sanitize(password);

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Nome de usuário já existe.' });
    }

    user = new User({ username, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, '30549ceb13eb9feb9d08d4d573598fcc667c3947', { expiresIn: '1d' });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  var { username, password } = req.body;

  username = sanitize(username);
  password = sanitize(password);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user._id }, '30549ceb13eb9feb9d08d4d573598fcc667c3947', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
