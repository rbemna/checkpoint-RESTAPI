const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const userSchema = new Schema({
    name:String,
    height:Number,
    weight:Number,
});
module.exports = User = model("user", userSchema);