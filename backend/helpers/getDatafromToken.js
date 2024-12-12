import jwt  from "jsonwebtoken";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config();


const getDataFromToken =  (req, res, next) => {
    try {
        
        const token = req.cookie. || "";

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

        const response = {
            id: decodedToken.id,
            mail: decodedToken.email
        }

        req.tokenData = response;

        next()

    } catch (error) {
        console.log('failed to fetch data from token', error);
        
    }
}


export default getDataFromToken