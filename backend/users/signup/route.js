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


        const emailExists = await User.findOne({email});
        if(emailExists) {
            return res.status(400).send({message: 'Username already Exists'});
        }

        const usernameNotAv = await User.findOne({username})
        if(usernameNotAv){
            return res.status(400).send({message: 'Username Not Available!'})
        }
        

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)

        let admin=false
        if(email === "abhaybansal127@gmail.com" || email === "27abhay.bansal@gmail.com"){
            admin = true;
        }
        
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            isAdmin: admin
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