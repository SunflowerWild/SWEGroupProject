require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');


const app = express();
app.use(express.json());

connectDB();
app.use('/auth', authRoutes);

app.listen(3500, () => console.log('Server running on port 3500'));
