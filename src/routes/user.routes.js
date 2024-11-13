import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

//* userRouter
router.route("/register").post(registerUser);

// .post((req, res) => {
//   res.status(200).json({
//     message: "OK"
//   })
// })

export default router;