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
import mymeetings from './meetings/mymeetings/route.js';
import getmeetdetails from './meetings/getmeetdetails/route.js';
import savemessage from './meetings/savemessage/route.js';
import profileRoute from './user/profile/route.js';
import updateRoomName from './meetings/updateroomname/route.js';
import deleteMeeting from './meetings/deletemeeting/route.js';



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
app.use('/api/mymeetings', mymeetings)
app.use('/api/meetings/getmeetdetails', getmeetdetails)
app.use('/api/meetings/savemessage', savemessage)

/// User Routes
app.use('/api/user/profile', profileRoute)

/// Meeting Management Routes
app.use('/api/meetings/updateroomname', updateRoomName)
app.use('/api/meetings/deletemeeting', deleteMeeting)



app.get('/api', (req, res) => {
    res.send({ message: 'Hello from Express!' });
});


// Socket connection
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);


    socket.on('JoinRoom', (data) => {
        const { slug, myname, userId } = data
        socket.join(slug);
        socket.myname = myname; // Store username in socket for online users
        socket.userId = userId; // Store user ID for role management
        
        // Check if this user is the owner by querying the database
        // For now, we'll set a flag that will be updated when role info is fetched
        socket.isOwner = false;
        
        // console.log('name is', myname, slug);
        socket.broadcast.to(slug).emit('someoneJoined', { myname });
        
        // Note: Role info will be fetched from database via API call
    });

    socket.on('Ijoined', (data) => {
        const { slug, name } = data;
        socket.myname = name; // Store username in socket for online users
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

    // Chat functionality
    socket.on('sendMessage', (messageData) => {
        const { slug, content, user, timestamp } = messageData;
        
        // Broadcast to all users in the room, including sender for consistency
        socket.to(slug).emit('chatMessage', { content, user, timestamp });
        
        // Also send a notification to all users in the room about new message
        // socket.broadcast.to(slug).emit('newMessageNotification', { 
        //     slug, 
        //     user, 
        //     hasUnreadMessages: true 
        // });
        
        // Note: Message will be saved to database via API call from frontend
    });

    socket.on('typing', (data) => {
        const { slug, user } = data;
        socket.broadcast.to(slug).emit('typing', { user });
    });

    socket.on('getOnlineUsers', (data) => {
        const { slug } = data;
        const room = io.sockets.adapter.rooms.get(slug);
        if (room) {
            const users = Array.from(room).map(socketId => {
                const socket = io.sockets.sockets.get(socketId);
                return {
                    name: socket?.myname || 'Anonymous',
                    role: socket?.userRole || 'viewer',
                    isOwner: socket?.isOwner || false
                };
            }).filter(Boolean);
            socket.emit('onlineUsers', users);
        }
    });

    // Role management
    socket.on('requestEditorRole', (data) => {
        const { slug, requesterId } = data;
        console.log('I am running here, the data is', data);
        // Broadcast to all users in the room
        // The frontend will filter and only show to owners
        io.to(slug).emit('roleRequest', {
            requester: socket.myname,
            requesterId: requesterId,
            slug
        });
    });

    socket.on('assignRole', (data) => {
        const { slug, targetUserId, newRole } = data;
        console.log('Role assigned:', targetUserId, newRole);
        
        // Update the target user's role in the socket
        const targetSocket = Array.from(io.sockets.sockets.values()).find(s => 
            s.myname === targetUserId && s.rooms.has(slug)
        );
        
        if (targetSocket) {
            targetSocket.userRole = newRole;
        }
        
        // Notify all users in the room about the role change
        io.to(slug).emit('userRoleChanged', {
            user: targetUserId,
            newRole: newRole
        });
    });




    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
        
        // Notify other users when someone leaves
        if (socket.myname) {
            // Find which room the user was in
            const rooms = Array.from(socket.rooms);
            rooms.forEach(room => {
                if (room !== socket.id) { // socket.id is always in rooms
                    socket.broadcast.to(room).emit('userLeft', { name: socket.myname });
                }
            });
        }
    });
});



// Handling fallback for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

server.listen(5000, () => {
    console.log(`Backend & Server running on ${process.env.BACKEND_DOMAIN}`);
});
