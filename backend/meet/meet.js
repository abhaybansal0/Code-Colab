import express from 'express';
import { Router } from "express";


const router = Router();



// Define your routes for "meet" logic
router.get('/', (req, res) => {
    console.log('A meeting was started');
    
    res.send({ message: 'Welcome to the meet endpoint!'});
});

router.get('/:slug', (req, res) => {
    console.log('An slug was accessed');
    const { slug } = req.params;
    if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
    }
    res.json({ slug });
});






export default router;
