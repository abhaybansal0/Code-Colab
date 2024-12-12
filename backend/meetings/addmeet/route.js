import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import Meeting from '../../models/meet.js'


const router = Router();

dbconnect()

router.post('/', async (req, res) => {

    try {

        const { meetId, adminId, codebase} = req.body;
        console.log(meetId, adminId, codebase);
        
        
        const meetexists = await Meeting.findOne({meetId: meetId, adminId: adminId})
        if(meetexists) {
            res.status(400).send({error: 'Meeting Already Exists'})
            return
        }
        

        const newMeet = await new Meeting({
            meetId: meetId,
            adminId: adminId,
            codebase: codebase
        })
        

        const savedMeeting = await newMeet.save();

        console.log(savedMeeting);

        res.status(200).send({
            message: 'Meeting Saved Successfully!',
            savedMeeting
        })
        



    } catch (error) {
        console.log(error);
        
        res.status(400).send({error: error.message})
    }

    
})


export default router