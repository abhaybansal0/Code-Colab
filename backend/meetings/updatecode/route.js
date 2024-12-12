import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import Meeting from '../../models/meet.js'


const router = Router();

dbconnect()

router.post('/', async (req, res) => {

    try {

        const { meetId, adminId, codebase } = req.body;

        const updatedMeetDetails = await Meeting.findOneAndUpdate({ meetId: meetId, adminId: adminId },
            {
                codebase: codebase
            })


        console.log('Updated Meeting details', updatedMeetDetails);
    

        res.status(200).send({
            message: 'Meeting Data saved Successfully!',
            updatedMeetDetails
        })


    } catch (error) {
        res.status(400).send({ error: error.message })
    }


})


export default router