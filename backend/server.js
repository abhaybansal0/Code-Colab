import express from 'express';
import cors from 'cors';
import meetroutes from './meet.js';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/codemeet', meetroutes); // Send the meet API to meet.js server


app.get('/api', (req, res) => {
    res.send({ message: 'Hello from Express!' });
});
app.get('/api', (req, res) => {
    res.send({ message: 'Hello from Express!' });
});

// Handling fallback for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
});
