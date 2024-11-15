import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import {uploadOnCloudinary} from "../utils/cloudinary.util.js"
import { getVideoDurationInSeconds } from 'get-video-duration';
import { response } from "express";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    // ? AI Integration - based on userWatchHistory & Playlist Optional (Smart Queries)

    const videos = await Video.aggregate(
        [
            //TODO: Start Next With Hear
        ]
    );
    if (videos === 0 || videos === null) {
        throw new ApiError(404, "No videos found");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            videos,
            "Videos retrieved successfully"
        )
    );
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }
    if (!description) {
        throw new ApiError(400, "Description is required");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required");
    }

    const duration = await getVideoDurationInSeconds(videoLocalPath);
    if (typeof duration !== 'number') {
        throw new ApiError(400, "Unable to get video duration");
    }

    const owner = req.user._id;
    if (!mongoose.isValidObjectId(owner)) {
        throw new ApiError(400, "Invalid owner");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath, "videoFile");
    if (!videoFile) {
        throw new ApiError(400, "Unable to upload video file");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "thumbnail");
    if (!thumbnail) {
        throw new ApiError(400, "Unable to upload thumbnail file");
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration,
        isPublished: true,
        owner
    });

    if (!video) {
        throw new ApiError(500, "Unable to create video");
    }

    // Return success response
    return res
    .status(201)
    .json(
        new ApiResponse(
            200, 
            video, 
            "Video uploaded successfully"
        )
    );
});


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            video, 
            "Video retrieved successfully"
        )
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {
        title,
        description,
        thumbnail
    } = req.body;

    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }

    let updateData = {};
    if (title && title.trim() !== '') updateData.title = title;
    if (description && description.trim()!== '') updateData.description = description;
    // if (thumbnail && thumbnail.trim()!== '') updateData.thumbnail = thumbnail;
    if (thumbnail) {
        const thumbnailLocalPath = req.file?.path;
        // if (!thumbnailLocalPath) {
        //     throw new ApiError(400, "Thumbnail file is required");
        // }
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "thumbnail");
        if (!thumbnail) {
            throw new ApiError(400, "Unable to upload thumbnail file");
        }
        updateData.thumbnail = thumbnail.url;
    }

    //! TODO: Thumbnail Update make it workable

    // Check if the update object is empty
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json(new ApiResponse(400, {}, "No valid fields provided for update"));
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        updateData,
        {
            new: true,
            runValidators: false
        }
    );

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            video, 
            "Video updated successfully"
        )
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== userId?.toString()) {
        throw new ApiError(403, "Unauthorized to delete this video");    
    }

    const deleteVideo = await Video.findByIdAndDelete(videoId);
    if (!deleteVideo) {
        throw new ApiError(500, "Unable to delete video");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Video deleted successfully"
        )
    );

    //TODO: cloudinary delete video 
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
