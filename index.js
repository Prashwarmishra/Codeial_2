const express = require('express');
const port = 8000;
const app = express();

app.listen(port, function(err){
    if (err){console.log(`There's an error while connecting to the server: ${err}`); return;}

    console.log(`The Server is running at the port: ${port}`);
});