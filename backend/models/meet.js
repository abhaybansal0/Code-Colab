import mongoose from "mongoose";

const meetSchema = new mongoose.Schema({
    meetId: {
        type: String,
        required: [true, 'Please provide a meeting id'],
        unique: true
    },
    adminId: {
        type: String,
        required: [true, 'Please provide a admin id']
    },
    codebase: {
        type: String
    },
    editors: [{
        userId: String,
        username: String,
        assignedBy: String,
        assignedAt: { type: Date, default: Date.now }
    }],
    messages: [{
        content: String,
        user: String,
        timestamp: { type: Date, default: Date.now }
    }]
}) 


const Meeting = mongoose.models.meetings || mongoose.model('meetings', meetSchema);

export default Meeting