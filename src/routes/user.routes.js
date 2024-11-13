import { Router } from "express";
import { 
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
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

router.route("/login").post(loginUser);

//* secured routes
router.route("/logout").post(
  verifyJWT, // middleware
  logoutUser // controller
);
router.route("/refresh-token").post(refreshAccessToken);
//* secured routes ends

export default router;




// .post((req, res) => {
//   res.status(200).json({
//     message: "OK"
//   })
// })
