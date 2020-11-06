const express = require('express');

const app = express();

app.get("/", () => "API Running");

//Define the port that is used. Default 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server on port' + PORT));



