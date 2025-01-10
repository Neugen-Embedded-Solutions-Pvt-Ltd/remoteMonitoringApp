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
    it("Login failed", (done) => {
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
    it("Login failed", (done) => {
      request(server)
        .post("/auth/login")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(401)
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
          username: "qmanoqja",
          email: "mqaqnoja@gmail.com",
          password: "12",
          first_name: "manoj",
          last_name: "a",
          device_id: 1,
          admin_user: 0,
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
  describe("Device is not registered", () => {
    it("device not registered", (done) => {
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

// for got password and sending link by getting username

describe("Forgot Password API", () => {
  describe("Forgot Password API", () => {
    it("By getting username Sent forgot password link", function (done) {
      this.timeout(10000);
      request(server)
        .post("/auth/forgot-password")
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
  describe("User not found by sending username", () => {
    it("User not found. create a new account", (done) => {
      request(server)
        .post("/auth/forgot-password")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(404)
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
  describe("User not found, by sending email", () => {
    it("User not found. create a new account", (done) => {
      request(server)
        .post("/auth/forgot-password")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(404)
        .send({
          email: "manofdewdfwaj@gmail.com",
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
        .post("/auth/forgot-password")
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
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1hbm9qIiwiaWF0IjoxNzM2NTExNjk1LCJleHAiOjE3Mzc3MTE2OTV9.UYh_j9bQLiF0Xy1tUVPZXLgbRT9QrVuSH8LR_9f-a20",
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
        .expect(404)
        .send({
          password: "12",
          token:
            "eyJhbGciOiJIUzI1NiIssInR5cCI6IkpXVCJ9.eyJpZCI6Im1hbm9qIiwiaWF0IjoxNzM2NTExNjk1LCJleHAiOjE3Mzc3MTE2OTV9.UYh_j9bQLiF0Xy1tUVPZXLgbRT9QrVuSH8LR_9f-a20",
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
