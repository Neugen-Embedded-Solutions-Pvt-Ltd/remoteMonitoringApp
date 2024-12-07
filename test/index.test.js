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
          username: "s",
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
        .expect(401)
        .send({
          username: "a",
          password: "123",
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
          username: "wq",
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
  describe("User already exists", () => {
    it("should not register user already exists", (done) => {
      request(server)
        .post("/auth/register")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(409)
        .send({
          username: "a",
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
          username: "s",
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