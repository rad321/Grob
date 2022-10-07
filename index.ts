
var express = require('express');
var dotenv = require ('dotenv').config()
// Constants
var PORT = process.env.PORT;
var HOST = process.env.HOST;

// App
var app = express();
app.get('/', (req, res) => {
  res.send('Prova');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);