import { asyncHandlers } from "../utils/asyncHandler.util.js";

const uploadVideo = asyncHandlers(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Video uploaded successfully",
  });
});

const getVideo = asyncHandlers(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Video fetched successfully",
  });
});

export { 
  uploadVideo,
  getVideo 
};