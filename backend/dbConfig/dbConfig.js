import mongoose from "mongoose";
import dotenv from 'dotenv';


export default async function dbconnect()  {
    
    
    dotenv.config();
    const URI = process.env.MONGO_URI;
    
    try {



        mongoose.connect(URI);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            // console.log('Connected to DB');
        })
        connection.on('disconnected', () => {
            console.log('Disonnected From DB');
        })

        connection.on('error', (error) => {
            console.log('Error connecting to db: ' + error);
            process.exit();            
        })


    } catch (error) {
        console.log('Error Connecting to DB');
        console.log(error);
    }

}