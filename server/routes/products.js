import express from "express";
import mongoose from "mongoose";

import { Product, IngredientMapped } from "../models.js";

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    if (Object.keys(req.query).length === 0) {
      return res.status(200).json(await IngredientMapped.find().lean());
    }
    const { concern, skinType, step, isSensitive } = req.query;

    const products = await Product.find({
      skinType: skinType,
      step: step
    }).lean();

    const ingredients = await IngredientMapped.find().lean();
    const ingredientsMap = new Map();

    for (let ingredient of ingredients) {
      ingredientsMap.set(ingredient.name, { name: ingredient.name, rating: ingredient.rating, purpose: ingredient.purpose, description: ingredient.description });
    }

    for (let i = 0; i < products.length; i++) {
      let currIngredients = products[i]["ingredients"];
      
      for (let j = 0; j < currIngredients.length; j++) {
        currIngredients[j] = ingredientsMap.has(currIngredients[j]) ? ingredientsMap.get(currIngredients[j]) : {name: currIngredients[j], rating: null, purpose: null, description: null };
      }
    }

    res.status(202).json(products);
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
        return res.status(202).json({ _id, imagePath });
      })
      .catch((err) => {
        console.log(`Failed to add product.\n${err}`);
        return res.status(400).json(err.message.slice(27).split(", "));
      });
  });

export default router;
