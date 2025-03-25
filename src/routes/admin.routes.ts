import express from "express";
import { User } from "../models/user.model";
import { Task } from "../models/task.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.middleware";
import { Request, Response } from "express";

const router = express.Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (email !== "admin@admin.com" || password !== "admin") {
        res.status(403).json({ message: "Invalid admin credentials" });
        return;
    }

    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

    res.json({ token });
});

router.post("/add-student", authMiddleware, async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const student = await User.create({ name, email, password: hashedPassword, role: "student" });
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: "User already exists" });
    }
});

router.post("/assign-task", authMiddleware, async (req, res) => {
    const { studentId, title, description, dueDate } = req.body;
    console.log(studentId, title, description, dueDate);
    try {
        const task = await Task.create({ studentId, title, description, dueDate, status: "pending" });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: "Error assigning task" });
    }
});

export default router;
