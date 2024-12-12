import User from '../models/user.js';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config();

const sendMail = async ({ email, mailtype, userId }) => {
    try {


        const salt = await bcryptjs.genSalt(10);
        const hashedToken = await bcryptjs.hash(userId.toString(), salt);
        console.log(hashedToken);
        


        
        if (mailtype === 'VERIFY') {
            // console.log('sendEmail am running');
            console.log('Testing for emailing' ,userId);
            
            await User.findOneAndUpdate({_id: userId},
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }
            )

        } else if (mailtype === 'RESET') {
            await User.findOneAndUpdate(userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                }
            )
        }





        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "46ba51f17093c3",
                pass: "eed00bd912e884"
            }
        });



        const mailOptions = {
            from: 'abhay@abhay.com', // sender address
            to: email,
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<p>Click <a href='${process.env.DOMAIN}/verification?token=${hashedToken}'> Here</a>
            to ${mailtype === 'VERIFY' ? 'Verify Your email' : 'Reset Your Password'} 
            or copy paste the link in your browser
            <br> ${process.env.DOMAIN}/verification?token=${hashedToken}
            </p>`, // html body
        };


        const mailResponse = await transport.sendMail(mailOptions)





        console.log('Till here');
        return mailResponse;


    } catch (error) {
        console.log("Could not send Mial to user: " + email);
        console.log(error);

    }

}

export default sendMail