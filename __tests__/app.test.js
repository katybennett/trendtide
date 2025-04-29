const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  test("status 404 - when attempting to access a non-existent endpoint", () => {
    return request(app)
    .get("/notARoute")
    .expect(404)
    .then(({body}) => {
        expect(body.msg).toBe("404 Not Found")
    });
  });
});

describe("GET /api/topics", () => { 
  test("status 200: responds with all topics", () => {
      return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({body}) => {    
              expect(body.topics).toHaveLength(3)
              body.topics.forEach((topic) => {
              expect(topic).toMatchObject({
                  slug: expect.any(String),
                  description: expect.any(String),
              });
          });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status 200: responds with requested article", () => {
      return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({body}) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
      });
  });

  test("status 404 - when passed a valid number but does not exist in the db", () => {
      return request(app)
      .get("/api/articles/9001")
      .expect(404)
      .then(({body}) => {
          expect(body.msg).toBe("No article found under article id: 9001")
      });
  });

  test("status 400 - when passed an invalid article id", () => {
      return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({body}) => {
          expect(body.msg).toBe("Bad Request!")
      });
  });
});

describe("GET /api/articles", () => { 
  test("status 200: responds with all articles", () => {
      return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({body}) => {
              expect(body.articles).toHaveLength(13)
              body.articles.forEach((article) => {
              expect(article).toMatchObject({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String), 
                  created_at: expect.any(String), 
                  votes: expect.any(Number),
                  article_img_url: expect.any(String),
                  comment_count: expect.any(Number),
              });
          });
      });
  });
  test("status 200: responds with all articles sorted by date in descending order", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(( {body}) => {
      expect(body.articles).toBeSortedBy("created_at", {descending: true})
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200: responds with all comments for requested article", () => {
      return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({body}) => {
        expect(body.comments).toHaveLength(11)
        body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
            });
        });
      });
  });
  test("status 200: responds with all comments for requested article with the most recent comments first", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(( {body}) => {
      expect(body.comments).toBeSortedBy("created_at", {descending: true})
    });
  });
  test("status 404 - when passed a valid number but does not exist in the db", () => {
    return request(app)
    .get("/api/articles/9765/comments")
    .expect(404)
    .then(({body}) => {
        expect(body.msg).toBe("No article found under article id: 9765")
    });
  });

  test("status 400 - when passed an invalid article id", () => {
    return request(app)
    .get("/api/articles/hello/comments")
    .expect(400)
    .then(({body}) => {
        expect(body.msg).toBe("Bad Request!")
    });
  });
});