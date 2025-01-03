import request from "supertest";
import server from "../server.js";
import { expect } from "chai";

describe("Test apis", () => {
  before(() => {
    console.log("server is running");
  });
});

describe("Login API", () => {
  describe("Login API", () => {
    it("should login successfully", (done) => {
      request(server)
        .post("/auth/login")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(200)
        .send({
          username: "manoj",
          password: "12",
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });
  describe("User not found", () => {
    it("Login falied", (done) => {
      request(server)
        .post("/auth/login")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(404)
        .send({
          username: "qw",
          password: "12",
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });
  describe("wrong password and rejected", () => {
    it("Login falied", (done) => {
      request(server)
        .post("/auth/login")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(403)
        .send({
          username: "manoj",
          password: "12w",
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });
});
//   Register
describe("Register api", () => {
  describe("Register API", () => {
    it("should register successfully", (done) => {
      request(server)
        .post("/auth/register")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201)
        .send({
          username: "manoj2",
          firstName: "we",
          lastName: "s",
          device_id: "1",
          email: "manoj+1@gmail.com",
          password: "12",
          admin_user: "2"
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });
  describe("User already exists", () => {
    it("should not register user already exists", (done) => {
      request(server)
        .post("/auth/register")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(409)
        .send({
          username: "manoj",
          firstName: "we",
          lastName: "s",
          device_id: "1",
          email: "manoj+1@gmail.com",
          password: "12",
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });
  describe("Device is not registred", () => {
    it("device not registred", (done) => {
      request(server)
        .post("/auth/register")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(409)
        .send({
          username: "manoj",
          firstName: "we",
          lastName: "s",
          device_id: "10",
          email: "manoj+1@gmail.com",
          password: "12",
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
    after(function (done) {
      server.close(done); // Close the server after tests
    });
  });
});

describe("All users data api", () => {
  describe("Getting all users data", () => {
    it("Get all users data", (done) => {
      request(server)
        .get("/auth/alldata")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(200)

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });
});

// for got password and sending link by getting username

describe("Forgot Password API", () => {
  describe("Forgot Password API", () => {
    it("By getting username Sent forgot password link", function (done) {
      this.timeout(10000);
      request(server)
        .post("/auth/forgotpassword")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(200)
        .send({
          username: "manoj",
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });
  describe("User not found", () => {
    it("User not found. create a new account", (done) => {
      request(server)
        .post("/auth/forgotpassword")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(409)
        .send({
          username: "wqs",
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });

  // forgot password updating using email

  describe("Forgot Password API", () => {
    it("Sent forgot password link", function (done) {
      this.timeout(10000);
      request(server)
        .post("/auth/forgotpassword")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(200)
        .send({
          email: "manoj@gmail.com",
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });
  describe("User not found", () => {
    it("User not found. create a new account", (done) => {
      request(server)
        .post("/auth/forgotpassword")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(409)
        .send({
          email: "manoj.a.313929@gmail.com",
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });
});
describe("Reset Password API", () => {
  describe("Update Password API", () => {
    it("should update password successfully", (done) => {
      request(server)
        .put("/auth/resetpassword")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(200)
        .send({
          password: "12",
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1hbm9qIiwiaWF0IjoxNzM1Mzc5MzY0LCJleHAiOjE3MzU0NjU3NjR9.hpTiLYI_Ro9MS1uLDdysB9OqK0_D_zCOZooB5iRrAxA",
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });
  describe("Update Password API", () => {
    it("should throw error for invalid token or expired token", (done) => {
      request(server)
        .put("/auth/resetpassword")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(403)
        .send({
          password: "12",
          token:
            "a8eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEiLCJpYXQiOjE3MzM3NDQ5MjUsImV4cCI6MTczMzgzMTMyNX0.XQDpMZl9XtLiILZxR-9ROLggw7sm4ncyhvbFlP0GvIs",
        })

        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
  });
});
