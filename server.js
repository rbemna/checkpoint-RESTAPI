const express = require("express");
const mongoose=require("mongoose");
const app = express();
app.use(express.json());
const User = require("./models/User");
const result=require('dotenv').config({ path: './config/.env' })
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            `{mongodb://${process.env.HOST}:27017/${process.env.DB}}`, {useNewUrlParser: true,useUnifiedTopology: true }
        );
        console.log("connected to the database");
    } catch (error) {
        console.log(error);
    }
};
connectDB();
app.post("/", async (req, res) => {
    try {
        //create new user with the model User
        const newUser = new User(req.body);
        // test if the name of the user exists
        const findUser = await User.findOne({ name : req.body.name });
        if (findUser) {
            return res.status(400).send({
                errors: [{ msg: `${req.body.name} already exists` }],
            });
        }
        // save the new user to the data base
        await newUser.save();
        res.status(200).send({
            msg: "new user is added successfully",
            user: newUser,
        });
    } catch (error) {
        res.status(500).send({ errors: [{ msg: "user didn't register" }] });
    }
});
//get all users
app.get("/", async (req, res) => {
    try {
        //find all users
        const users = await User.find();
        res.status(200).send({ Users : users });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "cannot find any user" });
    }
});
//delete the user with the given id
app.delete("/:id", async (req, res) => {
    try {
        const user = await User.deleteOne({ _id: req.params.id });
        res.status(200).send("deleted");
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "cannot find any user" });
    }
});
//looking for the user by name & update its infos if found
app.put("/:id", async (req, res) => {
    try {
        //testing if the user with the given id's name already exists
        //1-getting the name of the id's user
        const findUser = await User.find({ _id : req.params.id });
        const userIdName=findUser[0].name;
        // looking for any occurance of the name introduced in the body 
        const findBodyUser=await User.find({name:req.body.name})
        console.log((findBodyUser.length))
            if (!(findBodyUser.length) && !(userIdName===req.body.name)){
            const user = await User.updateOne(
            { name: userIdName },
            { $set: { ...req.body } } );
        res.status(200).send("updated");
            }
        else{
                return res.status(400).send({
                errors: [{ msg: `${req.body.name} already exists` }],
                });
    }} catch (error) {
        console.log(error);
        res.status(500).send({ msg: "cannot find any user" });
    }
});
app.listen(parseInt(process.env.PORT), err => {
        if (err) {
        return console.log("ERROR", err);
    }
    console.log(`Listening on port ${process.env.PORT}`);
});