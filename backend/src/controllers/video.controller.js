import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import {uploadOnMinIO, deleteFromMinIO, extractKeyFromUrl} from "../utils/minio.util.js"
import { getVideoDurationInSeconds } from 'get-video-duration';
import { response } from "express";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

    // Build the aggregation pipeline
    const pipeline = [];

    // Match stage for filtering
    const matchConditions = { isPublished: true };
    
    if (query) {
        matchConditions.title = { $regex: query, $options: 'i' };
    }
    
    if (userId && mongoose.isValidObjectId(userId)) {
        matchConditions.owner = new mongoose.Types.ObjectId(userId);
    }

    pipeline.push({ $match: matchConditions });

    // Lookup owner details
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails",
            pipeline: [
                {
                    $project: {
                        username: 1,
                        fullName: 1,
                        avatar: 1
                    }
                }
            ]
        }
    });

    // Add owner details
    pipeline.push({
        $addFields: {
            ownerDetails: {
                $first: "$ownerDetails"
            }
        }
    });

    // Sort stage
    const sortOrder = sortType === 'desc' ? -1 : 1;
    pipeline.push({ $sort: { [sortBy]: sortOrder } });

    // Project stage to select required fields
    pipeline.push({
        $project: {
            videoFile: 1,
            thumbnail: 1,
            title: 1,
            description: 1,
            duration: 1,
            views: 1,
            createdAt: 1,
            ownerDetails: 1
        }
    });

    // Pagination options
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    // Execute aggregation with pagination
    const videos = await Video.aggregatePaginate(
        Video.aggregate(pipeline),
        options
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos: videos.docs,
                totalDocs: videos.totalDocs,
                totalPages: videos.totalPages,
                currentPage: videos.page,
                hasNextPage: videos.hasNextPage,
                hasPrevPage: videos.hasPrevPage
            },
            "Videos fetched successfully"
        )
    );
});

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

    const videoFile = await uploadOnMinIO(videoLocalPath, "videos");
    if (!videoFile) {
        throw new ApiError(400, "Unable to upload video file");
    }
    const thumbnail = await uploadOnMinIO(thumbnailLocalPath, "thumbnails");
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

// ? Direct Array Object Entry 
// async function addToWatchHistory(userId, newEntry) {
//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             throw new Error('User not found');
//         }

//         user.watchHistory.push(newEntry);
//         await user.save();

//         // console.log('Watch history updated successfully');
//     } catch (error) {
//         // console.error('Error updating watch history:', error);
//     }
// }
// ? Direct Video ID Entry
async function addToWatchHistory(userId, videoId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.history.push(videoId);
        await user.save();

        // console.log('Watch history updated successfully');
    } catch (error) {
        // console.error('Error updating watch history:', error);
    }
}

const getVideoById = asyncHandler(async (req, res) => {

    //view + 1 count
    //hhistory add as marked
    const { videoId } = req.params
    const video = await Video.findByIdAndUpdate(
        videoId,
        { 
            $inc: {
                views: 1 
            } 
        },
        { new: true }
    );
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }

    // const newHistory = {
    //     videoId: video._id,
    //     thumbnail: video.thumbnail,
    //     title: video.title,
    //     description: video.description,
    //     duration: video.duration,
    //     views: video.views,
    //     owner: video.owner,
    //     rating: 0
    // }

    // const historyResult = await addToWatchHistory(userId, newHistory);
    // if (historyResult === null) {
    //     throw new ApiError(500, "Unable to add to watch history");
    // }

    const historyResult = await addToWatchHistory(userId, videoId);
    if (historyResult === null) {
        throw new ApiError(500, "Unable to add to watch history");
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
    
    // Handle thumbnail update
    const thumbnailLocalPath = req.file?.path;
    if (thumbnailLocalPath) {
        // Get current video to get old thumbnail URL
        const currentVideo = await Video.findById(videoId);
        const oldThumbnailUrl = currentVideo?.thumbnail;

        const thumbnail = await uploadOnMinIO(thumbnailLocalPath, "thumbnails");
        if (!thumbnail) {
            throw new ApiError(400, "Unable to upload thumbnail file");
        }
        updateData.thumbnail = thumbnail.url;

        // Delete old thumbnail from MinIO if it exists
        if (oldThumbnailUrl) {
            try {
                const oldThumbnailKey = extractKeyFromUrl(oldThumbnailUrl);
                await deleteFromMinIO(oldThumbnailKey);
            } catch (error) {
                console.log("Error deleting old thumbnail:", error);
                // Don't throw error here as the main operation (update) was successful
            }
        }
    }

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

    // Extract keys for MinIO deletion
    const videoFileKey = extractKeyFromUrl(video.videoFile);
    const thumbnailKey = extractKeyFromUrl(video.thumbnail);

    const deleteVideo = await Video.findByIdAndDelete(videoId);
    if (!deleteVideo) {
        throw new ApiError(500, "Unable to delete video");
    }

    // Delete video file and thumbnail from MinIO
    try {
        if (videoFileKey) {
            await deleteFromMinIO(videoFileKey);
        }
        if (thumbnailKey) {
            await deleteFromMinIO(thumbnailKey);
        }
    } catch (error) {
        console.log("Error deleting files from MinIO:", error);
        // Don't throw error here as the main operation (delete) was successful
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
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You can only toggle publish status of your own videos");
    }

    const toggledVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        { new: true }
    );

    if (!toggledVideo) {
        throw new ApiError(500, "Failed to toggle publish status");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { isPublished: toggledVideo.isPublished },
                `Video ${toggledVideo.isPublished ? 'published' : 'unpublished'} successfully`
            )
        );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
