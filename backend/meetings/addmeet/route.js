import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import Meeting from '../../models/meet.js'
import jwt from 'jsonwebtoken'


const router = Router();

dbconnect()

router.post('/', async (req, res) => {

    try {

        const token = req.cookies.token;
        const { meetId, codebase} = req.body;
        console.log(meetId, token, codebase);
        

        if(!token){
            return res.status(400).send({message: "Please Log In First"})
        }
        
        
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

        const adminId = decodedToken.id; 
        const adminUsername = decodedToken.username || 'Anonymous';
        console.log(adminId, adminUsername);
        
        
        
        const meetexists = await Meeting.findOne({meetId: meetId})
        if(meetexists) {
           return  res.status(400).send({error: 'Meeting Already Exists this is only for server side'})
        }

        const newMeet = await new Meeting({
            meetId: meetId,
            adminId: adminId,
            adminUsername: adminUsername,
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