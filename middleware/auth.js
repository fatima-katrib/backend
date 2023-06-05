import jwt from "jsonwebtoken";
import User from "../models/users_model.js";

export const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  const secret_key = process.env.JWT_SECRET;

  if (!accessToken) {
    return res
      .status(401)
      .json({ success: false, message: "Access token missing. Login Please!" });
  }
  try {
    // Verify the access token
    const decoded = jwt.verify(accessToken, secret_key);
    // Token is valid, you can proceed with the protected logic
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Access token expired, check the refresh token
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Access token expired. Please log in again.",
        });
      }

      try {
        // Verify refresh token
        const refreshSecretKey = process.env.JWT_REFRESH_SECRET;
        const decodedRefresh = jwt.verify(refreshToken, refreshSecretKey);
        req.user = decodedRefresh;

        // Generate a new access token
        const newAccessToken = jwt.sign(decodedRefresh, secret_key, {
          expiresIn: "1d",
        });

        // Set the new access token as a cookie
        res.cookie("accessToken", newAccessToken, { httpOnly: true });

        // Proceed to the protected logic
        next();
      } catch (refreshError) {
        res.status(403).json({
          success: false,
          message: "Invalid refresh token. Please log in again.",
        });
      }
    } else {
      res.status(403).json({ success: false, message: "Invalid access token" });
    }
  }
};

export const allowedAccess=(arr)=>{
  return (req,res,next)=>{
      if(arr.includes(req.user.role)){
          next()
      }else{
          return res.status(403).send({success:false, message:"Access denied"})
      }
  }

}

export const checkRequesterId = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    try {
      const { userId } = req.params;
      const decoded = jwt.verify(
        req.cookies.accessToken,
        process.env.JWT_SECRET
      );

      // Check if the user making the request is the same as the user being deleted
      if (decoded.user._id !== userId) {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to verify requester ID",
        error: error.message,
      });
    }
  }
};
