import mongoose from "mongoose";

const meetSchema = new mongoose.Schema({
    meetId: {
        type: String,
        required: [true, 'Please provide a meeting id'],
        unique: true
    },
    roomName: {
        type: String,
        default: 'Untitled Room'
    },
    adminId: {
        type: String,
        required: [true, 'Please provide a admin id']
    },
    adminUsername: {
        type: String,
        required: [true, 'Please provide admin username']
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
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})


const Meeting = mongoose.models.meetings || mongoose.model('meetings', meetSchema);

export default Meeting