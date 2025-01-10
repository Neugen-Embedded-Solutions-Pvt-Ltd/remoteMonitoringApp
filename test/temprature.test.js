import request from "supertest";
import server from "../server.js";
import { expect } from "chai";

describe("Test apis", () => {
  before(() => {
    console.log("server is running");
  });
});
describe("Temparture API", () => {
  // describe("get teamprature which is got from Public weather API ", () => {
  //   it("All temprature data", (done) => {
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
  //   describe("Report genration API", () => {
  //     it("Temprature data report geneartion from device", (done) => {
  //       request(server)
  //         .get("/iot/tempall")
  //         .set("Content-Type", "application/json")
  //         .expect(200)
  //         .send({
  //           fromdate: '2024-12-01',
  //           todate: "2024-12-07",
  //         })
  //         .expect("Content-Type", /vnd.openxmlformats-officedocument.spreadsheetml.sheet/)
  //         // .expect((response) => {
  //         //   expect(response.body).not.to.be.empty;
  //         //   expect(response.body).to.be.an("object");
  //         // })
  //         .end(done);
  //     });
  //   });
});
