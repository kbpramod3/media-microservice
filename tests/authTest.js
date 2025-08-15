import request from "supertest";
import app from "./appTest.js";

describe("auth", () => {
  it("rejects missing credentials", async () => {
    const res = await request(app).post("/auth/login").send({});
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
