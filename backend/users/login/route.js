import { Router } from 'express'
import dbconnect from '../../dbConfig/dbConfig.js';
import User from '../../models/user.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

dotenv.config();

const router = Router();

router.use(cookieParser());

dbconnect();

router.post('/', async (req, res) => {
    // console.log('The user shoudl be LogedIn');

    try {


        const reqBody = await req.body;

        const { email, password } = reqBody;


        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(400).send({ error: 'No such user Found' })
        }

        console.log(user);

        const validpassword = await bcryptjs.compare(password, user.password)


        if (!validpassword) {
            res.status(400).send({ error: 'Check Your Credentials' })
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        
        
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, 
            { expiresIn: '1d' }
        )
        // console.log(tokenData, token); // token is the encrypted for of it, key value pair 
        
        // const response = res.status(200).send({message: 'Logged in Successfully!', success: true})

        res.cookie("token", token, {
            httpOnly: true
        })

        res.status(200).send({message: 'Logged in Successfully!', success: true})

        // return response

    } catch (error) {
        console.log('Error Loging in', error);

    }

})

export default router
