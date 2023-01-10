let data = {};
let status = {};
let assignedTag = {};
const User = require('../models/Customer');

const generateTag = async (req, res) => {
    const { email } = req.body;
    console.log(email);

    const user = await User.findOne({email});
    if(user == undefined) {
        return res.status(400).json({
            "success": false,
            "msg": "User not found",
        });
    }

    if(status[email] == true) {
        return res.status(400).json({"success" : false, "msg": "User already has an active tag", "tag": assignedTag[email]});
    }
    var tag;
    for(var i = 0; i<1000; i++) {
        tag = i;
        if(data[tag] == 0 || data[tag] == undefined){
            data[tag] = email;
            status[email] = true;
            console.log(status);
            assignedTag[email] = tag;

            await user.update({ userTag: tag });

            console.log(tag)
            break;
        }
    }
    return res.status(200).json({"success": true, "user": await User.findOne({email})});
}
  
const clearTag = async (req, res) => {
    const { email, tag } = req.body;

    const user = await User.findOne({email});
    if(user == undefined) {
        return res.status(400).json({
            "success": false,
            "msg": "User not found",
        });
    }

    if(data[user.userTag] !== undefined){
        data[user.userTag] = "";
        await user.update({ userTag: -1});
    }
    return res.status(200).json({"success": true, "user": await User.findOne({email})});
}

module.exports = {
    generateTag,
    clearTag
}