import { Router } from 'express'
import dbconnect from '../../dbConfig/dbConfig.js';
import User from '../../models/user.js';

const router = Router();

dbconnect();


router.post('/verifyme', async (req, res) => {
    // console.log('The user shoudl be verified');

    try {        

        const reqBody = req.body;

        const token  = req.query.token;
        
        

        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } })
        console.log(user);
        
        if (!user) {
            res.status(400).send({ msg: 'No user found or Is Verified' });
            return
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        res.status(200).send({
            message: 'Email verified Successfully',
            success: true
        })


    } catch (error) {
        console.log('Error in Verification', error);

    }

})

export default router
