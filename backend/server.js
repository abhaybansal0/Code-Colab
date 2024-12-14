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
import verifypassword from './users/verifypassword/route.js';
import changepassword from './users/changepassword/route.js';

import updatecode from './meetings/updatecode/route.js';
import addmeet from './meetings/addmeet/route.js';
import fetchmeet from './meetings/fetchmeeet/reoute.js';



const app = express();
const server = createServer(app);


app.use(cookieParser())

app.use(cors());
app.use(express.json());

// Creating a server for the socket
const io = new Server(server, {
    cors: {
        origin: process.env.DOMAIN,
        methods: ['GET', 'POST'],
        credentials: true,
    }
})






app.use('/api/codemeet', (req, res, next) => {
    req.io = io;
    next();
}, meetRoutes); // Send the meet API to meet.js server


/// Forwarding User routes

app.use('/api/signup', signupRoute)
app.use('/api/login', login)
app.use('/api/logout', logout)
app.use('/api/me', me)
app.use('/api/verifyemail', verifyemail)
app.use('/api/forgotpass', forgotpass)
app.use('/api/verifypassword', verifypassword)
app.use('/api/changepassword', changepassword)

/// Meeting Routes
app.use('/api/meetings/addmeet', addmeet)
app.use('/api/meetings/updatemeet', updatecode)
app.use('/api/meetings/fetchmeet', fetchmeet)




app.get('/api', (req, res) => {
    res.send({ message: 'Hello from Express!' });
});


// Socket connection
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);


    socket.on('JoinRoom', (data) => {


        const { slug, myname } = data
        socket.join(slug);
        // console.log('name is', myname, slug);

        socket.broadcast.to(slug).emit('someoneJoined', { myname });
    });

    socket.on('Ijoined', (data) => {
        const { slug, name } = data;
        // console.log(name, slug);
        socket.broadcast.to(slug).emit('someoneJoined', name)
    })

    socket.on('coding', (cod) => {
        // console.log('Someone is editting the code');
        const { slug, code, input, output } = cod;
        // console.log('Socket ID:', socket.id);  // Log socket ID
        // console.log('Slug:', slug);  // Log the room name


        socket.broadcast.to(slug).emit('IncomingCode', { code, input, output });
    })
    socket.on('Running', (cod) => {
        // console.log('Someone is editting the code');
        const { slug, code, input, output } = cod;
        // console.log(slug)

        socket.broadcast.to(slug).emit('IncomingCode', { code, input, output });

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
    console.log('Backend & Server running on http://localhost:5000');
});
