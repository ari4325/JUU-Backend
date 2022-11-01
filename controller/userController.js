const bcrypt = require('bcryptjs');
const User = require("../models/Customer");

const {
  checkIfUserWithMobileExists,
  checkIfUserWithEmailExists,
} = require("../utils/index");

const register = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;
    if ((await checkIfUserWithEmailExists(email)).exists) {
      return res.json({
        success: false,
        errType: "Validation Error",
        errMessage: "User with similar email address exists",
      });
    }
    if((await checkIfUserWithMobileExists(mobile)).exists) {
      return res.json({
        success: false,
        errType: "Validation Error",
        errMessage: "User with similar mobile number exists",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const passHash = await bcrypt.hashSync(password, salt);

    let user = new User({
      userTag: 0,
      username: name,
      email,
      password: passHash,
      mobile
    });

    await user.save();

    return res.json({
      success: true,
      message: "User Created Successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne(
      { email: email },
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        errorType: "Bad Request",
        errorMessage: "User does not exist", // user dne
      });
    }

    if(bcrypt.compareSync(password, user.password)){
      return res.status(200).json({
        success: true,
        message: "Login Successful",
      });
    }else{
      return res.status(400).json({
        success: false,
        errorType: "Bad Request",
        errorMessage: "Invalid Password", // user dne
      });
    }
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: err,
      errorType: "Internal Server Error",
    });
  }
};

const editUser = async (req, res) => {
  // validate if user id is of type MongoDB Object ID

  try {
    const id = req.params.id;

    let user = User.findOne({ _id: id }, { __v: 0 });
    if (!user) {
      return res.json({
        success: false,
        errType: "Invalid User Id",
        errmessage: "Invalid User, Couldn't Edit",
      });
    }

    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        errorType: "Bad Request",
        errorMessage: "data not updated due to no changes",
      });
    }

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    // don't allow user to change accountAddress
    // if (accountAddress) {
    //   user.accountAddress = accountAddress;
    // }

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Update Successful",
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
};

const getUser = async (req, res) => {
  // validate if user id is of type MongoDB Object ID

  try {
    const id = req.params.id;

    let user = await User.findOne({ _id: id });
    if (user) {
      return res.json({
        success: true,
        data: user,
      });
    }

    return res.json({
      success: false,
      errType: "Invalid User Id",
      errmessage: "Invalid User",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
};

const activeTag = async (req, res) => {
    const {email} = req.body;
   
    let user = await User.findOne({ _id: id });
    if (user) {
      return res.json({
        success: true,
        data: user,
      });
    }

    let tag = user.userTag;
    if(tag == -1) {
      return res.status(400).json({"success" : false, "msg": "user does not have an active tag"});
    }
    return res.status(200).json({"success": true, "tag": tag});
}

module.exports = {
  editUser,
  getUser,
  login,
  register,
  activeTag
};
