const request = require('supertest');
const {
    app,
    server
} = require('../server');
const chai = require('chai');
// const express = require('express');
// const app = express(); 
const {
    expect
} = chai;

describe('test api', () => {
    before(() => {
        console.log('server is running');
    })
})

// before((done) => {
//     // Start the server if not already running
//     app.listen(3002, () => {
//         if (err) return done(err);
//         console.log('Server started on port 3000');
//         done();
//     });
// });

describe('test api', () => {
    describe('login API', () => {
        it('should login successfully', (done) => {
            request(server)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
                .send({
                    "username": 'mansosjd',
                    "password": '12'
                })
                
                .expect('Content-Type',/json/)
                .expect((response) => {
                    expect(response.body).not.to.be.empty;
                    expect(response.body).to.be.an('object');
                })
                .end(done);

        })
    })
    describe('login API', () => {
        it('should register successfully', (done) => {
            request(server)
                .post('/auth/register')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
                .send({
                    "username":"manosjd",
                    "firstName": "we",
                    "lastName":"s",
                    "device_id" : "1",
                    "email":"manoj+1@gmail.com",
                    "password":"12"
                 
                })
                
                .expect('Content-Type',/json/)
                .expect((response) => {
                    expect(response.body).not.to.be.empty;
                    expect(response.body).to.be.an('object');
                })
                .end(done);

        })
        after(function (done) {
            server.close(done); // Close the server after tests
        });
    })
})