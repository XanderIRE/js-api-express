const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seed.js');
const testData = require('../db/data/test-data/index.js');
const app = require('../app.js');

beforeEach(() => seed(testData));
afterAll(() => {
    db.end();
})

describe('GET /api/treasures', () => {
    it('returns an array of objects', () => {
        return request(app)
        .get('/api/treasures')
        .expect(200)
        .then(({ body }) => {
            expect(typeof body[0] === 'object').toBe(true);
        })
    })
    it('objects contain shop_name instead of shop_id property', () => {
        return request(app)
        .get('/api/treasures')
        .expect(200)
        .then(({ body }) => {
            expect((body[0]).hasOwnProperty('shop_name')).toBe(true);
            expect((body[0]).hasOwnProperty('shop_id')).toBe(false);
        })
    })
    it('returns objects sorted by ascending age', () => {
        return request(app)
        .get('/api/treasures')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('age');
        })
    })
    it('returns objects sorted by ascending cost_at_auction', () => {
        return request(app)
        .get('/api/treasures?sortOn=cost_at_auction')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('cost_at_auction');
        })
    })
    it('returns objects sorted by alphabetical treasure_name', () => {
        return request(app)
        .get('/api/treasures?sortOn=treasure_name')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('treasure_name');
        })
    })
    it('returns objects sorted by descending age', () => {
        return request(app)
        .get('/api/treasures?order=DESC')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('age', {descending: true});
        })
    })
    it('returns objects sorted by descending cost_of_auction', () => {
        return request(app)
        .get('/api/treasures?sortOn=cost_at_auction&order=DESC')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('cost_at_auction', {descending: true});
        })
    })
    it('returns objects sorted by reverse alphabetical treasure_name', () => {
        return request(app)
        .get('/api/treasures?sortOn=treasure_name&order=DESC')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('treasure_name', {descending: true});
        })
    })
    it('returns only queries with given colour input', () => {
        return request(app)
        .get('/api/treasures?colour=gold')
        .expect(200)
        .then(({ body }) => {
            body.forEach(result => {
                expect(result.colour === 'gold').toBe(true);
            })
        })
    })
    it('returns a 400 bad request error if input is invalid', () => {
        return request(app)
        .get('/api/treasures?sortOn=year_opened')
        .expect(400)
        .then(({ body }) => {
            expect(body).toEqual({ msg : 'Bad Request' });
        })
    })
})
