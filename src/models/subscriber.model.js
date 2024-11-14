import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }
}, { timestamps: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);