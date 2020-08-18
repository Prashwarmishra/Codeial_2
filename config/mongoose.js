const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codeial_development_db');
const db = mongoose.connection;

db.on('error', console.error.bind(console, "There's an error connecting to the database."));
db.once('open', function(){
    console.log("The server is successfully connected to the database.");
})

module.exports = db;