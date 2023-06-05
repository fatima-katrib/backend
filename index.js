import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import ProgramRouter from "./routes/programs_route.js"
import UserRouter from "./routes/users_route.js"
import ContactUsRouter from "./routes/contact_us_route.js"

dotenv.config();
const PORT = process.env.PORT || 4000;
const app = new express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

await connectDB();

// const corsOptions = {
//   optionsSuccessStatus: 200,
//   origin: "http://localhost:3000",
//   credentials: true,
// };
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errorMessages = Object.values(err.errors).map(
      (error) => error.message
    );
    return res.status(400).json({ error: errorMessages });
  }

  // Handle other types of errors
  return res.status(500).json({ error: "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send("api is running");
});

app.use("api/user", UserRouter);
app.use("api/programs", ProgramRouter);
app.use("api/contactus", ContactUsRouter);
// app.use("/uploads", express.static("./uploads"));

app.listen(
  PORT,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
