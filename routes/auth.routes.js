import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";

const authRoutes = express.Router();

// 🚀 Public routes
authRoutes.post("/register", register);
authRoutes.post("/login", login);

// 🔒 Protected routes (user must be logged in)
authRoutes.get("/profile", protect, getProfile);
authRoutes.put("/profile", protect, updateProfile);
authRoutes.delete("/profile", protect, deleteProfile);

export default authRoutes;
