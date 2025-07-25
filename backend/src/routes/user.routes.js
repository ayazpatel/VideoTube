import { Router } from "express";
import { 
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//* userRouter
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    }, 
    {
      name: "coverImage",
      maxCount: 1
    }
  ]),
  registerUser
);

router.route("/login").post(
  loginUser
);

//* secured routes
router.route("/logout").post(
  verifyJWT, // middleware
  logoutUser // controller
);
router.route("/refresh-token").post(
  refreshAccessToken
);
router.route("/change-password").post(
  verifyJWT, 
  changeCurrentPassword
);
router.route("/update-account").patch(
  verifyJWT,
  updateAccountDetails
);
router.route("/avatar").patch(
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
);
router.route("/cover-image").patch(
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage
);
router.route("/current-user").get(
  verifyJWT,
  getCurrentUser
);

//?params write 
//* -> key: value <-- 'value' is param value
router.route("/channel/:username").get(
  verifyJWT,
  getUserChannelProfile
);
router.route("/history").get(
  verifyJWT,
  getWatchHistory
);
//* secured routes ends

export default router;




// .post((req, res) => {
//   res.status(200).json({
//     message: "OK"
//   })
// })
