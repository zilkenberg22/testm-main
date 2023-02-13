import mongoose from "mongoose";

const UserTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30 * 86400, // 30 days
    },
});

export default mongoose.models.UserToken || mongoose.model("UserToken", UserTokenSchema);
