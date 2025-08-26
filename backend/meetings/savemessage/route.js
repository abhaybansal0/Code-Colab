import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import Meeting from '../../models/meet.js'

const router = Router();

dbconnect()

router.post('/', async (req, res) => {
    try {
        const { meetId, content, user, timestamp } = req.body;

        console.log('Saving message:', { meetId, content, user, timestamp });
        
        const meeting = await Meeting.findOne({ meetId: meetId })

        if (!meeting) {
            return res.status(400).send({ message: 'No such meeting found' })
        }

        // Add message to messages array
        meeting.messages.push({
            content: content,
            user: user,
            timestamp: new Date(timestamp)
        });

        // Keep only last 100 messages to prevent database bloat
        if (meeting.messages.length > 100) {
            meeting.messages = meeting.messages.slice(-100);
        }

        await meeting.save();

        res.status(200).send({
            message: 'Message saved successfully!',
            savedMessage: meeting.messages[meeting.messages.length - 1]
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message })
    }
})

export default router
