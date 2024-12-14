import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import Meeting from '../../models/meet.js'
import jwt from 'jsonwebtoken'


const router = Router();

dbconnect()

router.post('/', async (req, res) => {

    try {

        const token = req.cookies.token;
        const { meetId, codebase } = req.body;

        if(!token){
            return res.status(400).send({message: 'Only Admin Can Save The codebase'})
        }

        const decodedToken =  jwt.verify(token, process.env.TOKEN_SECRET)

        const adminId = decodedToken.id;



        const updatedMeetDetails = await Meeting.findOneAndUpdate({ meetId: meetId, adminId: adminId },
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