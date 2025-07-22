import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { Subscription } from "../models/subscription.model.js";
import jwt from "jsonwebtoken";

// // to know subs of channel 'xyz' -> we count channels from document such that channel=userID
// // to know a user 'abc' whome he subscribed to -> we count subscribers from document such that subscriber=userID -> count for total channels the user 'abc' subscribed to
//? to know if user 'abc' subscribed to channel 'xyz' -> we find a document such that subscriber=userID and channel=userID
//? and we can also find all channels a user 'abc' subscribed to -> we find all documents such that subscriber=userID
//? count to get total, and get full detail to get of which channel subscribe is done by user -> get all details we can get channel name cover image avatar fullname of channel etc...


const createSubscription = asyncHandler(
  async (req, res) => {
    
  }
)


export {

}