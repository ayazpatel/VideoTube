import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Comment} from "../models/comment.model.js"
import {Video} from "../models/video.model.js"
import {Tweet} from "../models/tweet.model.js"
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    // Check if video exists
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const likedAlready = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id,
    })

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready?._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200, { isLiked: false }, "Video unliked successfully")
            )
    }

    await Like.create({
        video: videoId,
        likedBy: req.user?._id,
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { isLiked: true }, "Video liked successfully")
        )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    // Check if comment exists
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const likedAlready = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id,
    })

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready?._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200, { isLiked: false }, "Comment unliked successfully")
            )
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user?._id,
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { isLiked: true }, "Comment liked successfully")
        )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    // Check if tweet exists
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    const likedAlready = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id,
    })

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready?._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully")
            )
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id,
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { isLiked: true }, "Tweet liked successfully")
        )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideosAggegate = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: { $exists: true, $ne: null }
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideo",
            },
        },
        {
            $unwind: "$likedVideo",
        },
        {
            $lookup: {
                from: "users",
                localField: "likedVideo.owner",
                foreignField: "_id",
                as: "ownerDetails",
            },
        },
        {
            $unwind: "$ownerDetails",
        },
        {
            $project: {
                _id: 0,
                likedVideo: {
                    _id: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    owner: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    duration: 1,
                    createdAt: 1,
                    isPublished: 1,
                    ownerDetails: {
                        username: 1,
                        fullName: 1,
                        avatar: 1,
                    },
                },
            },
        },
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideosAggegate,
                "Liked videos fetched successfully"
            )
        )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}