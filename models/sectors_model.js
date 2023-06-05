import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema, model } = mongoose;

const SectorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Sector name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
      },
  },
  {
    timestamps: true,
    collection: "Sector",
  }
);
SectorSchema.plugin(mongoosePaginate);

const Sector = model("Sector", SectorSchema);
export default Sector;