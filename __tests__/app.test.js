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