import { Router } from "express";
import {
  changeCurrPassword,
  getChannelProfile,
  getCurrentUser,
  loginUser,
  logoutuser,
  refreshAccessToken,
  registerUser,
  updateAvatar,
  updateUserDetails,
  getWatchHistory
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/authorization.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/loginUser").post(loginUser);
// secured routes
router.route("/logout").post(verifyjwt, logoutuser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/changecurrPass").post(verifyjwt, changeCurrPassword);
router.route("/curr-user").get(verifyjwt, getCurrentUser);
router.route("update-details").patch(verifyjwt, updateUserDetails);
router.route("avatar").patch(verifyjwt, upload.single("avatar"), updateAvatar);
router.route("c/:username").get(verifyjwt, getChannelProfile);
router.route("/history").get(verifyjwt, getWatchHistory);

export default router;
