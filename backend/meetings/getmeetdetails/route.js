import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import Meeting from '../../models/meet.js'
import jwt from 'jsonwebtoken'

const router = Router();

dbconnect()

router.post('/', async (req, res) => {
    try {
        const { meetId, username } = req.body;
        const token = req.cookies.token;

        if (!token) {
            const meeting = await Meeting.findOne({ meetId: meetId })
            if (!meeting) {
                return res.status(400).send({ message: 'No such meeting found' })
            }
            return res.status(200).send({
                message: 'Meeting details fetched successfully!',
                            meeting: {
                meetId: meeting.meetId,
                roomName: meeting.roomName,
                adminId: meeting.adminId,
                adminUsername: meeting.adminUsername,
                codebase: meeting.codebase,
                editors: meeting.editors,
                messages: meeting.messages,
                createdAt: meeting.createdAt,
                updatedAt: meeting.updatedAt
            },
                userRole: 'viewer',
                isOwner: false
            })
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
        const userId = decodedToken.id;

        console.log('Fetching meeting details for:', meetId);
        
        const meeting = await Meeting.findOne({ meetId: meetId })

        if (!meeting) {
            return res.status(400).send({ message: 'No such meeting found' })
        }

        // Check if current user is owner
        const isOwner = meeting.adminId === userId;
        
        // Check if current user is an assigned editor
        const isEditor = meeting.editors.some(editor => editor.username === username);
        
        // Determine user role
        let userRole = 'viewer';
        if (isOwner) {
            userRole = 'owner';
        } else if (isEditor) {
            userRole = 'editor';
        }

        // Get user details for editors
        const editors = meeting.editors.map(editor => ({
            userId: editor.userId,
            username: editor.username,
            assignedBy: editor.assignedBy,
            assignedAt: editor.assignedAt
        }));

        res.status(200).send({
            message: 'Meeting details fetched successfully!',
            meeting: {
                meetId: meeting.meetId,
                roomName: meeting.roomName,
                adminId: meeting.adminId,
                adminUsername: meeting.adminUsername,
                codebase: meeting.codebase,
                editors: editors,
                messages: meeting.messages,
                createdAt: meeting.createdAt,
                updatedAt: meeting.updatedAt
            },
            userRole: userRole,
            isOwner: isOwner
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message })
    }
})

export default router
