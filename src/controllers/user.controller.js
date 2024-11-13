import { asyncHandler } from "../utils/asyncHandler.util.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

const registerUser = asyncHandler(
  async (req, res) => {
    
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {
      fullName,
      email,
      username,
      password
    } = req.body

    console.log("email", email);


    //? Validations
    
    if ([fullName, email, username, password].some( () => field?.trim() === "" )) {
      throw new ApiError(400, "All fields are required");
    }

    // email & password validation regex pattern
    // Regular expression for validating email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    // Regular expression for validating password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new ApiError(400, "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long");
    }

    // Extract username and domain from email
    const emailParts = email.split('@');
    const emailUsername = emailParts[0];
    const emailDomain = emailParts[1].split('.')[0]; // Assuming the domain is the part before the first dot

    // Check if password contains username or email domain
    // if (password.includes(username) || password.includes(emailUsername) || password.includes(emailDomain)) {
    //   throw new ApiError(400, "Password must not contain your username or parts of your email");
    // }

    const userExists = await User.findOne({
      $or: [
        { email }, 
        { username }
      ]
    });
    if (userExists) {
      throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocal);

    if (!avatar) {
      throw new ApiError(400, "Avatar upload failed");
    }

    const user =await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
    });
    
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(400, "Something went wrong while registering the user");
    }

    console.log(user);
    console.table(user);
    console.log(createdUser);
    console.table(createdUser);
    
    return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered successfully")
    );
  }
)

export { registerUser };











//? Proper Routes to Controller connections from app.js
//* Sample - dots connected ==> app.js->user.routes.js->user.controller.js
//? app.js
//* import userRouter from './routes/user.routes.js';
//* app.use("/api/v1/users", userRouter);
//? user.routes.js
//* import { Router } from "express";
//* import { registerUser } from "../controllers/user.controller.js";
//* const router = Router();
//* router.route("/register").post(registerUser);
//? user.controller.js
//* const registerUser = asyncHandler( async (req, res) => {
//*   return res.status(200).json(
//*     {
//*       message: "User registered successfully",
//*     }
//*   );
//* } )
