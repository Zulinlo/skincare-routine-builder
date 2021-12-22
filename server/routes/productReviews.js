import express from "express";

import mongoose from "mongoose";

import { User, Product, ProductReview } from "../models.js";

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json("All product reviews list.");
  })
  .post(async (req, res) => {
    const { rating, message, productId, senderId } = req.body;

    const isUserValid = await User.exists({ _id: senderId });
    if (!isUserValid) return res.status(400).json(`User does not exist.`);

    const isProductValid = await Product.exists({ _id: productId });
    if (!isProductValid) return res.status(400).json(`Product does not exist.`);

    const hasAlreadyReviewed = await ProductReview.exists({
      productId,
      senderId,
    });
    if (hasAlreadyReviewed)
      return res.status(400).json(`User has already reviewed this product.`);

    const _id = new mongoose.Types.ObjectId();
    const newProductReview = new ProductReview({
      _id,
      rating,
      date: new Date(),
      message,
      productId,
      senderId,
    });

    const updateReview = (num, avg) => {
      return (num * avg + rating) / (num + 1);
    };

    newProductReview
      .save()
      .then((result) => {
        console.log(`Successful Product Review!\n${result}`);

        // update product's rating fields
        Product.findOne({ _id: productId }, function (err, doc) {
          doc.averageReview = updateReview(
            doc.numberOfReviews,
            doc.averageReview
          );
          doc.numberOfReviews++;
          doc.save();
        });
        return res.status(200).json({ _id });
      })
      .catch((err) => {
        console.log(`Unsuccessful Product Review.\n${err}`);
        return res.status(400).json(err.message.slice(33).split(", "));
      });
  });

export default router;
