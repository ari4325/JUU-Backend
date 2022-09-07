const bodyParser = require("body-parser");
const cors = require("cors");
const { user } = require("../routes/user");
const UserController = require("../controller/userController");
const productController = require("../controller/productController");
const cartController = require("../controller/cartController");

const multer = require("multer");
const upload = multer({ dest: "./temp/data/uploads/" });

module.exports = (app) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.get("/login", UserController.login);
  app.post("/register", UserController.register);
  app.patch("/:id", UserController.editUser);
  app.get("/:id", UserController.getUser);
  //app.use("/api/video", video);
  app.post('/upload', upload.single("file"), productController.uploadData);
  app.get('/getProduct', productController.getProductData);
  //app.post('/addToCart', productController.addProductToUserCart);
  app.post('/cart', cartController.userCart);
  app.post('/addCart', cartController.addProductToCart);
};
