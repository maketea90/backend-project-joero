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
    test("status: 200 sorts by sort_by query", () => {
        return request(app)
        .get('/api/articles?sort_by=title&order=asc&topic=mitch')
        .expect(200)
        .then(({body}) => {
            body.forEach(article => {
                expect(article).toEqual(expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: 'mitch',
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                }))
            })
            expect(body).toBeSortedBy('title',{
                descending: false,
              })
        })
    })
    test("status: 400 invalid sort query", () => {
        return request(app)
        .get('/api/articles?sort_by=invalid_value')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid sort query')
        })
    })
    test("status: 400 invalid topic query", () => {
        return request(app)
        .get('/api/articles?sort_by=title&topic=invalid_topic')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('topic not found')
        })
    })
    test("status: 400 invalid order query", () => {
        return request(app)
        .get('/api/articles?sort_by=title&order=invalid_query')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid order query')
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
describe("POST - /api/articles/:article_id/comments", () => {
    test("status: 200 responds with the posted comment", () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({username: "icellusedkars", body: 'wallawalladingdong'})
        .expect(200)
        .then(({body}) => {
            expect(body[0]).toEqual(expect.objectContaining(
                {body: expect.any(String), 
                author: "icellusedkars",
                article_id: 3, 
                votes: 0, 
                created_at: expect.any(String)}
            ))
        })
    })
    test("status: 400 malformed body sent", () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test("status: 400 sent body violates rules of data", () => {
        return request(app)
        .post('/api/articles/4/comments')
        .send({body: 45, username: 45})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})
describe("DELETE - /api/comments/:comment_id", () => {
    test("status: 204 deletes given comment and responds with no content", () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(({body}) => {
            expect(body).toEqual({})
        })
    })
    test("status: 404 id not found", () => {
        return request(app)
        .delete('/api/comments/9999999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('id not found')
        })
    })
    test("status: 400 invalid id", () => {
        return request(app)
        .delete('/api/comments/invalid_id')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})
describe("GET - /api", () =>{
    test("status: 200, responds with json describing all the endpoints", () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            console.log(body)
            expect(body).toEqual(expect.objectContaining({
                'GET /api': expect.any(Object),
                'GET /api/topics': expect.any(Object),
                'GET /api/articles': expect.any(Object),
                'GET /api/articles/:article_id': expect.any(Object),
                'PATCH /api/articles/:article_id': expect.any(Object),
                'GET /api/users': expect.any(Object),
                'GET /api/articles/:article_id/comments': expect.any(Object),
                'POST /api/articles/:article_id/comments': expect.any(Object),
                'DELETE /api/comments/:comment_id': expect.any(Object),


            })
        )
    })
})
})