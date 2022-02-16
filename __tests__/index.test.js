const app = require('../db/app')
const request = require('supertest')
const db = require('../db/connection')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
require('jest-sorted')

afterAll(() => db.end())

beforeEach(() => seed(data))

describe('GET - /api/topics', () => {
    test("status: 200 returns an array of topic objects each with slug and description properties", () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(3)
            body.forEach((topic) => {
                expect(topic).toEqual(expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String)
            }))
            })
        })
    })
    test("status: 404 path not found", () => {
        return request(app)
        .get('/not_a_path')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('path not found')
        })
    })
})
describe("GET /api/articles/:article_id", () => {
    test("status: 200 responds with the relevant article object, with count of comments associated with that article", () => {
        return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at:  "2020-11-03T09:12:00.000Z",
                votes: 0,
                comment_count: '2',
              })
        })
    })
    test("status: 200 responds with the relevant article object, with count of comments associated with that article, when number of comments is zero", () => {
        return request(app)
        .get('/api/articles/4')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({
                article_id: 4,
                title: "Student SUES Mitch!",
                topic: "mitch",
                author: "rogersop",
                body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                created_at: "2020-05-06T01:14:00.000Z",
                votes: 0,
                comment_count: '0'
              })
        })
    })
    test("status: 404 article not found", () => {
        return request(app)
        .get('/api/articles/999999999')
        .expect(404)
        .then(({body})=> {
            expect(body.msg).toBe('article not found')
        })
    })
    test("status: 400 invalid id", () => {
        return request(app)
        .get('/api/articles/invalid_id')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})
describe("PATCH - /api/articles/:article_id", () => {
    test("status: 200 responds with updated article", () => {
        return request(app)
        .patch('/api/articles/3')
        .send({inc_votes: 1})
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at: "2020-11-03T09:12:00.000Z",
                votes: 1,
            })
        })
    })
    test("status: 400, malformed body/missing required fields - bad request", () => {
        return request(app)
        .patch('/api/articles/3')
        .send({})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test("status: 400 incorrect type - bad request", () => {
        return request(app)
        .patch('/api/articles/3')
        .send({inc_votes: 'word'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test("status: 400 incorrect request", () => {
        return request(app)
        .patch('/api/articles/3')
        .send({inc_votes: 'word',
    extra_property: 'unnecessary'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})
describe("GET - /api/users", () => {
    test("status: 200 responds with an array of user objects", () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            body.forEach(user => {
                expect(user).toEqual(expect.objectContaining({
                    username: expect.any(String)    
                }))
            })
        })
    })
    test("status: 404 path not found", () => {
        return request(app)
        .get('/invalid_path')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('path not found')
        })
    })
})
describe("GET - /api/articles", () => {
    test("status: 200 responds with array of article objects sorted by date in descending order, and comment count", () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            body.forEach(article => {
                expect(article).toEqual(expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                }))
            })
            expect(body).toBeSortedBy('created_at',{
                descending: true,
              })
        })
    })
})
describe("GET - /api/articles/:article_id/comments", () => {
    test("status: 200 responds with an array of comment objects for the given article_id", () => {
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(2)
            body.forEach(comment => {
                expect(comment).toEqual(expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                }))
            })
        })
    })
    test("status: 200 responds with empty array when given article_id has no comments associated with it", () => {
        return request(app)
        .get('/api/articles/4/comments')
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(0)
            expect(body).toEqual([])
        })
    })
    test("status: 404 article not found", () => {
        return request(app)
        .get('/api/articles/99999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('article not found')
        })
    })
    test("status: 400 invalid article_id", () => {
        return request(app)
        .get('/api/articles/invalid_id/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})