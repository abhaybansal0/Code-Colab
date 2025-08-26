import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import Meeting from '../../models/meet.js'

const router = Router();

dbconnect()

router.post('/', async (req, res) => {
    try {
        const { meetId, targetUserId, targetUsername, newRole, ownerUsername } = req.body;

        console.log('Assigning role:', { meetId, targetUserId, targetUsername, newRole, ownerUsername });
        
        const meeting = await Meeting.findOne({ meetId: meetId })

        if (!meeting) {
            return res.status(400).send({ message: 'No such meeting found' })
        }

        // Check if current user is owner (by username)
        if (meeting.adminId !== ownerUsername) {
            return res.status(403).send({ message: 'Only meeting owner can assign roles' })
        }

        if (newRole === 'editor') {
            // Add user to editors array if not already there
            const editorExists = meeting.editors.some(editor => editor.username === targetUsername);
            if (!editorExists) {
                meeting.editors.push({
                    userId: targetUsername, // Using username as userId for now
                    username: targetUsername,
                    assignedBy: ownerUsername,
                    assignedAt: new Date()
                });
            }
            
            // Update role request status to approved
            meeting.roleRequests.forEach(req => {
                if (req.username === targetUsername && req.status === 'pending') {
                    req.status = 'approved';
                }
            });
        } else if (newRole === 'viewer') {
            // Remove user from editors array
            meeting.editors = meeting.editors.filter(editor => editor.username !== targetUsername);
            
            // Update role request status to denied
            meeting.roleRequests.forEach(req => {
                if (req.username === targetUsername && req.status === 'pending') {
                    req.status = 'denied';
                }
            });
        }

        await meeting.save();

        res.status(200).send({
            message: 'Role assigned successfully!',
            meeting: meeting
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message })
    }
})

export default router
