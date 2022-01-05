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
      isSensitive = false,
    } = req.body;

    const isExists = await Product.exists({
      name,
    });
    if (isExists) return res.status(400).json(`Product already exists.`);

    if (!ingredients || !ingredients[0].trim())
      return res.status(400).json(`No ingredients list.`);

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
      isSensitive,
    });

    newProduct
      .save()
      .then((result) => {
        console.log(`Product added!\n${result}`);
        return res.status(200).json({ _id, imagePath });
      })
      .catch((err) => {
        console.log(`Failed to add product.\n${err}`);
        return res.status(400).json(err.message.slice(27).split(", "));
      });
  });

export default router;
