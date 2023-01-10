const bodyParser = require("body-parser");
const cors = require("cors");
const { user } = require("../routes/user");
const UserController = require("../controller/userController");
const productController = require("../controller/productController");
const cartController = require("../controller/cartController");
const tagController = require("../controller/tagController");

const multer = require("multer");
const upload = multer({ dest: "./temp/data/uploads/" });

module.exports = (app) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.get('/clearTag', tagController.clearTag);
  app.get("/activeTag", UserController.activeTag);
  app.get('/getCart', cartController.getCart);
  app.get("/login", UserController.login);
  app.get('/getProduct', productController.getProductData);
  app.get("/:id", UserController.getUser);
  
  
  app.post("/register", UserController.register);
  app.patch("/:id", UserController.editUser);
  //app.use("/api/video", video);
  app.post('/upload', upload.single("file"), productController.uploadData);
  //app.post('/addToCart', productController.addProductToUserCart);
  app.post('/cart', cartController.userCart);
  app.post('/addCart', cartController.addProductToCart);
  app.post('/generateTag',tagController.generateTag);
};
