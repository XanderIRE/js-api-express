const db = require('../db/connection.js');

const fetchTreasure = (sortOn = 'age', order = 'ASC', colour = null , max_age, min_age) => {
    
    // Test age query to get max & min age if exists and stop SQL Injection vulnerability
    const ageTest = /^\d+$/
    let filterByMaxAge = `> 0`;
    if (ageTest.test(max_age)) filterByMaxAge = `< ${max_age}`;
    let filterByMinAge = `> 0`;
    if (ageTest.test(min_age)) filterByMinAge = `> ${min_age}`;

    // Conditional to check query is valid and prevent SQL Injection vulnerability
    if (sortOn === 'age' || sortOn === 'treasure_name' || sortOn === 'cost_at_auction' && order === 'ASC' || order === 'DESC') {
        return db.query(
        `SELECT t.treasure_id, t.treasure_name, t.colour, MAX(t.age) AS age, t.cost_at_auction, s.shop_name
        FROM treasures AS t
        INNER JOIN shops AS s 
        USING (shop_id)
        GROUP BY t.treasure_id, t.treasure_name, t.colour, t.cost_at_auction, s.shop_name
        HAVING MAX(t.age)${filterByMaxAge} AND MAX(t.age)${filterByMinAge}
        ORDER BY ${sortOn} ${order}; `)
        .then(({ rows }) => {
            if (!colour) {
                return rows;
            } else if (colour) {
                let filtered = rows.filter(result => result.colour === colour);
                return filtered;
            }   
        })
    } else {
        return Promise.reject({status:400, msg: 'Bad Request'});
    }
}


module.exports = { fetchTreasure };
