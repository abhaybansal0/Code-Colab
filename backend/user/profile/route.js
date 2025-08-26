import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import User from '../../models/user.js'
import Meeting from '../../models/meet.js'
import jwt from 'jsonwebtoken'

const router = Router();

dbconnect()

router.get('/', async (req, res) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send({ error: 'No token provided' });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.id;

        // Get user info
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Get user's meetings (both as admin and as editor)
        const meetings = await Meeting.find({
            $or: [
                { adminId: userId },
                { 'editors.userId': userId }
            ]
        }).sort({ createdAt: -1 });

        // Format meetings for frontend
        const formattedMeetings = meetings.map(meeting => ({
            meetId: meeting.meetId,
            roomName: meeting.roomName || 'Untitled Room',
            adminId: meeting.adminId,
            adminUsername: meeting.adminUsername,
            createdAt: meeting.createdAt,
            updatedAt: meeting.updatedAt,
            editors: meeting.editors || [],
            messages: meeting.messages || [],
            messageCount: meeting.messages?.length || 0,
            isOwner: meeting.adminId === userId
        }));

        res.status(200).send({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                admin: user.admin,
                createdAt: user.createdAt
            },
            meetings: formattedMeetings
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        
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
