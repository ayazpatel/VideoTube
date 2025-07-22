import { asyncHandler } from "../utils/asyncHandler.util.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(
  // req, res, next
  async (req, _, next) => {
    /*
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  //   const user = await User.findById(decodedToken?._id)
  //     .select("-password -refreshToken")
  //     .then((user) => {
  //       if (!user) {
  //         throw new ApiError(401, "Invalid Access Token")
  //       }
  //       req.user = user;
  //       next()
  //     })
  //     .catch((error) => {
  //       throw new ApiError(401, error?.message || "Invalid access token")
  //     })

    const user =await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;
    next()
    */

    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
  
      if (!token) {
        throw new ApiError(401, "Unauthorized request")
      }
  
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
      const user =await User.findById(decodedToken?._id).select("-password -refreshToken");
  
      if (!user) {
        throw new ApiError(401, "Invalid Access Token")
      }
  
      req.user = user;
      next()
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token")
    }

  }
)