const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Importing routes
const patientRoutes = require('./api/routes/patients');

// Connecting to mongoose db
mongoURI = 'mongodb+srv://shreens:nsauth@cluster0.ofcb8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(
    mongoURI,
    {useNewUrlParser: true,  useUnifiedTopology: true}
);

// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise; // To remove Deprication Warning

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(res.method === "OPTIONS") {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'    
        )
        return res.statusMessage(200).json({});
    }
    next();
});

// Routing
app.use('/patient', patientRoutes);

// Handling errors
app.use((req, res, next) => {
    const error = new Error("Not found (Custom)");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status);
    res.json({
        message: error.message
    })
});
module.exports = app;