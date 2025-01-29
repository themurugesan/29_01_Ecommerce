const express = require("express");
const multer = require("multer");
const singupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const userRoute = require("./routes/user");
const cors = require("cors");
const bodyParser = require("body-parser");

const createAdminAccount = require("./scripts/admin");
const { mongoose } = require("./configuration/dbConfig");
const { authenticateToken } = require("./utils/authMiddeleware");
const User = require('../28_01_Ecom_Backend/models/user');
const Image=require("../28_01_Ecom_Backend/models/product")



const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

createAdminAccount();
app.use(express.json());


app.use("/uploads", express.static("uploads"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
app.post("/upload", upload.single("image"), async (req, res) => {
  const { title, description, amount } = req.body; // Get description and amount from body
  const image = new Image({
    title,
    description, // Save description
    amount, // Save amount
    image: req.file.path,
  });
  await image.save();
  res.status(201).json(image);
});

app.get("/images", authenticateToken, async (req, res) => {
  try {
    const images = await Image.find();

    // const user = req.user;



    // if (!user || !user.email) {
    //   return res.status(400).send({ message: "User information is missing" });
    // }

    // const check = await User.findOne({ email: user.email });
    // console.log(check, "for cart display");

    // if (check) {
    //   console.log(check.notify, "check notify");
    //   const productIdsNotify = check.notify.map(item => item._id.toString());

     
    //   const validProducts = images.filter(product => 
    //     productIdsNotify.includes(product._id.toString())
    //   );

    //   return res.status(200).send({ cart: check.notify });
    // } else {
    //   return res.status(404).send({ message: "User not found" });
    // }

    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send({ message: "Error fetching images", error });
  }
});

app.put("/images/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, description, amount } = req.body;
  const updateData = { title, description, amount };
  if (req.file) {
    updateData.image = req.file.path;
  }
  const updatedImage = await Image.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  res.json(updatedImage);
});

app.delete("/images/:id", async (req, res) => {
  const { id } = req.params;
  await Image.findByIdAndDelete(id);
  res.json({ message: "Image deleted" });
});

app.use("/user", singupRoute);
app.use("/auth", loginRoute);
app.use("/api", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
