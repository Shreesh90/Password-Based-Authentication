const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');

const Patient = require('../models/patient');

const bcrypt = require('bcrypt'); // For hashing passwords

app.use(express.json());
app.use(cors());


// Approach 1: UserID and Password file
router.post('/registerA1', (req, res, next) => {
    Patient.find({_id: req.body._id})
        .exec()
        .then(patient => {
            if(patient.length >= 1){
                return res.status(409).json({
                    message: "Patient Already Exists!"
                });
            } else {
                const user = new Patient({
                    _id: req.body._id,
                    name: req.body.name,
                    email: req.body.email,
                    token: req.body.token 
                })
                user
                    .save()
                    .then(result => {
                        // console.log(result);
                        res.status(201).json({
                            message: "New Patient Created (Approach 1)"
                        });
                    })
                    .catch(err => {
                        res.status(500).json({error: err, auth: "Two"});
                    })
            }
        })
        .catch(err => res.status(404).json({error: err, auth: "Outer"}))
});

router.post('/loginA1', (req, res, next) => {
    Patient.find({_id: req.body._id})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: "Auth Failed"
            });
        }
        if(req.body.token === user[0].token){
            return res.status(200).json({
                message: "Auth Successful",
            })
        } else {
            return res.status(401).json({
                message: "Auth Failed"
            });
        }
    })
    .catch(err => res.status(500).json({error: err}));
});

// Approach 2: Hashing
router.post('/registerA2', (req, res, next) => {
    Patient.find({_id: req.body._id})
        .exec()
        .then(patient => {
            if(patient.length >= 1){
                return res.status(409).json({
                    message: "Patient Already Exists!"
                });
            } else {
                var new_token;
                var original_token= req.body.token;
                var hash=5381;
                var c;
                for(c=0;c< original_token.length;c++){
                    hash=(hash<<5 +hash)+ (original_token.charCodeAt(c)+1);
                }
                new_token=hash;
                console.log(original_token);
                console.log(new_token);

                const user = new Patient({
                    _id: req.body._id,
                    name: req.body.name,
                    email: req.body.email,
                    token: new_token
                })
                user
                    .save()
                    .then(result => {
                        // console.log(result);
                        res.status(201).json({
                            message: "New Patient Created (Approach 2)"
                        });
                    })
                    .catch(err => {
                        res.status(500).json({error: err, auth: "Two"});
                    })
            }
        })
        .catch(err => res.status(404).json({error: err, auth: "Outer"}))
});

router.post('/loginA2', (req, res, next) => {
    Patient.find({_id: req.body._id})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: "Auth Failed"
            });
        }
        let new_token;
        let original_token= req.body.token;
        let hash=5381;
        var c;
        for(c=0;c< original_token.length;c++){
            hash=(hash<<5 +hash)+ (original_token.charCodeAt(c)+1);
        }
        new_token=hash;

        if(String(new_token) === String(user[0].token)){
            return res.status(200).json({
                message: "Auth Successful",
            })
        } else {
            return res.status(401).json({
                message: "Auth Failed"
            });
        }
    })
    .catch(err => res.status(500).json({error: err}));
});

// Approach 3: Salting and Hashing
router.post('/registerA3', (req, res, next) => {
    Patient.find({_id: req.body._id})
        .exec()
        .then(patient => {
            if(patient.length >= 1){
                return res.status(409).json({
                    message: "Patient Already Exists!"
                });
            } else {
                bcrypt.genSalt(1, (err, salt) => {
                    bcrypt.hash(req.body.token, salt, (err, hash) => {
                        console.log("SALT(A3): ", salt);
                        console.log("HASH(A3): ", hash);
                        if(err){
                            return res.status(500).json({error: err, auth: "One"});
                        } else {
                            const user = new Patient({
                                _id: req.body._id,
                                name: req.body.name,
                                email: req.body.email,
                                token: hash
                            })
                            user
                                .save()
                                .then(result => {
                                    // console.log(result);
                                    res.status(201).json({
                                        message: "New Patient Created (Approach 3)"
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json({error: err, auth: "Two"});
                                })
                        }
                    })
                })
                
            }
        })
        .catch(err => res.status(404).json({error: err, auth: "Outer"}))
});

router.post('/loginA3', (req, res, next) => {
        Patient.find({_id: req.body._id})
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message: "Auth Failed"
                });
            }
            bcrypt.compare(req.body.token, user[0].token, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: "Auth Failed"
                    });
                }
                if(result) {
                    return res.status(200).json({
                        message: "Auth Successful",
                    })
                }
                res.status(401).json({
                    message: "Auth Failed",
                });
            })
        })
        .catch(err => res.status(500).json({error: err}));
});
module.exports = router;