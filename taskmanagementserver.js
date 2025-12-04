const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/taskDB");

// Schema
const taskSchema = new mongoose.Schema({
  title: String,
  status: String
});
const Task = mongoose.model("Task", taskSchema);

// Add
app.post("/add", async (req, res) => {
  await Task({ title: req.body.title, status: "Pending" }).save();
  res.send("Added");
});

// View
app.get("/tasks", async (req, res) => {
  res.send(await Task.find());
});

// Update
app.put("/update/:id", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.send("Updated");
});

// Start
app.listen(5000);
