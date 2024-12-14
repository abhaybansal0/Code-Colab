import dbconnect from '../../dbConfig/dbConfig.js'
import { Router } from 'express'
import User from '../../models/user.js'
import sendMail from '../../helpers/mailer.js'

const router = Router();


dbconnect();



router.post('/', async (req, res) => {

    try {
        const reqBody = req.body;

        const { usernameEmail } = reqBody;

        let user;
        
        //Validation
        const username = await User.findOne({ username: usernameEmail })
        const email = await User.findOne({ email: usernameEmail })
        
        
        if(username){
            user=username
        } else if(email) {
            user=email
        } else {
            return res.status(400).send({message: "User Does Not Exists"})
        }

        if(!user){
            return res.status(400).send({message: "User Not Found"})
        }

        const Mail = user.email
        console.log(user);
        
        
        //send Forgotpassword email
        const mailType = "RESET";
        const ID = user._id;
        await sendMail({email: Mail, mailtype: mailType, userId: ID})
        
        
        res.status(200).send({
            message: 'Forgotpassword Link Sent Successfully',
            success: true,
            useremail: Mail,
            userid: ID
        })
    


    } catch (error) {
        return res.status(400).send({error: error.message})
    }
})


export default router;