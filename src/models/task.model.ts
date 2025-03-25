import mongoose, { Schema} from "mongoose";

const taskSchema = new Schema({
    studentId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    title: String,
    description: String,
    dueDate: Date,
    status: {
        type: String,
        enum: ['pending', 'overDue', 'completed'],
        default: 'pending'
    },
})

export const Task = mongoose.model("Task", taskSchema)