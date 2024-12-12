import { Router } from 'express'
import dbconnect from '../../dbConfig/dbConfig.js';
import User from '../../models/user.js';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';

dotenv.config();

const router = Router();

router.use(cookieParser());

dbconnect();


router.post('/', async (req, res) => {

    try {   

        
        const token = req.cookies.token || "";
        
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
        
        if(token === "") {
           res.status(400).send({error: "User Not found or Not loged In"})
        }

        const userId = decodedToken.id;
        
        if(!userId) {
           res.status(400).send({error: "User Not found or Not loged In"})
        }
    
        console.log(userId);
        
         const user = await User.findOne({_id: userId}).select("-password")
     
         // Check if theres no user
     
     
         return res.status(200).send({ message: "User found", data: user})

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }
        process.on("unhandledRejection", (reason, promise) => {
            console.error("Unhandled Rejection:", reason);
            // You might log the error or terminate the process safely
          });
        console.log('failed to fetch data from token', error);
        res.status(400).json({ message: error});
        
    }


})

export default router
