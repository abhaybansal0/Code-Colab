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

        
        await Meeting.findOneAndUpdate({ meetId: meetId, username: username },
            {
                codebase: codebase
            })
            
            
        res.status(200).send({
                message: 'Meeting Data saved Successfully!',
            })
        
            

    } catch (error) {
        console.log('error', error)
        res.status(400).send({ error: "Only Admin Can Save The codebase" })
    }


})


export default router