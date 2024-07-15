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
    describe("GET", () => {
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
        test("responds with 404 when endpoint doesn't exist", () => {
            return request(app)
            .get("/api/doesnotexist")
            .expect(404)
            .then((response) =>{
                expect(response.body.message).toBe('path not found')
            })
        })
    });
    })


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


describe("/api/articles", () => {
    describe("GET", () => {
        // test("responds with all articles", () => {
        //     return request(app)
        //     .get("/api/articles")
        //     .expect(200)
        //     .then((response) => {
        //         response.body.articles.forEach((article) => {
        //             expect(article).toHaveProperty("author");
        //             expect(article).toHaveProperty("title");
        //             expect(article).toHaveProperty("article_id");
        //             expect(article).toHaveProperty("topic");
        //             expect(article).toHaveProperty("created_at");
        //             expect(article).toHaveProperty("votes");
        //             expect(article).toHaveProperty("article_img_url");
        //             expect(article).toHaveProperty("comment_count");
        //         })
        //     })
        //     })

        test("responds with an article of the corresponding id", () => {
            return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then((response) => {
                    expect(response.body.article).toHaveProperty("title");
                    expect(response.body.article).toHaveProperty("author");
                    expect(response.body.article).toHaveProperty("article_id");
                    expect(response.body.article).toHaveProperty("body");
                    expect(response.body.article).toHaveProperty("topic");
                    expect(response.body.article).toHaveProperty("created_at");
                    expect(response.body.article).toHaveProperty("votes");
                    expect(response.body.article).toHaveProperty("article_img_url");
                })
            })
            test("responds with 404 error when id is valid but doesn't exist in the db", () => {
                return request(app)
                .get("/api/articles/29999")
                .expect(404)
                .then((response) =>{
                    expect(response.body.message).toEqual('article does not exist')
                })
            })
            test("responds with 400 error when the id is invalid", () => {
                return request(app)
                .get("/api/articles/not-an-article")
                .expect(400)
                .then((response) =>{
                    expect(response.body.message).toEqual('invalid id type')
                })
            })
        });
        })


 