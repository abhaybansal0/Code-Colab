import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import User from '../../models/user.js'
import bcryptjs from 'bcryptjs'
import sendMail from '../../helpers/mailer.js'

const router = Router();


dbconnect();



router.post('/verify', async (req, res) => {

    try {
        const reqBody = req.body;

        const { username, email, password } = reqBody;

        //Validation


        const user = await User.findOne({email});

        if(user) {
            return res.status(200).send({error: 'User already Exists'});
        }
        

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)


        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        })
        
        const savedUser = await newUser.save();
        
        console.log(savedUser);
        
        console.log('Validation for the details Done');
        
        
        //send Verification email
        const mailType = "VERIFY";
        const ID = savedUser._id;
        await sendMail({email, mailtype: mailType, userId: ID})
        
        
        res.status(200).send({
            message: 'User Rgistered Successfully',
            success: true,
            savedUser
        })
        
        
        


    } catch (error) {
        return res.status(400).send({error: error.message})
    }
})


export default router;