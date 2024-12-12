import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import login from './users/login/route.js';
import logout from './users/logout/route.js';
import me from './users/me/route.js';
import meetRoutes from './meet/meet.js';
import signupRoute from './users/signup/route.js';
import verifyemail from './users/verifyemail/route.js';
import forgotpass from './users/forgotpass/route.js'

import updatecode from './meetings/updatecode/route.js';
import addmeet from './meetings/addmeet/route.js';



const app = express();
const server = createServer(app);


app.use(cookieParser())

app.use(cors());
app.use(express.json());

// Creating a server for the socket
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    }
})




app.use('/api/codemeet',(req, res, next) =>{
    req.io = io;
    next();
}, meetRoutes); // Send the meet API to meet.js server


    /// Forwarding routes

app.use('/api/signup', signupRoute) 
app.use('/api/login', login) 
app.use('/api/logout', logout) 
app.use('/api/me', me) 
app.use('/api/verifyemail', verifyemail) 
app.use('/api/forgotpass', forgotpass) 

    /// Meeting Routes
app.use('/api/meetings/addmeet', addmeet)
app.use('/api/meetings/updatemeet', updatecode)




app.get('/api', (req, res) => {
    res.send({ message: 'Hello from Express!' });
});



// Socket connection
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('coding', (cod) => {
        // console.log('Someone is editting the code');
        const { code, input, output } = cod;
    
        socket.broadcast.emit('IncomingCode', { code, input, output});
    })
    socket.on('Running', (cod) => {
        // console.log('Someone is editting the code');
        const { code, input, output } = cod;
    
        socket.broadcast.emit('IncomingCode', { code, input, output});
    })


    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
    });
});




// Handling fallback for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

server.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
});
