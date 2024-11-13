import { asyncHandler } from "../utils/asyncHandler.util.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";

const registerUser = asyncHandler( async (req, res) => {
  return res.status(200).json(
    // new ApiResponse(200, "OK")
    {
      message: "User registered successfully",
    }
  );
} )

// .post((req, res) => {
//   res.status(200).json({
//     message: "OK"
//   })
// })
export { registerUser };