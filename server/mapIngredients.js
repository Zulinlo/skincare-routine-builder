import fetch from "node-fetch";
import request from "request";
import mongoose from "mongoose";
import dotenv from "dotenv";
import stringSimilarity from "string-similarity";

import { Product, IngredientMapped, Ingredient } from "./models.js";

dotenv.config();
// Connect to MongoDB Atlas Collection
mongoose
  .connect(
    `mongodb+srv://Zulinlo:${process.env.MONGO_ATLAS_PW}@cluster0.1xtgu.mongodb.net/skincareRoutineBuilderDB?retryWrites=true&w=majority`
  )
  .then((res) => console.log("Successful connection to MongoDB Atlas."))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const postIngredient = async (ingredient) => {
    if (!ingredient)
        return;

    const { name, rating, description, purpose } = ingredient;

    const isExists = await IngredientMapped.exists({
        name: ingredient.name,
    });
    if (isExists) return;

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
      })
      .catch((err) => {
        console.log(`Failed to add ingredient.\n${err}`);
      });
};

const findIngredient = (name, ingredients) => {
    if (name.length > 85)
        return null;
        
    let optimalMatch = null;
    let maxMatch = 0;
    for (let k = 0; k < ingredients.length; k++) {
        let currMatch = stringSimilarity.compareTwoStrings(name, ingredients[k].name);
        if (maxMatch < currMatch && currMatch > 0.7) {
            optimalMatch = { name: name, rating: ingredients[k].rating, purpose: ingredients[k].purpose, description: ingredients[k].description };
            maxMatch = currMatch;
        }
    }

    return optimalMatch || { name: name, rating: null, purpose: null, description: null };
}

// add allIngredients then loop through then check if any simillarity, if so then add to db else nothing
const main = async () => {
    const allIngredients = new Set();
    const allProducts = await Product.find();
    for (let i = 0; i < allProducts.length; i++) {
        let productIngredients = allProducts[i].ingredients;
        for (let j = 0; j < productIngredients.length; j++) {
            allIngredients.add(productIngredients[j]);
        }
    }

    const allIngredientsArr = Array.from(allIngredients);
    const paulasIngredients = await Ingredient.find();
    for (let i = 0; i < allIngredientsArr.length; i++) {
        postIngredient(findIngredient(allIngredientsArr[i], paulasIngredients));
    }
}

main();