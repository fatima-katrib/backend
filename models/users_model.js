import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema, model } = mongoose;
import Program from "./programs_model.js";

let validateEmail = function (email) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const UserSchema = new Schema(
  {
    ////********************User Info************************/////
    first_name: {
      type: String,
      // required: [true, "first_name is required"],
      required: function () {
        return this.role === "user" || this.role === "admin";
      },
      trim: true,
    },
    last_name: {
      type: String,
      // required: [true, "last_name is required"],
      required: function () {
        return this.role === "user" || this.role === "admin";
      },
      trim: true,
    },
    // gender: {
    //   type: String,
    //   enum: {
    //     values: ["female", "male"],
    //     message: "{Value} is not not supported",
    //   },
    //   required: function () {
    //     return this.role === "user";
    //   },
    // },

    ///////////////////**************organization Info***********************/////////////
    org_name: {
      type: String,
      required: [true, "first_name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    intervention_sectors: {
      type: [String],
      required: function () {
        return this.role === "organization";
      },
    },
    founding_year: {
      type: Number,
      required: function () {
        return this.role === "organization";
      },
      validate: {
        validator: function (value) {
          const currentYear = new Date().getFullYear();
          const minYear = 1500;
          return (
            Number.isInteger(value) && value >= minYear && value <= currentYear
          );
        },
        message: "founding_year must be a valid year",
      },
    },
    isLocal: {
      type: Boolean,
      default: true,
    },
    // isApproved: {
    //   type: Boolean,
    //   default: false,
    // },
    // manager_name: {
    //   type: String,
    //   trim: true,
    //   required: [true, "manager_name is required"],
    // },

    contact_person_name: {
      type: String,
      trim: true,
      required: [true, "contact_person_name is required"],
    },
    contact_person_position: {
      type: String,
      trim: true,
      required: [true, "contact_person_name is required"],
    },
    contact_person_phone: {
      type: String,
      trim: true,
      required: [true, "contact_person_name is required"],
    },
    contact_person_email: {
      type: String,
      trim: true,
      required: [true, "contact_person_name is required"],
    },
    fb_link: {
      type: String,
      trim: true,
    },
    insta_link: {
      type: String,
      trim: true,
    },
    linkedin_link: {
      type: String,
      trim: true,
    },
    web_link: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },

    // program_enrolled: [
    //   {
    //     type: ProgramSchema,
    //     required: function () {
    //       return this.role === "user";
    //     },
    //   },
    // ],
    // organization: {
    //   type: OrganizationSchema,
    //   required: function () {
    //     return this.role === "organization";
    //   },
    // },

    ///////////////////////////************common Info*************//////////////////
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
    },
    password: {
      type: String,
      trim: true,
      required: "password is required",
      minLength: [8, "the password should be at least 8 characters"],
      maxLength: [30, "the password should be 30 characters max"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{8}$/, "Please enter a valid phone number with 8 digits"],
      unique: [true, "already exist"],
      default: "not found",
    },

    district: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: {
        values: ["user", "organization", "admin"],
        message: "{Value} is not not supported",
      },
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "User",
  }
);
UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.plugin(mongoosePaginate);

// UserSchema.pre("save", async function (next) {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(this.password, salt);
//     this.password = hashedPassword;
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

UserSchema.pre("findOneAndUpdate", function () {
  this.$where = { isDeleted: false };
});
UserSchema.post('findOneAndDelete', async function (doc, next) {
  await Program.deleteMany({ user_id: doc._id }).exec();
  next();
});

const User = model("User", UserSchema);
export default User;
