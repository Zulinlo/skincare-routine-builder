import express from "express";

import mongoose from "mongoose";

import { User } from "../models.js";

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json("All users list");
  })
  .post(async (req, res) => {
    const { username, password, skinType, isSensitive = false } = req.body;

    const userExists = await User.exists({ username });
    if (userExists) return res.status(400).json(`Username is already taken`);

    const _id = new mongoose.Types.ObjectId();
    const newUser = new User({
      _id,
      username,
      password,
      skinType,
      isSensitive,
    });

    newUser
      .save()
      .then((result) => {
        console.log(`New user created!\n${result}`);
        return res.status(200).json({ _id });
      })
      .catch((err) => {
        console.log(`Failed user creation\n${err}`);
        return res.status(400).json(err.message.slice(24).split(", "));
      });
  });

export default router;
