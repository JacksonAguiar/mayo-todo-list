const express = require('express');
const Task = require('../models/Task');
const router = express.Router();
const redis = require('redis');

const redisClient = redis.createClient();

router.post('/add', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'O título não pode ser vazio.' });
    }

    const task = new Task({ title });
    await task.save();

    redisClient.del('tasks'); // Limpar cache no Redis
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    task.status = task.status === 'pending' ? 'complete' : 'pending';
    await task.save();

    redisClient.del('tasks');
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    redisClient.del('tasks');
    res.json({ message: 'Tarefa removida.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  redisClient.get('tasks', async (err, tasks) => {
    if (tasks) {
      return res.json(JSON.parse(tasks));
    } else {
      try {
        const tasks = await Task.find();
        redisClient.setex('tasks', 3600, JSON.stringify(tasks)); // Cache por 1h
        res.json(tasks);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  });
});

module.exports = router;
