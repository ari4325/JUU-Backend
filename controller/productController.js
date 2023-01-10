const Product = require('../models/Product');
const csvtojson = require('csvtojson');
const User = require('../models/Customer');
const { use } = require('../routes/user');

const uploadData = async (req, res) => {
    console.log(req.file);

    csvtojson().fromFile(req.file.path).then(async (csvData) => {
        try{
            await Product.deleteMany({});
            await Product.insertMany(csvData).then(() => {
                return res.json({
                    success: true,
                    message: "Data updated",
                });
            });
        }catch(err) {
            return res.status(500).json({
                success: false,
                errorMessage: err,
                errorType: "Internal Server Error",
            });
        }
        
    })
}

const getProductData = async (req, res) => {
    const {tag} = req.query;
    console.log(tag);

    try{
        const product = await Product.findOne({tag: tag});

        if(!product) {
            return res.status(400).json({
                success: false,
                errorMessage: "Product Not Found",
                errorType: "Product Not Found",
            });
        }

        return res.status(200).json({
            success: true,
            product: product
        });
    }catch(err) {
        return res.status(500).json({
            success: false,
            errorMessage: err,
            errorType: "Internal Server Error",
        });
    }
}

module.exports = {uploadData, getProductData};