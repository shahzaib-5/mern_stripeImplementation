const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CryptoJS = require("crypto-js");


router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SEC_PASS
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Invalid Credentials");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SEC_PASS
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json("Invalid Credentials");

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_PASS,
        { expiresIn: "3d" }
      );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
