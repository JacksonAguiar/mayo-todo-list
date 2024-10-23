const express = require("express");
const Task = require("../models/Task");
const router = express.Router();
const redis = require("redis");
const sanitize = require("mongo-sanitize");

const redisClient = redis.createClient({
  password: "Cln98ru9aqFRBmfQYUzWbE1Hr00gAIPp",
  socket: {
    host: "redis-18658.c84.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 18658,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

router.post("/add", async (req, res) => {
  try {
    var { title } = req.body;
    title = sanitize(title);

    if (!title) {
      return res.status(400).json({ message: "O título não pode ser vazio." });
    }

    const task = new Task({ title });
    await task.save();

    redisClient.del("tasks");
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    task.status = task.status === "pending" ? "complete" : "pending";
    await task.save();

    redisClient.del("tasks");
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    redisClient.del("tasks");
    res.json({ message: "Tarefa removida." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  const tasks = await redisClient.get("tasks");
  //   redisClient.get("tasks", async (err, tasks) => {
  if (tasks) {
    return res.json(JSON.parse(tasks));
  } else {
    try {
      const tasks = await Task.find();
      redisClient.set("tasks", JSON.stringify(tasks));

      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  //   });
});

module.exports = router;
