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
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
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
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("responds with 404 for a non-existent endpoint", () => {
      return request(app)
        .get("/api/nonexistent")
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe("path not found");
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
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
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
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("returns comments sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
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

describe("/api/articles/:article_id/comments", () => {
  describe("POST", () => {
    test("adds comment for a given article and responds with the comment", () => {
      const newComment = {
        username: "butter_bridge",
        body: "I didn't find this article very interesting",
      };
      return request(app)
        .post("/api/articles/6/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
          const comment = response.body.comment;
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.author).toBe("butter_bridge");
          expect(comment.body).toBe(
            "I didn't find this article very interesting"
          );
        });
    });
    test("responds with 404 error when id is present but doesn't exist in the db", () => {
      const newComment = {
        username: "butter_bridge",
        body: "I didn't find this article very interesting",
      };
      return request(app)
        .post("/api/articles/6000/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toEqual("article does not exist");
        });
    });
    test("responds with 400 error when the comment is missing properties", () => {
      const newComment = {
        username: "butter_bridge",
      };
      return request(app)
        .post("/api/articles/6/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual("bad request");
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("PATCH", () => {
    test("updates a given article by incrementing or decrementing the votes", () => {
      const updateVote = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(updateVote)
        .expect(200)
        .then((response) => {
          const article = response.body.updatedArticle;
          expect(typeof article.votes).toBe("number");
          expect(typeof article.title).toBe("string");
        });
    });
    test("responds with 400 bad request when inc_votes is not provided", () => {
      const updateVote = {};
      return request(app)
        .patch("/api/articles/1")
        .send(updateVote)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual("bad request");
        });
    });
    test("responds with 404 not found when an article with the given id does not exist", () => {
        const updateVote = {
            inc_votes: 2,
          };
        return request(app)
          .patch("/api/articles/199")
          .send(updateVote)
          .expect(404)
          .then((response) => {
            expect(response.body.message).toEqual("article does not exist");
          });
      });
  });
});
