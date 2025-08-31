import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app.js";
import User from "../models/User.js";

dotenv.config(); 

jest.setTimeout(30000); 

describe("Auth API", () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Connect to test DB
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/giftasy_test";
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Clean up database after tests
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  // 1️⃣ Test user registration
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("userId");
  });

  // 2️⃣ Test login
  it("should login an existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "Password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("userId");

    token = res.body.token; 
    userId = res.body.userId;
  });

  // 3️⃣ Test getting profile (protected route)
 it("should get user profile", async () => {
  const res = await request(app)
    .get("/api/auth/profile")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("message", "Profile fetched successfully");
});


  // 4️⃣ Test updating profile
  it("should update user profile", async () => {
    const res = await request(app)
      .put("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated User" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Profile updated successfully");
  });

  // 5️⃣ Test deleting profile
  it("should delete user profile", async () => {
    const res = await request(app)
      .delete("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User profile deleted successfully");
  });
});
