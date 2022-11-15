const request = require("supertest");
const seed = require("../../db/seeds/seed.js");
const db = require("../../db/connection.js");
const app = require("../app.js");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../../db/data/test-data/index.js");

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData });
});

afterAll(() => {
  return db.end();
});

describe("/api/categories", () => {
  test("GET 200 - Responds with an array of category objects containing a slug and a description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("/api/reviews", () => {
  test("GET 200 - Responds with an array of review objects in the correct format", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews.length).toBe(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Response array is sorted by descending date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", { coerce: true });
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("GET 200 - returns an array of comments when given a review id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("GET 200 - returns an empty array when given a valid review ID when there are no comments", () => {
    return request(app)
      .get("/api/reviews/6/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(0);
      });
  });
  test("GET 400 - returns an error if given an invalid data type for review_id", () => {
    return request(app)
      .get("/api/reviews/hello/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  test("GET 404 - returns an error if given a valid but non existent input for review_id", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
});

describe("/api/reviews/review:id", () => {
    test("GET 200 - returns a review object corresponding to the given review id", () => {
      return request(app)
        .get("/api/reviews/9")
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toEqual(
            expect.objectContaining({
              review_id: 9,
              title: 'A truly Quacking Game; Quacks of Quedlinburg',
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: 10,
              category: 'social deduction',
              owner: 'mallionaire',
              created_at: expect.any(String),
              comment_count: expect.any(Number)
            })
          );
        });
    });
    test("GET 404 - returns a 404 not found error when given a nonexistent review_id", () => {
      return request(app)
        .get("/api/reviews/90")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Not found")
        })
    })
    test("GET 400 - returns a bad request error when given an invalid id", () => {
        return request(app)
        .get("/api/reviews/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad request")
        })
    })
  test("GET 200 - returns a review object corresponding to the given review id", () => {
    return request(app)
      .get("/api/reviews/9")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 9,
            title: "A truly Quacking Game; Quacks of Quedlinburg",
            review_body:
              "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
            designer: "Wolfgang Warsch",
            review_img_url:
              "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
            votes: 10,
            category: "social deduction",
            owner: "mallionaire",
            created_at: expect.any(String),
          })
        );
      });
  });
  test("GET 404 - returns a 404 not found error when given a nonexistent review_id", () => {
    return request(app)
      .get("/api/reviews/90")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  test("GET 400 - returns a bad request error when given an invalid id", () => {
    return request(app)
      .get("/api/reviews/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("Update a given review", () => {
  test("PATCH 202 - increases a review's votes by the given number", () => {
    return request(app)
      .patch("/api/reviews/6")
      .send({
        incVotes: 2,
      })
      .expect(202)
      .then((res) => {
        expect(res.body.review).toEqual({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: 6,
          category: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: 10,
          designer: expect.any(String),
          review_body: expect.any(String),
        });
      });
  });
  test("PATCH 202 - descreases a review's votes by the given number", () => {
    return request(app)
      .patch("/api/reviews/6")
      .send({
        incVotes: -6,
      })
      .expect(202)
      .then((res) => {
        expect(res.body.review).toEqual({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: 6,
          category: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: 2,
          designer: expect.any(String),
          review_body: expect.any(String),
        });
      });
  });
  test("PATCH 404 - returns a not found error if given a review_id which does not exist", () => {
    return request(app)
      .patch("/api/reviews/50")
      .send({
        incVotes: -6,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  test("Patch 400 - returns a bad request error when given an invalid id", () => {
    return request(app)
      .patch("/api/reviews/hello")
      .send({
        incVotes: -6,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  test("Patch 400 - returns a bad request error when given an invalid key", () => {
    return request(app)
      .patch("/api/reviews/6")
      .send({
        incVes: -6,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  test("Patch 400 - returns a bad request error when given an incVotes which is not a number", () => {
    return request(app)
      .patch("/api/reviews/6")
      .send({
        incVotes: "hello",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("Adds a comment to a given review", () => {
  test("POST - 201, adds a comment to a given review and returns that comment", () => {
    return request(app)
      .post("/api/reviews/5/comments")
      .send({
        username: "dav3rid",
        body: "This is a great game!",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toEqual({
          author: "dav3rid",
          body: "This is a great game!",
          review_id: 5,
          comment_id: 7,
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("POST - 404, returns a 404 error when given a valid but non-existent review_id", () => {
    return request(app)
      .post("/api/reviews/90/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  test("POST - 400, returns a 400 error if the given comment does not meet the input requirements", () => {
    return request(app)
      .post("/api/reviews/5/comments")
      .send({
        user: "dav3rid",
        body: "This is a great game!",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});
