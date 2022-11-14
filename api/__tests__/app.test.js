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
            const { reviews } = body
            expect(reviews) .toBeInstanceOf(Array)
            expect(reviews.length).toBe(13)
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
                        comment_count: expect.any(Number)
                    })
                )
            })
        })
    })
    test("Response array is sorted by descending date", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
            expect(body.reviews).toBeSortedBy("created_at", { coerce: true })
        })
    })
})