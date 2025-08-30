import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";

const adminSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true, unique: true }, // custom unique ID for admin
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

// 🔐 Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password); // use utils
  next();
});

// ✅ Compare password for login
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await comparePassword(enteredPassword, this.password); // use utils
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
