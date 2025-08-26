import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import Meeting from '../../models/meet.js'

const router = Router();

dbconnect()

router.post('/', async (req, res) => {
    try {
        const { meetId, codebase, username } = req.body;
        
        if (!username) {
            return res.status(400).send({ message: "Username is required" })
        }

        console.log('Creating anonymous meeting:', { meetId, codebase, username });
        
        const meetexists = await Meeting.findOne({ meetId: meetId })
        if (meetexists) {
            return res.status(400).send({ error: 'Meeting Already Exists' })
        }

        const newMeet = await new Meeting({
            meetId: meetId,
            adminId: username, // Use username as adminId
            codebase: codebase
        })
        
        const savedMeeting = await newMeet.save();

        console.log('Anonymous meeting created:', savedMeeting);

        res.status(200).send({
            message: 'Anonymous Meeting Created Successfully!',
            savedMeeting
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message })
    }
})

export default router
