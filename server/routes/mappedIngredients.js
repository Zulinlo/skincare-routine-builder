import express from "express";

import mongoose from "mongoose";

import { IngredientMapped } from "../models.js";

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json("All mapped ingredients list.");
  })
  .post(async (req, res) => {
    const { name, rating, description, purpose } = req.body;

    const isExists = await IngredientMapped.exists({
      name,
    });
    if (isExists) return res.status(400).json(`Ingredient already exists.`);

    const _id = new mongoose.Types.ObjectId();
    const newIngredient = new IngredientMapped({
      _id,
      name,
      rating,
      description,
      purpose,
    });

    newIngredient
      .save()
      .then((result) => {
        console.log(`Ingredient added!\n${result}`);
        return res.status(200).json({ _id });
      })
      .catch((err) => {
        console.log(`Failed to add ingredient.\n${err}`);
        return res.status(400).json(err.message.slice(30).split(", "));
      });
  });

export default router;
