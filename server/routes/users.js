import express from "express"
import mongoose from "mongoose";

import { User } from "../models.js";

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    return res.json("All users list");
  })
  .post(async (req, res) => {
    const { uuid, skinType, isSensitive = false, dayRoutine, nightRoutine } = req.body;

    const userExists = await User.exists({ uuid });
    if (userExists) return res.status(400).json(`Uuid is already taken.`);

    const _id = new mongoose.Types.ObjectId();
    const newUser = new User({
      _id,
      uuid,
      skinType,
      isSensitive,
      dayRoutine, 
      nightRoutine
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
  })
  
router
  .route("/:uuid")
  .get(async (req, res) => {
    if (req.query.isRoutineDay === null)
      return res.status(400).json("Day or night routine needs to be specified.");

    const user = await User.findOne({ uuid: req.params.uuid }).lean();
    if (!user)
      return res.status(400).json("User does not exist.");

    return req.query.isRoutineDay === "true" ? res.status(200).json(user.dayRoutine) : res.status(200).json(user.nightRoutine);
  });

export default router;
