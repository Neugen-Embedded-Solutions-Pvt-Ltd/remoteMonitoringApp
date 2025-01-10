import request from "supertest";
import server from "../server.js";
import { expect } from "chai";

describe("Test apis", () => {
  before(() => {
    console.log("server is running");
  });
});
describe("temperature API", () => {
  // describe("get temperature which is got from Public weather API ", () => {
  //   it("All temperature data", (done) => {
  //     request(server)
  //       .get("/iot/temp")
  //       .set("Content-Type", "application/json")
  //       .set("Accept", "application/json")
  //       .expect(200)
  //       .expect("Content-Type", /json/)
  //       .expect((response) => {
  //         expect(response.body).not.to.be.empty;
  //         expect(response.body).to.be.an("object");
  //       })
  //       .end(done);
  //   });
  // });
});
