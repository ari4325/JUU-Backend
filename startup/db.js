const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://arishmitg:arighosh4325@cluster0.pa17a.mongodb.net/JUUIndia?retryWrites=true&w=majority";

const connectDB = () => {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connection Established"))
    .catch((err) => {
      console.log("Error connecting to Database: " + err);
    });
};

module.exports = connectDB;
