import express from "express";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.middleware";
import { Request, Response } from "express";

const router = express.Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const student = await User.findOne({ email });

    if (!student || !(await bcrypt.compare(password, student.password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    const token = jwt.sign({ id: student._id, role: "student" }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

    res.json({ token });
});

router.get("/tasks", authMiddleware, async (req, res) => {
    const tasks = await Task.find({ studentId: req.body.user.id });
    res.json(tasks);
});

router.patch("/task/:taskId", authMiddleware, async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;
    const { status } = req.body;
    console.log(status);
    if (!["pending", "completed", "overdue"].includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
    }

    const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

    if (!task) {
        res.status(404).json({ message: "Task not found" });
        return
    }

    res.json(task);
});

export default router;
