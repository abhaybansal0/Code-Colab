import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import Meeting from '../../models/meet.js'


const router = Router();

dbconnect()

router.post('/', async (req, res) => {

    try {

        const { meetId, codebase, username } = req.body;

        if(!username){
            return res.status(400).send({message: 'Username is required'})
        }



        const updatedMeetDetails = await Meeting.findOneAndUpdate({ meetId: meetId, adminId: username },
            {
                codebase: codebase
            })

        if(!updatedMeetDetails){
            return res.status(400).send({message: 'Only Admin Can Save The codebase'})
        }

        // console.log('Updated Meeting details', updatedMeetDetails);
            
        res.status(200).send({
                message: 'Meeting Data saved Successfully!',
                updatedMeetDetails
            })
        
            

    } catch (error) {
        res.status(400).send({ error: "Only Admin Can Save The codebase" })
    }


})


export default router