import express from "express";

import mongoose from "mongoose";

import { Product } from "../models.js";

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json("All products list.");
  })
  .post(async (req, res) => {
    const {
      name,
      imagePath = new mongoose.Types.ObjectId(),
      brand,
      price,
      description,
      volume,
      directions,
      ingredients,
      step,
      skinType,
      averageReview = 5,
      numberOfReviews = 0,
    } = req.body;

    const isExists = await Product.exists({
      name,
    });
    if (isExists) return res.status(400).json(`Product already exists.`);

    const _id = new mongoose.Types.ObjectId();
    const newProduct = new Product({
      _id,
      name,
      imagePath,
      brand,
      price,
      description,
      volume,
      directions,
      ingredients,
      step,
      skinType,
      averageReview,
      numberOfReviews,
    });

    newProduct
      .save()
      .then((result) => {
        console.log(`Product added!\n${result}`);
        return res.status(200).json({ _id });
      })
      .catch((err) => {
        console.log(`Failed to add product.\n${err}`);
        return res.status(400).json(err.message.slice(27).split(", "));
      });
  });

export default router;
