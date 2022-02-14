const app = require('../db/app')
const request = require('supertest')
const db = require('../db/connection')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const TestAgent = require('supertest/lib/agent')

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
        .get('/api/invalid_path')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('path not found')
        })
    })
})