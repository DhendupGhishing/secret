//jshint esversion:6
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true }).then(() => console.log("Mongodb Connected"));;

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
const UserModel = mongoose.model("user", userSchema);
app.get("/home", (req, res) => {
    res.render("home")
});
app.get("/register", (req, res) => {
    res.render("register")
});
app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);

    const newUser = new UserModel({
        email: username,
        password: password

    });
    newUser.save((err) => {
        if (err) {
            console.log(err);

        } else {
            res.render("secrets")
        }
    })

})
app.get("/login", (req, res) => {
    res.render("login")
});
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    UserModel.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                }
            }
        }
    })
});



app.listen(port, () => {
    console.log(`Starting a server at ${port}`);
})