const user_model = require("../models/user_model");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.route("/register").post(async (req, res) => {
  const email = req.body.email;
  const user = await user_model.findOne({
    email: email,
  });
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const newUser = new user_model({
      name: req.body.name,
      email: req.body.email,
      password: password,
      id: req.body.id,
      role: req.body.role,
      gender: req.body.gender,
    });
    try {
      await newUser.save();
      return res.send(newUser);
    } catch (error) {}
  }

  res.send("Email already in use");
});

router
  .route("/login")
  .post(async (req, res) => {
    const users = await user_model.findOne({
      email: req.body.email,
    });
    if (users) {
      const correctPassword = await bcrypt.compare(
        req.body.password,
        users.password
      );

      if (correctPassword) {
        const token = jwt.sign(
          {
            _id: users._id,
            role: users.role,
            id: users.id,
          },
          process.env.TOKEN_SECRET
        ); //digital signature
        res.header("token", token).send(token);
      } else {
        return res.status(401).send("Invalid Password");
      }
    }
  })
  .get(async (req, res) => {
    // const test = req.headers.token;
  });

module.exports = router;
