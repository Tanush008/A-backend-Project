import { Schema } from "mongoose";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    Password: {
      type: String,
      required: [true, "Password is requires"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.NotModified("Password")) {
    return next();
  }
  this.Password = await bcrypt.hash(this.Password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (Password) {
  return await bcrypt.compare(this.Password, Password);
};
userSchema.methods.generateAccessToken = function () {
  jwt.sign(
    {
      id: this.id,
      username: this.username,
      fullname: this.fullname,
      email: this.email,  
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "process.env.ACCESS_TOKEN_EXPIRY",
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  jwt.sign(
    {
      id: this.id,
    },  
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "process.env.REFRESH_TOKEN_EXPIRY",
    }
  );
};
export const User = mongoose.model("User", userSchema);
