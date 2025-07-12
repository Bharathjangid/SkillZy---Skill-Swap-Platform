const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

let userCookie;
let adminCookie;
let testUserId;
let testSwapId;

beforeAll(async () => {
  // Register normal user
  await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
  });

  // Login normal user
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "testuser@example.com",
    password: "password123",
  });
  userCookie = loginRes.headers["set-cookie"];

  // Register admin user (ONLY if NODE_ENV=development supports isAdmin)
  if (process.env.NODE_ENV === "development") {
    await request(app).post("/api/auth/register").send({
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
      isAdmin: true, // allowed only in dev mode
    });

    const adminRes = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "admin123",
    });
    adminCookie = adminRes.headers["set-cookie"];
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("🔐 Auth Routes", () => {
  it("should logout successfully", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", userCookie);
    expect(res.statusCode).toBe(200);
  });
});

describe("👤 User Routes", () => {
  it("should get user profile", async () => {
    const res = await request(app)
      .get("/api/user/profile")
      .set("Cookie", userCookie);
    expect(res.statusCode).toBe(200);
    testUserId = res.body._id;
  });

  it("should update profile", async () => {
    const res = await request(app)
      .put("/api/user/profile/update")
      .set("Cookie", userCookie)
      .send({ bio: "Testing update" });
    expect(res.statusCode).toBe(200);
  });
});

describe("🔍 Search Routes", () => {
  it("should return search results", async () => {
    const res = await request(app)
      .post("/api/search/search")
      .set("Cookie", userCookie)
      .send({ skill: "JavaScript" });
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should return autocomplete list", async () => {
    const res = await request(app)
      .get("/api/search/autoComplete")
      .set("Cookie", userCookie);
    expect(res.statusCode).toBe(200);
  });
});

describe("🔁 Swap Routes", () => {
  it("should return my swaps", async () => {
    const res = await request(app)
      .get("/api/swap/my")
      .set("Cookie", userCookie);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should create a swap request (mock recipientId)", async () => {
    const res = await request(app)
      .post("/api/swap/create")
      .set("Cookie", userCookie)
      .send({
        recipientId: testUserId, // swap with self, should error
        skillOffered: "JavaScript",
        skillWanted: "Photoshop",
      });
    expect([200, 400]).toContain(res.statusCode);
  });
});

describe("⭐ Feedback Routes", () => {
  it("should get my feedback", async () => {
    const res = await request(app)
      .get("/api/feedback/my")
      .set("Cookie", userCookie);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should fail to create feedback (invalid swapId)", async () => {
    const res = await request(app)
      .post("/api/feedback/create")
      .set("Cookie", userCookie)
      .send({
        swapId: "000000000000000000000000", // fake ID
        to: testUserId,
        message: "Great exchange!",
        rating: 5,
      });
    expect([400, 404]).toContain(res.statusCode);
  });
});

describe("🛡️ Admin Routes", () => {
  if (adminCookie) {
    it("should get all users", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Cookie", adminCookie);
      expect(res.statusCode).toBe(200);
    });

    it("should get all swaps", async () => {
      const res = await request(app)
        .get("/api/admin/swaps")
        .set("Cookie", adminCookie);
      expect(res.statusCode).toBe(200);
    });

    it("should get all feedback", async () => {
      const res = await request(app)
        .get("/api/admin/feedback")
        .set("Cookie", adminCookie);
      expect(res.statusCode).toBe(200);
    });
  } else {
    it("should reject unauthorized admin access", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Cookie", userCookie);
      expect(res.statusCode).toBe(403);
    });
  }
});
