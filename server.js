const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect to database
connectDB();

//Start middleware
app.use(express.json({ extended : false }));

//Define routes

app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));

app.get("/", (req, res) => res.send("API Running"));

//Define the port that is used. Default 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server on port' + PORT));



