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
const apiJSON = require("../../endpoints.json");

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
  test("GET 200 - Responds with an array of review objects in the correct format, with a default limit of 10", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews.length).toBe(10);
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
  test("Response array is sorted by descending date by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", { coerce: true });
      });
  });
});

describe("Pagination - /api/reviews?limit", () => {
  test("/api/reviews accepts a limit category which returns the correct number of items", () => {
    return request(app)
      .get("/api/reviews?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(5);
      });
  });
  test("/api/reviews accepts a page query", () => {
    return request(app)
      .get("/api/reviews?p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(3);
        expect(body.reviews[0].created_at).toBe("2021-01-07T09:06:08.077Z");
        expect(body.reviews[2].created_at).toBe("1970-01-10T02:08:38.400Z");
      });
  });
});

describe("/api/reviews?category", () => {
  test("Accepts a category query", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(1);
        body.reviews.forEach((review) => {
          expect(review.category).toBe("dexterity");
        });
      });
  });
  test("Returns an empy array when given a category which has no related reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's%20games")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(0);
      });
  });
  test("Returns a 404 not found error when given an invalid category query", () => {
    return request(app)
      .get("/api/reviews?category=farmland")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Returns a 404 not found error when given an invalid category query", () => {
    return request(app)
      .get("/api/reviews?category=7")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("/api/reviews?sort_by", () => {
  test("GET 200 - returns an array of sorted reviews when given a valid sort by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("designer", { descending: true });
      });
  });
  test("GET 400 - invalid sort query", () => {
    return request(app)
      .get("/api/reviews?sort_by=something_bad")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort query");
      });
  });
});

describe("/api/reviews?order", () => {
  test("GET 200 : response object is sorted by date ascending", () => {
    return request(app)
      .get("/api/reviews?order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at");
      });
  });
  test("GET 400 : invalid order query", () => {
    return request(app)
      .get("/api/reviews?order=up")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
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

describe("/api/reviews/:review_id/comments Pagination", () => {
  test("Has a default limit of 10", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBeLessThanOrEqual(10);
      });
  });
  test("Can accept a limit query", () => {
    return request(app)
      .get("/api/reviews/2/comments?limit=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
      });
  });
  test("Can accept a page query", () => {
    return request(app)
      .get("/api/reviews/2/comments?limit=2&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(1);
        expect(body.comments[0].comment_id).toBe(4);
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
            title: "A truly Quacking Game; Quacks of Quedlinburg",
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: 10,
            category: "social deduction",
            owner: "mallionaire",
            created_at: expect.any(String),
            comment_count: expect.any(Number),
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

describe("/api/users", () => {
  test("GET 200 - returns an array of user objects in the correct format", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
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

describe("Delete a comment when given a valid comment id", () => {
  test("Deletes a comment when given a comment id", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("Returns a 404 not found if provided a valid but non existent comment id", () => {
    return request(app)
      .delete("/api/comments/50")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Returns a 400 bad request if provided an invalid comment id", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api", () => {
  test("Responds with a JSON object containing information about the various endpoints in the database", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(apiJSON);
      });
  });
});

describe("GET /api/users/:username", () => {
  test("GET 200 - returns a single user when provided a valid username", () => {
    return request(app)
      .get("/api/users/philippaclaire9")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual(
          expect.objectContaining({
            username: "philippaclaire9",
            name: "philippa",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          })
        );
      });
  });
  test("GET 404 - return a not found error when given a valid username which does not exist in the data", () => {
    return request(app)
      .get("/api/users/fatfroggo")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  test("GET 404 - return a not found error when given an invalid username", () => {
    return request(app)
      .get("/api/users/12")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
});

describe("Update a given comment", () => {
  test("PATCH 202 - increases a comments votes by the given number", () => {
    return request(app)
      .patch("/api/comments/4")
      .send({
        incVotes: 2,
      })
      .expect(202)
      .then((res) => {
        expect(res.body.comment).toEqual({
          body: expect.any(String),
          votes: 18,
          author: expect.any(String),
          review_id: expect.any(Number),
          created_at: expect.any(String),
          comment_id: 4,
        });
      });
  });
  test("PATCH 202 - descreases a comment's votes by the given number", () => {
    return request(app)
      .patch("/api/comments/4")
      .send({
        incVotes: -6,
      })
      .expect(202)
      .then((res) => {
        expect(res.body.comment).toEqual({
          body: expect.any(String),
          votes: 10,
          author: expect.any(String),
          review_id: expect.any(Number),
          created_at: expect.any(String),
          comment_id: 4,
        });
      });
  });
  test("PATCH 404 - returns a not found error if given a comment_id which does not exist", () => {
    return request(app)
      .patch("/api/comments/50")
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
      .patch("/api/comments/hello")
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
      .patch("/api/comments/6")
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
      .patch("/api/comments/6")
      .send({
        incVotes: "hello",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("Adds a review", () => {
  test("POST - 201, adds a review and returns that review", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        owner: "bainesface",
        title: "Wallace and Gromit",
        review_body: "Loved this game!",
        designer: "Fat Froggo",
        category: "children's games",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.review).toEqual({
          owner: "bainesface",
          title: "Wallace and Gromit",
          review_body: "Loved this game!",
          designer: "Fat Froggo",
          category: "children's games",
          review_id: 14,
          votes: 0,
          created_at: expect.any(String),
          review_img_url: expect.any(String),
        });
      });
  });
  test("POST - 400, returns a 400 error if the given review does not meet the input requirements", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        owner: "bainesface",
        title: "Wallace and Gromit",
        review_body: "Loved this game!",
        category: "children's games",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("Add a category", () => {
  test("POST - 201, adds a category and returns the category object", () => {
    return request(app)
      .post("/api/categories")
      .send({
        slug: "sandbox explorers",
        description: "explore to your hearts content!",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.category).toEqual({
          slug: "sandbox explorers",
          description: "explore to your hearts content!",
        });
      });
  });
  test("POST - 400, returns a 400 error if the given category does not meet the input requirements", () => {
    return request(app)
      .post("/api/categories")
      .send({
        slug: "sandbox explorers",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("Delete a review when given a valid review id", () => {
  test("Deletes a review when given a review id", () => {
    return request(app).delete("/api/reviews/2").expect(204);
  });
  test("Returns a 404 not found if provided a valid but non existent review id", () => {
    return request(app)
      .delete("/api/reviews/50")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Returns a 400 bad request if provided an invalid review id", () => {
    return request(app)
      .delete("/api/reviews/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("Delete a user", () => {
  test("DELETE - 204: allows users to delete a user from the database with their username, in turn deleting their reviews and comments", () => {
    return request(app).delete("/api/users/mallionaire").expect(204);
  });
  test("Returns a 404 not found if provided a valid but non existent username", () => {
    return request(app)
      .delete("/api/users/fatfroggo")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Returns a 404 not found if provided a valid but non-existent username", () => {
    return request(app)
      .delete("/api/users/50")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("Update a username of a valid user", () => {
  test("Allows a user to update the username of an existing user", () => {
    return request(app)
      .patch("/api/users/mallionaire")
      .send({
        username: "fatfroggo",
      })
      .expect(202)
      .then(({ body }) => {
        expect(body.user).toEqual({
          username: "fatfroggo",
          name: "haz",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("PATCH 404 - returns a not found error if given a username which does not exist", () => {
    return request(app)
      .patch("/api/users/fatfroggo")
      .send({
        username: "hello123",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  test("Patch 400 - returns a bad request error when given an invalid key", () => {
    return request(app)
      .patch("/api/comments/mallionaire")
      .send({
        user: "fatfroggo",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});
