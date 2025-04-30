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

describe("GET /api/users", () => {
  test("status 200: responds with all users", () => {
    return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {  
            expect(body.users).toHaveLength(4)
            body.users.forEach((users) => {
            expect(users).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
        });
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

  test("status 404: when passed a valid number but does not exist in the db", () => {
      return request(app)
      .get("/api/articles/9001")
      .expect(404)
      .then(({body}) => {
          expect(body.msg).toBe("No article found under article id: 9001")
      });
  });

  test("status 400: when passed an invalid article id", () => {
      return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({body}) => {
          expect(body.msg).toBe("Bad Request!")
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
  test("status 404: when passed a valid number but does not exist in the db", () => {
    return request(app)
    .get("/api/articles/9765/comments")
    .expect(404)
    .then(({body}) => {
        expect(body.msg).toBe("No article found under article id: 9765")
    });
  });

  test("status 400: when passed an invalid article id", () => {
    return request(app)
    .get("/api/articles/hello/comments")
    .expect(400)
    .then(({body}) => {
        expect(body.msg).toBe("Bad Request!")
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status 201: responds when newly posted comment", () => {
    const postObj = {
        username: 'icellusedkars',
        body: 'Excelent Article!',
    };
    return request(app)
        .post("/api/articles/1/comments")
        .send(postObj)
        .expect(201)
        .then(({ body }) => {
            expect(body.comment).toEqual({
                comment_id: 19,
                article_id: 1,
                body: 'Excelent Article!',
                votes: expect.any(Number),
                author: 'icellusedkars',
                created_at: expect.any(String),
        });
    });
  });

  test("status 400: responds when username doesn't exist", () => {
    const postObj = {
      username: 'NonExistentUsername',
      body: 'Excelent Article!',
    };
    return request(app)
        .post("/api/articles/1/comments")
        .send(postObj)
        .expect(400)
        .then(({ body }) => {
            expect(body.comment).toBe(undefined);
            expect(body.msg).toBe("Bad Request!")
    });
  });


  test("status 400: Bad Request responds when invalid data is passed into post object", () => {
    const postObj = {
      username: 123,
      body: 456,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.comment).toBe(undefined);
        expect(body.msg).toBe("Bad Request!")
    });
  });

  describe("status 400: responds with correct errors messages", () => {
    test("if username is missed, responds username is required", () => {
      const postObj = {
        body: 'Excelent Article!',
      }; 
      return request(app)
        .post("/api/articles/1/comments")
        .send(postObj)
        .expect(400)
        .then(({ body }) => {
            expect(body.comment).toBe(undefined);
            expect(body.errors).toEqual([
              'username is required',
        ]);
      });
    });
  
    test("if body is missed, responds body is required", () => {
      const postObj = {
        username: 'icellusedkars',
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(postObj)
        .expect(400)
        .then(({ body }) => {
            expect(body.comment).toBe(undefined);
            expect(body.errors).toEqual([
              'body is required',
        ]);
      });
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status 200: response with updated article by increasing the article's votes by correct amount", () => {
    const patchObj = {
      inc_votes: 1
    };
    return request(app)
      .patch("/api/articles/1")
      .send(patchObj)
      .expect(200)
      .then(({body}) => {
        expect(body.updatedArticle).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      });
    });
  });
  test("status 200: response with updated article by descreasing the article's votes by correct amount", () => {
    const patchObj = {
      inc_votes: -30
    };
    return request(app)
      .patch("/api/articles/1")
      .send(patchObj)
      .expect(200)
      .then(({body}) => {
        expect(body.updatedArticle).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 70,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      });
    });
  }); 
  test("status 404: when passed a valid number but article does not exist in the db", () => {
    const patchObj = {
      inc_votes: 1
    }
    return request(app)
      .patch("/api/articles/9001")
      .send(patchObj)
      .expect(404)
      .then(({body}) => {
          expect(body.msg).toBe("No article found under article id: 9001")
    });
  });

  test("status 400: when passed an invalid data type as article id", () => {
    const patchObj = {
      inc_votes: 1
    }
    return request(app)
      .patch("/api/articles/hello")
      .send(patchObj)
      .expect(400)
      .then(({body}) => {
          expect(body.msg).toBe("Bad Request!")
    });
  });
  describe("status 400: responds with correct error message when attempting to PATCH", () => {
    test("with valid body field but incorrent field that is not an integer", () => {
      const patchObj = {
        inc_votes: "8.4"
      };
      return request(app)
        .patch("/api/articles/1")
        .send(patchObj)
        .expect(400)
        .then(({body}) => {
          expect(body.updatedArticle).toBe(undefined);
          expect(body.errors).toEqual(["inc_vote must be an integer not equal to 0"])
      });
    });
    test("with valid body field but incorrent field of value cero", () => {
      const patchObj = {
        inc_votes: "0"
      };
      return request(app)
        .patch("/api/articles/1")
        .send(patchObj)
        .expect(400)
        .then(({body}) => {
          expect(body.updatedArticle).toBe(undefined);
          expect(body.errors).toEqual(["inc_vote must be an integer not equal to 0"])
      });
    });
    test("with a body that does not contain any field", () => {
      const patchObj = {};
      return request(app)
        .patch("/api/articles/1")
        .send(patchObj)
        .expect(400)
        .then(({body}) => {
          expect(body.updatedArticle).toBe(undefined);
          expect(body.errors).toEqual(["inc_vote must be an integer not equal to 0"])
      });
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status 204: does not send a response body", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({})
      });
  });
  test("status 204: responds with deleting the given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .get("/api/comments/1")
          .expect(404)
      });
  });
  test("status 404: when passed a valid number but comment does not exist in the db", () => {
    return request(app)
    .delete("/api/comments/87654")
    .expect(404)
    .then(({body}) => {
        expect(body.msg).toBe("No comment found under comment id: 87654")
    });
  });
  test("status 400: when passed an invalid comment id", () => {
    return request(app)
    .delete("/api/comments/hello")
    .expect(400)
    .then(({body}) => {
        expect(body.msg).toBe("Bad Request!")
    });
  });
});