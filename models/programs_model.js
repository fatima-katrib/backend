import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema, model } = mongoose;

const ProgramSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    start_date: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (value) {
          return (
            typeof new Date(value) === "date" && new Date(value) >= new Date()
          );
        },
        message: (value) =>
          `${value} must be greater than or equal to the current date!`,
      },
    },
    end_date: {
      type: Date,
      validate: {
        validator: function (value) {
          return value >= this.start_date;
        },
        message: "end date must be after or equal to the start date!",
      },
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    application_link: {
      type: String,
    },
    sector: {
      type: String,
      required: [true, "sector is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "Program",
  }
);
ProgramSchema.plugin(mongoosePaginate);

ProgramSchema.pre(["find", "findOne", "findOneAndUpdate"], function () {
  this.populate(["User"]);
});

ProgramSchema.pre(["find", "findOne", "findOneAndUpdate"], function () {
  this.$where = { isActive: true };
});

const Program = model("Program", ProgramSchema);
export default Program;
