import User from '../models/user.js';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config();

const sendMail = async ({ email, mailtype, userId }) => {
    try {


        const salt = await bcryptjs.genSalt(10);
        console.log(userId);
        
        const hashedToken = await bcryptjs.hash(userId.toString(), salt);
        console.log(hashedToken);


        if (mailtype === 'VERIFY') {
            // console.log('sendEmail am running');
            console.log('Testing for emailing', userId);


            await User.findOneAndUpdate({ _id: userId },
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
            host: "smtp.gmail.com", //"sandbox.smtp.mailtrap.io"
            port: 587,
            secure: false,
            auth: {
                user:   process.env.GOOGLE_EMAIL, // "46ba51f17093c3"
                pass:   process.env.GOOGLE_PASSWORD  // "eed00bd912e884"
            }
        });



        const mailOptions = {
            from: 'codecolab.app@gmail.com', // sender address
            to: email,
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body


            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
              <p>Dear User,</p>
              <p>
                Click the link below to ${mailtype === 'VERIFY' ? 'verify your email' : 'reset your password'}:
              </p>
              <p style="margin: 20px 0;">
                <a 
                  href="${process.env.DOMAIN}/${mailtype === 'VERIFY' ? 'verification' : 'passverify'}?token=${hashedToken}" 
                  style="display: inline-block; padding: 10px 15px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
                  ${mailtype === 'VERIFY' ? 'Verify Your Email' : 'Reset Your Password'}
                </a>
              </p>
              <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
              <p style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; word-break: break-word;">
                ${process.env.DOMAIN}/${mailtype === 'VERIFY' ? 'verification' : 'passverify'}?token=${hashedToken}
              </p>
              <p>Thank you,<br>The Code Hub Team</p>
            </div>
          `, // html body
          
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