import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import Meeting from '../../models/meet.js'
import jwt from 'jsonwebtoken'

const router = Router();

dbconnect()

router.put('/', async (req, res) => {
    try {
        const { meetId, roomName } = req.body;

        // Get token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send({ error: 'No token provided' });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.id;

        // Find the meeting
        const meeting = await Meeting.findOne({ meetId });
        if (!meeting) {
            return res.status(404).send({ error: 'Meeting not found' });
        }

        // Check if user is the owner
        if (meeting.adminId !== userId) {
            return res.status(403).send({ error: 'Only the owner can rename the room' });
        }

        // Validate room name
        if (!roomName || roomName.trim().length === 0) {
            return res.status(400).send({ error: 'Room name cannot be empty' });
        }

        if (roomName.trim().length > 50) {
            return res.status(400).send({ error: 'Room name cannot exceed 50 characters' });
        }

        // Update the room name
        meeting.roomName = roomName.trim();
        meeting.updatedAt = new Date();
        await meeting.save();

        res.status(200).send({
            message: 'Room name updated successfully',
            roomName: meeting.roomName
        });

    } catch (error) {
        console.error('Room name update error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ error: 'Invalid token' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ error: 'Token expired' });
        }

        res.status(500).send({ error: 'Internal server error' });
    }
});

export default router
