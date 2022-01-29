import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import ingredientsRouter from "./routes/ingredients.js";
import mappedIngredientsRouter from "./routes/mappedIngredients.js";
import productsRouter from "./routes/products.js";
import productReviewsRouter from "./routes/productReviews.js";
import usersRouter from "./routes/users.js";

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

const app = express();

// CORS
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// API endpoints
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/mappedIngredients", mappedIngredientsRouter);
app.use("/api/products", productsRouter);
app.use("/api/product-reviews", productReviewsRouter);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
