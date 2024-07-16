const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("responds with all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.topics.length).toBe(3);
          response.body.topics.forEach((topic) => {
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
          });
        });
    });
    test("responds with 404 when endpoint doesn't exist", () => {
      return request(app)
        .get("/api/doesnotexist")
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe("path not found");
        });
    });
  });
});

describe("GET /api", () => {
  test("responds with a json detailing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("responds with all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          response.body.articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).not.toHaveProperty("body");
          });
        });
    });
    test("displays the number of comments for the article", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const articles = response.body.articles;
          const article = articles.find((article) => article.article_id === 9);
          expect(article).toHaveProperty("comment_count");
          expect(article.comment_count).toBe(2);
        });
    });
    test("returns articles sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const articles = response.body.articles;
          expect(articles).toBeSortedBy('created_at', {descending: true})  
        });
    });
    test("responds with 404 for a non-existent endpoint", () => {
        return request(app)
          .get("/api/nonexistent")
          .expect(404)
          .then((response) => {
            expect(response.body.message).toBe('path not found');
          });
      });
  });
});

describe("/api/articles/:articles_id", () => {
  test("responds with an article of the corresponding id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(article.article_id).toBe(1);
        expect(article.title).toBe('Living in the shadow of a great man');
        expect(article.topic).toBe('mitch');
        expect(article.author).toBe('butter_bridge');
        expect(article.body).toBe('I find this existence challenging');
        expect(article.created_at).toBe('2020-07-09T20:11:00.000Z');
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');

      });
  });
  test("responds with 404 error when id is valid but doesn't exist in the db", () => {
    return request(app)
      .get("/api/articles/29999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual("article does not exist");
      });
  });
  test("responds with 400 error when the id is invalid", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual("invalid id type");
      });
  });
});
