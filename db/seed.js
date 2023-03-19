const db = require("./connection");
const format = require('pg-format')
const createRef = require('../utility/createRef.js');

const seed = ({ shopData, treasureData }) => {
	return db.query(`DROP TABLE IF EXISTS treasures;`)
	.then(() => {
		return db.query('DROP TABLE IF EXISTS shops;')
	})
	.then(() => {
		return db.query(`
		CREATE TABLE shops
		(
			shop_id SERIAL PRIMARY KEY,
			shop_name VARCHAR(50) NOT NULL,
			owner VARCHAR(30) NOT NULL,
			slogan TEXT
		)
		;`);
	})
	.then(() => {
		return db.query(`
		CREATE TABLE treasures
		(
			treasure_id SERIAL PRIMARY KEY,
			treasure_name VARCHAR(50) NOT NULL,
			colour VARCHAR(30) NOT NULL,
			age INT NOT NULL,
			cost_at_auction REAL NOT NULL,
			shop_id INT REFERENCES shops(shop_id)
		)
		;`);
	})
	.then(() => {
		return db.query(format(`
		INSERT INTO shops (shop_name, owner, slogan)
		VALUES %L 
		RETURNING *;`, shopData.map(({ shop_name, owner, slogan }) => {
			return [[shop_name], [[owner]], [slogan]];
		})));	
	})
	.then(({ rows }) => {
		let shopRef = createRef(rows);
		let newTreasure = treasureData.map(({ treasure_name, colour, age, cost_at_auction, shop }) => {
			shop = shopRef[shop];
			return [treasure_name, colour, age, cost_at_auction, shop];
		})
		let formTreasure = format("INSERT INTO treasures (treasure_name, colour, age, cost_at_auction, shop_id) VALUES %L", newTreasure);

		return db.query(formTreasure);
	})
	.catch((err) => {
		console.log(err);
	})
};

module.exports = seed;
