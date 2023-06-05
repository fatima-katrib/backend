import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
// import User from "./users_model";
const { Schema, model } = mongoose;

const CommitmentSchema = new Schema(
  {
    rate: {
      type: Number,
      default: 10,
    },
    level: {
      type: Number,
    },
    beneficiary_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (v) {
          const user = await this.model("User").findById(v);
          return user.role === "user";
        },
        message: "user ID is not valid.",
      },
    },
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (v) {
          const user = await this.model("User").findById(v);
          return user.role === "organization";
        },
        message: "Organization ID is not valid.",
      },
    },

    //////////make sure to filter users role above///////

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "Commitment",
  }
);
CommitmentSchema.plugin(mongoosePaginate);

const Commitment = model("Commitment", CommitmentSchema);
export default Commitment;
