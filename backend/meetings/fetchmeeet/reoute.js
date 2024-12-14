import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import Meeting from '../../models/meet.js'
import jwt from 'jsonwebtoken'


const router = Router();

dbconnect()

router.post('/', async (req, res) => {

    try {

        
        const { meetId } = req.body;


        console.log(meetId);
        
        const savedCode = await Meeting.findOne({ meetId: meetId })

        if(!savedCode){
            return res.status(400).send({message: 'No such meeting found'})
        }        

        // console.log('Updated Meeting details', savedCode);
            
        res.status(200).send({
                message: 'Data Fetched  Successfully!',
                savedCode
            })
        
            

    } catch (error) {
        res.status(400).send({ error: "No such meeting found" })
    }


})


export default router