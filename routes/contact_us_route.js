import express from "express";
import ContactUsMailerController from "../controllers/contactUsMailer_controller.js";

const router = express.Router();

router.post("/send", ContactUsMailerController.send);
export default router;
