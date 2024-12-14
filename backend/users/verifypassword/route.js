import { Router } from "express";
import dbconnect from "../../dbConfig/dbConfig.js";
import User from "../../models/user.js";

const router = Router();

dbconnect()

router.post('/forgot', async (req, res) => {

    try {



        const token = req.query.token;

        const user = await User.findOne({ forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() } })

        if (!user) {
            return res.status(400).send({ message: "Invalid Verification" })
        }

        user.isVerified = true;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined

        await user.save();

        

        res.status(200).send({ message: "Verification Successfull" , _id: user._id})

    } catch (error) {
        console.log('Error in forgotVerification', error);

    }

})


export default router