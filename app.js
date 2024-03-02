const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./model/user');
const app = express();

mongoose.connect('mongodb+srv://vamshigoutham2197:7m4PAluInjOGKQ57@cluster0.pp0rbeq.mongodb.net/sports?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('database connection successful')
});

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.post("/sign-up", async (req, res) => {
    const errors = {};
    User.findOne({ email: req.body.email }).then((user) => {
        console.log(user);
        if (!user) {
            const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            console.log(re.test(req.body.email));
            if (!re.test(req.body.email)) {
                errors.message = "email is incorrect";
                return res.status(400).json(errors);
            }
            if (req.body.password.length < 6) {
                errors.message = "Password length must be greater than 6 characters";
                return res.status(400).json(errors);
            }
            const newUser = User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    res.status(400).json(err);
                }
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    newUser.password = hash;
                    newUser.save().then(() => {
                        console.log("user is successfully registered");
                        return res.json({ success: true, message: "User registration is successful" });
                    }).catch(error => {
                        console.log("e", error);
                        return res.json({ success: false, message: 'User could not be created' })
                    })
                });
            });
        }
        else {
            return res.status(400).json({ success: false, message: 'User already Registered' });
        }
    }).catch(error => {
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    })
});

app.post("/sign-in", async (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, match) => {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message:'Failed to Login. Please try Again' });
                }
                if (!match) {
                    return res.status(400).json({ success: false, message:'Password entered is incorrect' });
                }
                const payload = { name: user.name, email: user.email };
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" },
                    (err, token) => {
                        return res.json({ success:true, message:"User Login Success", token: `${token}`, user:user });
                    }
                );
            });
        }
        else {
            return res.status(400).json({success:false, message: "No user found with this email"})
        }
    }).catch(err => {
        console.log("e", err)
        return res.status(500).json({success:false, message: "Internal Server Error"})
    })
});


app.get('/asdf', (req, res) => {
    return (
        res.send({
            msg: 'asdfasdfasdafasdfasdf'
        })
    )
})



app.listen(process.env.PORT, () => {
    console.log(`listening on PORT ${process.env.PORT}`)
})