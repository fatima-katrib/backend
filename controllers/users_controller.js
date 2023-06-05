import UserModel from "../models/users_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Function to generate access token
function generateAccessToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const options = {
    expiresIn: "1d",
  };
  const secret_key = process.env.JWT_SECRET;
  // Sign the token with a secret key
  return jwt.sign(payload, secret_key, options);
}

// Function to generate refresh token
function generateRefreshToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const options = {
    expiresIn: "30d",
  };
  const secret_key = process.env.JWT_REFRESH_SECRET;
  return jwt.sign(payload, secret_key, options);
}

//get all users
export const getAll = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const users = await UserModel.paginate({}, options);
    res.status(200).send({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//get users by id
export const get = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
};

//get Users only
export const getUser = async (req, res, next) => {
  try {
    const users = await UserModel.find({
      role: "user",
    });

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "users not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "users retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};
//get org only
export const getOrg = async (req, res, next) => {
  try {
    const organizations = await UserModel.find({
      role: "organization",
    });

    if (!organizations) {
      return res.status(404).json({
        success: false,
        message: "organization not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "organization retrieved successfully",
      organizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve organization",
      error: error.message,
    });
  }
};

export const register = async (req, res, next) => {
  const {
    email,
    password,
    phone,
    first_name,
    last_name,
    district,
    city,
    intervention_sectors,
    founding_year,
    role,
    isLocal,
    contact_person_name,
    contact_person_position,
    contact_person_phone,
    contact_person_email,
    org_name,
    description,
    fb_link,
    insta_link,
    linkedin_link,
    web_link,
    // logo,
  } = req.body;

  if (!(email && password && phone && district && city)) {
    return res.status(400).json({
      success: false,
      message: "email, phone, password, district, and city are required",
    });
  }
  try {
    // Check if the user already exists in the database
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      phone,
      district,
      city,
      role,
    });

    if (role === "admin" || role === "user") {
      if (!(first_name && last_name)) {
        return res.status(400).json({
          success: false,
          message: "first name and last name are required",
        });
      }
      newUser.first_name = first_name;
      newUser.last_name = last_name;
    }
    if (role === "organization") {
      if (
        !(
          org_name &&
          description &&
          intervention_sectors &&
          founding_year &&
          contact_person_name &&
          contact_person_position &&
          contact_person_phone &&
          contact_person_email
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "first name and last name are required",
        });
      }
      newUser.org_name = org_name;
      newUser.description = description;
      newUser.intervention_sectors = intervention_sectors;
      newUser.founding_year = founding_year;
      newUser.contact_person_name = contact_person_name;
      newUser.contact_person_position = contact_person_position;
      newUser.contact_person_phone = contact_person_phone;
      newUser.contact_person_email = contact_person_email;
      newUser.fb_link = fb_link || null;
      newUser.insta_link = insta_link || null;
      newUser.linkedin_link = linkedin_link || null;
      newUser.web_link = web_link || null;
      newUser.isLocal = isLocal || true;
    }
    await newUser.save();
    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Set the access token as a cookie
    res.cookie("accessToken", accessToken, { httpOnly: true });

    res.status(200).json({
      success: true,
      message: "Registration successful",
      user: newUser,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};
//login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json("All inputs are required");
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "Email not found" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    } else {
      if (await bcrypt.compare(password, user.password)) {
        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.cookie("accessToken", accessToken, { httpOnly: true });
        // Send the refresh token as a response
        res.json({
          success: true,
          message: "Logged in successfully",
          user,
          refreshToken,
        });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//logout
export const logout = async (req, res, next) => {
  try {
    // Clear the access token cookie
    res.clearCookie("accessToken");

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to logout",
      error: error.message,
    });
  }
};

//delete user
export const del = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if the user exists in the database
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    await UserModel.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const update = async (req, res, next) => {
  try {
    let filter = req.params.id;
    let update = req.body;
    const user = await UserModel.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const filterOrg = async (req, res, next) => {
  const { district, city, intervention_sectors, isLocal } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const query = { role: "organization" };

    if (district) {
      query.district = district;
    }
    if (city) {
      query.city = city;
    }
    if (intervention_sectors) {
      query.intervention_sectors = { $in: intervention_sectors };
    }
    if (isLocal !== undefined) {
      query.isLocal = isLocal;
    }

    const options = {
      page,
      limit,
      sort: { createdAt: -1 }, // Sort organizations by date created (descending order)
    };

    const organizations = await UserModel.paginate(query, options);

    res.status(200).json({ success: true, organizations });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving organizations",
      error: error.message,
    });
  }
};
