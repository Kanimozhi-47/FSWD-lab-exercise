const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb://localhost:27017/leaveDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
  
// Schema
const leaveSchema = new mongoose.Schema({
    empId: String,
    type: String,
    count: Number
});

const Leave = mongoose.model("Leave", leaveSchema);

// Route: Apply Leave
app.post("/apply", async (req, res) => {
    const { empId, type, start, end, reason } = req.body;

    // Default leave count
    const maxLeaves = 5;  // separate 5 for casual, 5 for medical

    // find if record exists
    let leaveDoc = await Leave.findOne({ empId, type });

    if (!leaveDoc) {
        leaveDoc = new Leave({ empId, type, count: maxLeaves });
    }

    if (leaveDoc.count <= 0) {
        return res.json({ message: "No leaves left!", remaining: 0 });
    }

    // reduce leave count
    leaveDoc.count -= 1;
    await leaveDoc.save();

    res.json({
        message: "Leave applied successfully!",
        remaining: leaveDoc.count
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
