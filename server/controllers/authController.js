import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  const userNameExists = await User.findOne({ username });

  if (userExists || userNameExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ username, email, password });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const user =
    (await User.findOne({ email })) || (await User.findOne({ username }));

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
});

export { registerUser, loginUser, logoutUser };
