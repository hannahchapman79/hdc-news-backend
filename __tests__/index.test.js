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
          expect(response.body.articles.length).toBeGreaterThan(0);
          response.body.articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(typeof article.author).toBe('string');
            expect(typeof article.title).toBe('string');
            expect(typeof article.article_id).toBe('number');
            expect(typeof article.topic).toBe('string');
            expect(typeof article.created_at).toBe('string');
            expect(typeof article.votes).toBe('number');
            expect(typeof article.article_img_url).toBe('string');
            expect(article).not.toHaveProperty("body");
          });
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

  test("responds with an array of comments for the given article_id ", () => {
    return request(app)
      .get("/api/articles/6/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBeGreaterThan(0);
        response.body.comments.forEach((comment) => {
        expect(comment.votes).toBe(1);
        expect(comment.created_at).toBe('2020-10-11T15:23:00.000Z');
        expect(comment.author).toBe('butter_bridge');
        expect(comment.body).toBe('This is a bad article name');
        expect(comment.article_id).toBe(6);
          })
      });
  });
  test("returns comments sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy('created_at', {descending: true})  
      });
  });
  test("responds with 400 error when the id is invalid", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual("invalid id type");
      });
  });
  test("responds with 404 error when id is valid but doesn't exist in the db", () => {
    return request(app)
      .get("/api/articles/29999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual("article does not exist");
      });
  });
  test("responds with an empty array if the article does not have any comments", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
});
