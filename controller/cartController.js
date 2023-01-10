const Cart = require('../models/Cart');
const Product = require('../models/Product');

const { checkIfUserCartExists, checkItemPresentInCart } = require('../utils');

const userCart = async(req, res) => {
    const { userTag } = req.body;

    try{

        let cart = await checkIfUserCartExists(userTag);
        console.log(cart);
        if(cart.exists) return res.status(200).json({ success: true, message: "cart exists", cart: cart.cart });
        
        cart = new Cart({
            userTag,
            value: 0,
            quantity: 0
        });

        await cart.save();

    return res.status(200).json({ success: true, cart: cart, message: "cart created" });

    }catch(err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err });
    }

}

const addProductToCart = async(req, res) => {
    const { userTag, productTag, qty } = req.body;
    console.log(req.body)

    let cart = await checkIfUserCartExists(userTag);
    if(!cart.success) return res.status(400).json({ success: false, message: "Cart it not initialized" });

    cart = cart.cart;

    var product = await Product.findOne({tag: productTag});
    console.log(product);

    var response = await checkItemPresentInCart(userTag, productTag);
    console.log(response);
    if(response.present){
        await Cart.findOneAndUpdate(
            { userTag },
            { $inc: { "items.$[elem].quantity": qty, "items.$[elem].value": qty*product.price } },
            { arrayFilters: [ { "elem.tag": productTag } ] }
        );

        return res.status(200).json({
            success: true,
            messsage: "Cart updated"
        });
    }

    var item = {
        quantity: qty,
        value: product.price * qty,
        product: product,
        tag: productTag
    }

    await Cart.updateOne({ userTag: userTag }, { $push: { items: item }});

    return res.status(200).json({success: true, message: "item added to cart"});
}   

const getCart = async (req, res) => {
    const { userTag } = req.body;
    let cart = await Cart.findOne({userTag});
    return res.status(200).send({"success": true, cart});
}

module.exports = {userCart, addProductToCart, getCart};