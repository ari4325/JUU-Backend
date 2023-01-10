const User = require("../models/Customer");
const Cart = require("../models/Cart");

const checkIfUserWithMobileExists = async (mobile) => {
  try {
    let user = await User.findOne({ mobile });
    if (user != null) {
      return { success: true, message: "User Already Exists", exists: true };
    } else
      return { success: true, message: "User does not exists", exists: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      errType: "Internal Server Error",
      errMessage: err,
    };
  }
};

const checkIfUserCartExists = async(userTag) => {
  try{
    let cart = await Cart.findOne( { userTag } );
    if(cart) return { success: true, exists: true, cart: cart };
    return { success: true, exists: false };
  }catch(err) {
    console.log(err);
    return { success: false, error: err };
  }
}

const checkIfUserWithEmailExists = async (email) => {
  try {
    let user = await User.findOne({ email });
    if (user) {
      return { success: true, exists: true };
    } else return { success: true, exists: false };
  } catch (err) {
    console.log(err);
    return { success: false, errMessage: err };
  }
};

const checkItemPresentInCart = async (userTag, tag) => { 
  try{
    let cart = await Cart.findOne({ userTag: userTag, "items.tag": tag } );
    console.log(cart);
    if(cart) return { success: true, present: true, msg: "item present" }
    return { success: true, present: false, msg: "item not present" };
  }catch(err) {
    return { success: false, present: false, msg: err };
  }
}

module.exports = {
  checkIfUserWithMobileExists,
  checkIfUserWithEmailExists,
  checkIfUserCartExists,
  checkItemPresentInCart
};