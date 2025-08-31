import request from "supertest";
import app from "../app";
jest.setTimeout(30000); 

describe("Order API (sample)", () => {
    it("server should be running", async () => {
      async () => {
    const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
      }
    });
});