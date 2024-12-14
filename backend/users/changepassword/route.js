import { Router } from "express";
import User from "../../models/user.js";
import dbconnect from "../../dbConfig/dbConfig.js";
import bcryptjs from 'bcryptjs'


const router = Router()

dbconnect()

router.post('/', async (req, res) => {


    try {

        const reqBody = req.body;

        const { id, password } = reqBody


        if (!id || !password) {
            return res.status(400).send({ message: "Invalid Password Change" })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const user = await User.findOneAndUpdate({ _id: id}, {
            password: hashedPassword
        })

        console.log(user);

        if(!user){
            return res.status(400).send({message: "Server issue should be seeing"})
        }
        
        res.status(200).send({
            message: "Password Changed Successfully"
        })




    } catch (error) {
        console.log('Error in changePassword', error);

    }
})




export default router