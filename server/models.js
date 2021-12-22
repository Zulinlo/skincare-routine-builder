import mongoose from "mongoose";
import bcrypt from "bcrypt";

/** Helper validation functions */
const isAlphanumeric = (v) => v.match(/^[a-zA-Z0-9]+$/);

/** Schemas with validation */
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: [true, "Username is required."],
    minLength: [3, "Username must be at least 3 characters long."],
    maxLength: [100, "Username must be less than 100 characters long."],
    validate: [isAlphanumeric, "Username must be alphanumeric."],
  },
  password: {
    type: String,
    select: false,
    required: [true, "Password is required."],
    minLength: [8, "Password must be at least 8 characters long."],
    maxLength: [100, "Password must be less than 100 characters long."],
  },
  skinType: {
    type: String,
    required: [true, "Skin type is required"],
    enum: {
      values: ["normal", "dry", "oily", "combination"],
      message: "Skin type is not valid.",
    },
  },
  isSensitive: {
    type: Boolean,
    required: true,
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  next();
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, "Name is required."],
    minLength: [3, "Name must be at least 3 characters long."],
    maxLength: [500, "Name must be less than 500 characters long."],
  },
  imagePath: {
    type: String,
    required: [true, "Image path is required."],
  },
  brand: {
    type: String,
    required: [true, "Brand is required."],
    minLength: [3, "Brand must be at least 3 characters long."],
    maxLength: [100, "Brand must be less than 100 characters long."],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required."],
    minLength: [3, "Description must be at least 3 characters long."],
    maxLength: [2000, "Description must be less than 2000 characters long."],
  },
  volume: {
    type: String,
    required: [true, "Volume is required."],
    minLength: [3, "Volume must be at least 3 characters long."],
    maxLength: [100, "Volume must be less than 100 characters long."],
  },
  directions: {
    type: String,
    required: [true, "Directions are required."],
    minLength: [3, "Directions must be at least 3 characters long."],
    maxLength: [2000, "Directions must be less than 2000 characters long."],
  },
  ingredients: {
    type: [String],
    required: [true, "Ingredients list is required."],
  },
  step: {
    type: String,
    required: [true, "Step is required"],
    enum: {
      values: [
        "cleanser",
        "oilCleanser",
        "exfoliant",
        "toner",
        "serum",
        "moisturiser",
        "mask",
        "eyeTreatment",
        "sunscreen",
      ],
      message: "Step is not valid.",
    },
  },
  skinType: {
    type: String,
    required: [true, "Skin type is required"],
    enum: {
      values: ["normal", "dry", "oily", "combination", "sensitive"],
      message: "Skin type is not valid.",
    },
  },
  averageReview: {
    type: Number,
    required: [true, "Average review is required"],
  },
  numberOfReviews: {
    type: Number,
    required: [true, "Number of reviews is required"],
  },
});

const isValidReviewRating = (n) => 0 < n && n <= 5;

const productReviewSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    rating: {
      type: Number,
      required: [true, "Rating is required."],
      validate: [isValidReviewRating, "Rating must be 1-5."],
    },
    date: {
      type: Date,
      required: [true, "Date is required."],
    },
    message: {
      type: String,
      minLength: [3, "Message must be at least 3 characters long."],
      maxLength: [1000, "Message must be less than 1000 characters long."],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Reviewed product id is required."],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Sender id is required."],
    },
  },
  { collection: "productReviews" }
);

const isValidIngredientRating = (n) => 0 <= n && n < 4;

const ingredientSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, "Name is required."],
    minLength: [3, "Name must be at least 3 characters long."],
    maxLength: [100, "Name must be less than 100 characters long."],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required."],
    validate: [isValidIngredientRating, "Rating must be 0-3."],
  },
  description: {
    type: String,
    minLength: [3, "Description must be at least 3 characters long."],
    maxLength: [1000, "Description must be less than 1000 characters long."],
  },
  purpose: {
    type: [String],
    required: [true, "Purpose is required."],
  },
});

export const User = mongoose.model("User", userSchema);
export const Product = mongoose.model("Product", productSchema);
export const ProductReview = mongoose.model(
  "productReviews",
  productReviewSchema
);
export const Ingredient = mongoose.model("Ingredient", ingredientSchema);
