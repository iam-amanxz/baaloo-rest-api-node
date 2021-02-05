const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    condition: { type: String, enum: ["used", "new"], required: true },
    endingAt: { type: Date, required: true },
    bids: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "expired"], default: "active" },
    photos: { type: [String], min: 1 },
    owner: { type: Schema.ObjectId, ref: "User", required: true },
    phone: { type: String, required: true },
    email: { type: String, default: null },
    // TODO:enum
    district: { type: String, default: null },
    city: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
