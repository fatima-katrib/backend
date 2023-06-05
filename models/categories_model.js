import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema, model } = mongoose;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
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
    collection: "Category",
  }
);
CategorySchema.plugin(mongoosePaginate);

const Category = model("Category", CategorySchema);
export default Category;