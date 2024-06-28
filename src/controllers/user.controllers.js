import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.models.js";
import { uploadCloudinaryFile } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation-not empty details
  // check if user exist or  not - username,email
  // check for images,avatar
  // upload them to cloudinary,avatar
  // create user object - create entry in db
  // remove password and refresh token field from the response
  // check for user creation
  // send response to frontend

  const { fullname, email, username, password } = req.body;
  console.log("email:", email);

  if (
    [fullname, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiErrors(404, "All field are requires");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  //   just for checking
  console.log(existedUser);

  if (existedUser) {
    throw new ApiErrors(404, "User already exist");
  }
  const avatarFileLocalPath = req.files?.avatar[0]?.path;
  const coverImageFileLocalPath = req.files?.coverImage[0]?.path;

  const avatar = await uploadCloudinaryFile(avatarFileLocalPath);
  const coverImage = await uploadCloudinaryFile(coverImageFileLocalPath);

  if (!avatar) {
    throw new ApiErrors(404, "Avatar upload failed");
  }

  const user = await User.create({
    fullname,
    email,
    username: username.toLowercase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiErrors(500, "User creation failed");
  }
  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  // req body- data
  // user want to register with username or email
  // find the user
  // check the user with password
  // give access token and refresh token
  // send them through cookies
  const generateAccessandRefreshToken = async (userId) => {
    try {
      const user = await User.findById(user);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validationBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiErrors(500, "Something went wrong");
    }
  };
  const { email, username, password } = req.body;
  if (!username || !email) {
    throw new ApiErrors(404, "username or email is required");
  }
  const user = await User.findOne({ $or: [{ username, email }] });
  if (!user) {
    throw new ApiErrors(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiErrors(401, "Invalid password");
  }
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );
  const loginUser = User.findById(user._id.select(-password - refreshToken));
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loginUser,
        accessToken,
        refreshToken,
        message: "User register Succcesfully",
      })
    );
});
const logoutuser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingToken) {
    throw new ApiErrors(401, "Invalid request");
  }
  try {
    const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN);
    const user = awaitUser.findById(decodedToken._id);
    if (!user) {
      throw new ApiErrors(401, "Invalid refresh token");
    }
    if (incomingToken !== user?.refreshToken) {
      throw new ApiErrors(401, "Refresh Token is expiry");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, NewrefreshToken } = await generateAccessToken(
      user._id
    );
    return res
      .status(200)
      .cookies("accessToken", accessToken, options)
      .cookies("refreshToken", NewrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: NewrefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiErrors(
      error?.message || 500,
      "Failed to refresh access token"
    );
  }
});
const changeCurrPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiErrors(401, "Invalid old password");
  }
  user.password = newPassword;
  await user.save({ validationBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});
const getCurrentUser = asyncHandler((req, res) => {
  return res.status(200).json(200, req.user, "current user fetched");
});
const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body();
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});
const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocal = avatar.file?.path;
  if (!avatarLocal) {
    throw new ApiErrors(400, "Avatar file is missing");
  }
  const avatar = await uploadCloudinaryFile(avatarLocal);
  if (!avatar.url) {
    throw new ApiErrors(500, "Failed to upload avatar");
  }
  const user = User.findByIdAndUpdate(
    req.user?.id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Avatar updated successfully"));
});

const getChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiErrors(400, "username is missing");
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowercase(),
      },
    },
    {
      $lookup: {
        from: "subsctriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subsctriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subcriptionsCount: {
          $size: "$subscribers",
        },
        channelCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?.id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        avatar: 1,
        subcriptionsCount: 1,
        channelCount: 1,
        isSubscribed: 1,
        email: 1,
        coverImage: 1,
      },
    },
  ]);
  console.log(channel);
  if (!channel?.length) {
    throw new ApiErrors("channel not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, channel[0], "user channel fetch successfully"));
});
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);
  res
    .status(200)
    .json(
      new ApiResponse(200, user[0], "user watch history fetch successfully")
    );
});
export {
  registerUser,
  loginUser,
  logoutuser,
  refreshAccessToken,
  changeCurrPassword,
  getCurrentUser,
  updateUserDetails,
  updateAvatar,
  getChannelProfile,
  getWatchHistory,
};
