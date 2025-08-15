import request from "supertest";
import app from "./appTest.js";

describe("analytics", () => {
  let token;
  let mediaId;

  beforeAll(async () => {
    await request(app).post("/auth/signup").send({ email: "a@a.com", password: "Secret123!" });
    const login = await request(app).post("/auth/login").send({ email: "a@a.com", password: "Secret123!" });
    token = login.body.token;
    const media = await request(app)
      .post("/media")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "t")
      .field("type", "video")
      .attach("file", Buffer.from("x"), { filename: "a.mp4" });
    mediaId = media.body.id;
  });

  it("logs a view and returns analytics", async () => {
    const v = await request(app).post(`/media/${mediaId}/view`).set("Authorization", `Bearer ${token}`);
    expect(v.status).toBe(201);
    const a = await request(app).get(`/media/${mediaId}/analytics`).set("Authorization", `Bearer ${token}`);
    expect(a.status).toBe(200);
    expect(a.body).toHaveProperty("total_views");
  });
});
