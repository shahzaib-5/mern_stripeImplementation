const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.post("/",verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/find/:userId",verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.findOne({userId : req.params.userId});

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/",verifyTokenAndAdmin, async (req, res) => {

  try {
    const order = await Order.find()
    res.status(200).json(order)
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
