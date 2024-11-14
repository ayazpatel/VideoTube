import { asyncHandler } from "../utils/asyncHandler.util.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
        // throw new ApiError(error.statusCode, error.message)
    }
}

const registerUser = asyncHandler( async (req, res) => {
    
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res
    


  const {fullName, email, username, password } = req.body
  //console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
      throw new ApiError(400, "All fields are required")
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
  if (password.includes(username) || password.includes(emailUsername) || password.includes(emailDomain)) {
    throw new ApiError(400, "Password must not contain your username or parts of your email");
  }

  const existedUser = await User.findOne({
      $or: [{ username }, { email }]
  })

  if (existedUser) {
      throw new ApiError(409, "User with email or username already exists")
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
  }
  

  if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
      throw new ApiError(400, "Avatar file is required")
  }


  const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email, 
      password,
      username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
  )

  if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered Successfully")
  )

} );

const loginUser = asyncHandler( async (req, res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie - secured

    const {email, username, password} = req.body

    // if (!email) {
    //     throw new ApiError(400, "Email is required")
    // }

    // if(!username) {
    //     throw new ApiError(400, "Username is required")
    // }

    //? !email || !username
    if (!(email || username)) {
        throw new ApiError(400, "Email or Username is required");
    }

    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    if (!user) {
        throw new ApiError(400, "User dose not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // make update existing user without making new db call
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // user.select("-password -refreshToken")

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken //! bad practice - but good for development practise
            }, 
            "User logged in successfully"
        )
    );

});

const logoutUser = asyncHandler(
    async (req, res) => {
        // const userId = req.user._id
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new: true
            }
        )

        const cookieOptions = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(200, {}, "User logged Out")
        )
    }
);

const refreshAccessToken = asyncHandler(
    async (req, res) => {
        // const refreshToken = req.cookies.refreshToken;
        // if (!refreshToken) {
        //     throw new ApiError(401, "Refresh token is required");
        // }

        const incomingRefreshToken = req.cookies.refreshToken || refreshTokenreq.body.refreshToken
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request");
        }
        
        try {
            const decodedToken = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            )
    
            const user = await User.findById(decodedToken?._id)
            if (!user) {
                throw new ApiError(401, "Invalid refresh token");
            }
    
            if (incomingRefreshToken !== user.refreshToken) {
                throw new ApiError(401, "Refresh token is expired or used");
            }
    
            const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
    
            const cookieOptions = {
                httpOnly: true,
                secure: true
            }
    
            return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken, refreshToken
                    },
                    "Access token refreshed"
                )
            )
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid refresh token");
        }

    }
);

const changeCurrentPassword = asyncHandler(
    async (req, res) => {
        const { oldPassword, newPassword , confirmNewPassword} = req.body;

        if(!(newPassword === confirmNewPassword)) {
            throw new ApiError(400, "New password and confirm new password do not match");
        }
        
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(400, "User not found");
        }

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid old password");
        }

        user.password = newPassword;
        await user.save({validateBeforeSave: false});

        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password changed successfully")
        );
    }
);

const getCurrentUser = asyncHandler(
    async (req, res) => {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                req.user, 
                "Current user fetched successfully"
            )
        );
    }
);

//? Professional Production Advice
//* Better Approach -> as we dont have to save a full user again in it as it cause text data to be saved again and again on database server side
//* file update -> like image etc -> make other controller or just hit a seperate endpoint to reduce network congession as hear text also gets updated may cause optimization issues..
const updateAccountDetails = asyncHandler(
    async (req, res) => {
        const { fullName, email } = req.body;

        if (!(fullName || email)) {
            throw new ApiError(400, "All fields are required");
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    fullName, //? ES6 syntax -> if key and value are same then we can write it once
                    //? i.e fullName: fullName
                    email
                }
            },
            {
                new: true //? this results in returning the updated user information
            },
            //? we can add another 3rd object too {}
        ).select("-password -refreshToken");

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User updated successfully"
            )
        );
    }
);

const updateUserAvatar = asyncHandler(
    async (req, res) => {
        
        const avatarLocalPath = req.file?.path;
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is missing");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
            throw new ApiError(400, "Error while uploading avatar");
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    avatar: avatar.url
                }
            },
            {
                new: true
            }
        ).select("-password -refreshToken");

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Avatar updated successfully"
            )
        );
    }
);

const updateUserCoverImage = asyncHandler(
    async (req, res) => {
        
        const coverImageLocalPath = req.file?.path;
        if (!coverImageLocalPath) {
            throw new ApiError(400, "Cover image file is missing");
        }

        //TODO: delete old image

        const coverImage = await uploadOnCloudinary(coverImageLocalPath);
        if (!coverImage) {
            throw new ApiError(400, "Error while uploading coverImage");
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    coverImage: coverImage.url
                }
            },
            {
                new: true
            }
        ).select("-password -refreshToken");

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Cover image updated successfully"
            )
        );
    }
);

const getUserChannelProfile = asyncHandler(
    async (req, res) => {

        const { username } = req.params;
        if (!username?.trim()) {
            throw new ApiError(400, "Username is missing");
        }

        const channel = await User.aggregate(
            [
                {
                    $match: {
                        username: username.toLowerCase(), // safety lowercase as its already in db
                    }
                },
                { //in model everything gets to lowercase in mongodb and in plural format
                    $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "channel",
                        as: "subscribers"
                    }
                },
                {
                    $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "subscriber",
                        as: "subscribedTo"
                    }
                },
                {
                    $addFields: {
                        subscribersCount: {
                            $size: "$subscribers"
                        },
                        channelsSubscribedToCount: {
                            $size: "$subscribedTo"
                        }
                    }
                },
                {
                    isSubscribed: {
                        $cond: {
                            if: (isSubscribed) => {
                                $in: [req.user?._id, "$subscribers.subscriber"]
                                //? $in -> mongodb operator
                                //? $subscribers.subscriber -> mongodb field
                                //? req.user?._id -> mongodb field
                                
                            },
                            then: true,
                            else: false
                        }
                    }
                },
                {
                    $project: {
                        fullName: 1, //? 1 -> on & 0 -> off
                        username: 1,
                        subscribersCount: 1,
                        channelsSubscribedToCount: 1,
                        avatar: 1,
                        coverImage: 1,
                        email: 1
                    }
                }
            ]
        )
        if (!channel?.length) {
            throw new ApiError(404, "Channel does not exist");
        }
        console.log(channel);
        
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channel[0],
                "User channel fetched successfully"
            )
        );
    }
);

const getWatchHistory = asyncHandler(
    async (req, res) => {
        const user = await User.aggregate(
            [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(req.user._id)
                    }
                },
                {
                    $lookup: {
                        from: "videos",
                        localField: "watchHistory", //* we are in users collection
                        foreignField: "_id",
                        as: "watchHistory",
                        //? pupulate: -> to get the data from the other collection, learn from mongodb docs and mongoose docs
                        pipeline: [
                            {
                                $lookup: {
                                    from: "users",
                                    localField: "owner", //* now we are in videos collection
                                    foreignField: "_id",
                                    as: "owner",
                                    pipeline: [
                                        {
                                            $project: {
                                                fullName: 1,
                                                username: 1,
                                                avatar: 1
                                            }
                                        }
                                    ]
                                },
                            },
                            // * just for checking and learning purpose
                            // {
                            //     $project: {
                            //         fullName: 1,
                            //         username: 1,
                            //         avatar: 1
                            //     }
                            // },
                            {
                                $addFields: {
                                    //? hear existing owner field will be overwritten by new owner field that i defined below
                                    owner: {
                                        $first: "$owner"
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        )
        if (!user?.length) {
            throw new ApiError(404, "User does not exist");
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch history fetched successfully"
            )
        );
    }
);


export { 
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
};

//linter










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
