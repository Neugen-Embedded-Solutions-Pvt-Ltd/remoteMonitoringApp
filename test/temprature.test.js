import request from "supertest";
import server from "../server.js";
import { expect } from "chai";

describe("Test apis", () => {
  before(() => {
    console.log("server is running");
  });
});
describe("temperature API", () => {
  describe("get temperature which is got from Public weather API ", () => {
    it("All temperature data", (done) => {
      request(server)
        .get("/iot/temperature")
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
  describe("generate report ", () => {
   it("generate the report successfully", (done) => {
     request(server)
       .post("/iot/report")
       .set("Content-Type", "application/json")
       .set(
         "Accept",
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
       ) // Accept header for Excel files
       .send({
         from_date: "2025-01-22",
         to_date: "2025-01-25",
       })
       .expect(200) // Expect HTTP status code 200
       .expect(
         "Content-Type",
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
       ) // Validate the response content type
       .expect((response) => {
         // Ensure the response body is not empty and is a buffer (since it's a binary file)
         expect(response.body).not.to.be.empty;
         expect(Buffer.isBuffer(response.body)).to.be.true; // Check if the response is a binary buffer
       })
       .end(done);
   });
    it("generate the report failure because no temperature found", (done) => {
      request(server)
        .post("/iot/report")
        .set("Content-Type", "application/vnd")
        .set("Accept", "application/vnd")
        .expect(403)
        .send({
          from_date: "2025-01-22",
          to_date: "2025-01-25",
        })
        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
    it("generate the report failure because from date bigger that to date", (done) => {
      request(server)
        .post("/iot/report")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(403)
        .send({
          from_date: "2025-01-25",
          to_date: "2025-01-20",
        })
        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an("object");
        })
        .end(done);
    });
    it("generate the report failure because Invalid date input", (done) => {
      request(server)
        .post("/iot/report")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(403)
        .send({
          from_date: "2025-03-10",
          to_date: "2025-03-15",
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
