import { Router } from 'express'
import dbconnect from '../../dbConfig/dbConfig.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

dotenv.config();

const router = Router();

router.use(cookieParser());

dbconnect();

router.get('/', async (req, res) => {
    // console.log('The user shoudl be LogedIn');

    try {

        res.cookie("token", "", {
            httpOnly: true,
            experies: Date(0)
        })

        res.status(200).send({ message: "Logout Successful!"})
        

    } catch (error) {
        console.log('Error Loging out', error);

    }

})

export default router
