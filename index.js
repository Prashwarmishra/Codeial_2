const express = require('express');
const port = 8000;
const app = express();

app.use('/', require('./routes'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if (err){console.log(`There's an error while connecting to the server: ${err}`); return;}

    console.log(`The Server is running at the port: ${port}`);
});