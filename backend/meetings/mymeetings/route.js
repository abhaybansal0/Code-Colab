import { Router } from "express";
import User from "../../models/user.js";
import Meeting from "../../models/meet.js";
import dbconnect from "../../dbConfig/dbConfig.js";
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken'





const router = Router();

router.use(cookieParser());

dbconnect()





router.post('/', async (req, res) => {
    try {

        const token = req.cookies.token || "";
        

        if(token === "") {
            res.status(400).send({error: "User Not loged In"})
         }
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

 
         const userId = decodedToken.id;
         
         if(!userId) {
            res.status(400).send({error: "User Not found or Not loged In"})
         }

        console.log(userId);

        const meetings = await Meeting.find({adminId: userId})
        console.log("meetings are:",meetings);

        res.status(200).send({
            message: "Meetings Found",
            meetings: meetings
        })
    


    } catch (error) {
        console.log(error)
        res.status(400).send({message: "Info Not Found"})
    }
})



export default router