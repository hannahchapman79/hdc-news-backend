const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const request = require('supertest')
const app = require("../app")
const data = require('../db/data/test-data/index')
const endpoints = require("../endpoints.json");

beforeEach(() => {
   return seed(data) 
})

afterAll(() => {
    return db.end()
})

describe("/api/topics", () => {
    test("responds with all topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
            expect(response.body.topics.length).toBe(3);
            response.body.topics.forEach((topic) => {
              expect(typeof topic.description).toBe('string');
              expect(typeof topic.slug).toBe('string');
            })
        })
    })
    test("responds with all topics", () => {
        return request(app)
        .get("/api/topicsss")
        .expect(404)
    })
});

describe("GET /api", () => {
    test("responds with a json detailing all available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints);
            })
        })
    })
