const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seed.js');
const testData = require('../db/data/test-data/index.js');
const app = require('../app.js');
const { addTreasure, updateTreasure, removeTreasure } = require('../models/model.js');

beforeEach(() => seed(testData));
afterAll(() => {
    db.end();
});

describe('GET /api/treasures', () => {
    it('returns an array of objects', () => {
        return request(app)
        .get('/api/treasures')
        .expect(200)
        .then(({ body }) => {
            expect(typeof body[0] === 'object').toBe(true);
        });
    });
    it('objects contain shop_name instead of shop_id property', () => {
        return request(app)
        .get('/api/treasures')
        .expect(200)
        .then(({ body }) => {
            expect((body[0]).hasOwnProperty('shop_name')).toBe(true);
            expect((body[0]).hasOwnProperty('shop_id')).toBe(false);
        });
    });
    it('returns objects sorted by ascending age', () => {
        return request(app)
        .get('/api/treasures')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('age');
        });
    });
    it('returns objects sorted by ascending cost_at_auction', () => {
        return request(app)
        .get('/api/treasures?sortOn=cost_at_auction')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('cost_at_auction');
        });
    });
    it('returns objects sorted by alphabetical treasure_name', () => {
        return request(app)
        .get('/api/treasures?sortOn=treasure_name')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('treasure_name');
        });
    });
    it('returns objects sorted by descending age', () => {
        return request(app)
        .get('/api/treasures?order=DESC')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('age', {descending: true});
        });
    });
    it('returns objects sorted by descending cost_of_auction', () => {
        return request(app)
        .get('/api/treasures?sortOn=cost_at_auction&order=DESC')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('cost_at_auction', {descending: true});
        });
    });
    it('returns objects sorted by reverse alphabetical treasure_name', () => {
        return request(app)
        .get('/api/treasures?sortOn=treasure_name&order=DESC')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('treasure_name', {descending: true});
        });
    });
    it('returns only queries with given colour input', () => {
        return request(app)
        .get('/api/treasures?colour=gold')
        .expect(200)
        .then(({ body }) => {
            body.forEach(result => {
                expect(result.colour === 'gold').toBe(true);
            });
        });
    });
    it('returns a 400 bad request error if input is invalid', () => {
        return request(app)
        .get('/api/treasures?sortOn=year_opened')
        .expect(400)
        .then(({ body }) => {
            expect(body).toEqual({ msg : 'Bad Request' });
        });
    });
});

describe('POST /api/treasures', () => {
    test('returns the posted object', () => {
        return request(app)
        .post('/api/treasures')
        .expect(201)
        .send({
            'treasure_name': 'New Treasure',
            'colour' : 'gold',
            'age' : '1',
            'cost_at_auction' : '1.00',
            'shop_id' : '1'
        })
        .then(({ body }) => {
            
            const expected = {
                'treasure_id' : 27,
                'treasure_name': 'New Treasure',
                'colour' : 'gold',
                'age' : 1,
                'cost_at_auction' : 1.00,
                'shop_id' : 1
            };

            expect(body).toEqual(expected);
        });
    });
    test('Can find the new treasure in the table', () => {
        return addTreasure({
            'treasure_name': 'New Treasure',
            'colour' : 'gold',
            'age' : '1',
            'cost_at_auction' : '1.00',
            'shop_id' : '1'
        })
        .then(() => {
            return db.query(
            `SELECT * FROM treasures
            WHERE treasure_id = 27;`
            )
            .then(({ rows: [body] }) => {
                expect(body.treasure_name).toBe('New Treasure');
            });
        });
    });
});

describe('PATCH /api/treasures/:treasure_id', () => {
    test('should return the updated treasure', () => {
        return request(app)
        .patch('/api/treasures/1')
        .expect(201)
        .send({
            'cost_at_auction' : '50.00'
        })
        .then(({ body }) => {
            expect(body.cost_at_auction).toBe(50.00);
        });
    });
    test('should be able to search it in the table', () => {
        return updateTreasure(
            {
                'treasure_id' : '1'
            },
            {
                'cost_at_auction' : '50.00'
            }
        )
        .then(() => {
            return db.query(
                `SELECT * FROM treasures
                WHERE treasure_id = 1;`
            )
            .then(({ rows: [body] }) => {
                expect(body.cost_at_auction).toBe(50.00);
            });
        });
    });
    test('should get 400 error for invalid input', () => {
        return request(app)
        .patch('/api/treasures/sad_path')
        .expect(400)
        .then(({ body }) => {
            expect(body).toEqual({ msg : 'Bad Request' });
        });
    });
});

describe('DELETE /api/treasures/:treasure_id', () => {
    test('should return 204 status code for successful delete', () => {
        return request(app)
        .delete('/api/treasures/1')
        .expect(204)
    });
    test('should remove the treasure from the database', () => {
        return removeTreasure({treasure_id: 1})
        .then(() => {
            return db.query(
                `SELECT * FROM treasures
                WHERE treasure_id = 1;`
                )
        })
        .then(({ rowCount }) => {
            expect(rowCount).toBe(0);
        });
    });
});

describe('GET /api/shops', () => {
    test('should return all shops with properties', () => {
        return request(app)
        .get('/api/shops')
        .expect(200)
        .then(({ body }) => {
            body.forEach(shop => {
                expect(shop.hasOwnProperty("shop_id")).toBe(true);
                expect(shop.hasOwnProperty("shop_name")).toBe(true);
                expect(shop.hasOwnProperty("slogan")).toBe(true);
            });
        });
    });
    test('should return a stock_value property', () => {
        return request(app)
        .get('/api/shops')
        .expect(200)
        .then(({ body }) => {
            body.forEach(shop => {
                expect(shop.hasOwnProperty("stock_value")).toBe(true);
            });
            expect(body[0].stock_value).toBe(2421.98);
        });
    });
});

describe('GET /api/treasures/?max_age=... (or min_age) --> more queries', () => {
    test('GET /api/treasures/?max_age=... filters results by cutoff max age', () => {
        return request(app)
        .get('/api/treasures/?sortOn=age&max_age=20')
        .expect(200)
        .then(({ body }) => {
            expect(body[0].age).toBe(1);
            expect(body[body.length-1].age).toBe(13);
        });
    });
    test('GET /api/treasures/?min_age=... filters results by cutoff min age', () => {
        return request(app)
        .get('/api/treasures/?sortOn=age&min_age=20')
        .expect(200)
        .then(({ body }) => {
            expect(body[0].age).toBe(54);
            expect(body[body.length-1].age).toBe(10865);
        });
    });
    test('GET /api/treasures/?min_age=...&max_age=... filteres results between min and max age', () => {
        return request(app)
        .get('/api/treasures/?sortOn=age&min_age=50&max_age=100')
        .expect(200)
        .then(({ body }) => {
            expect(body[0].age).toBe(54);
            expect(body[body.length-1].age).toBe(90);
        });
    });
});
