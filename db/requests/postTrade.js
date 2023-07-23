async function postTrade(price, size, side, client, security){
    const result = await this.query('INSERT INTO trade (price, size, side, client, security) VALUES ($1, $2, $3, $4, $5);', [price, size, side, client, security]);
    return result.rows[0];
}

module.exports = postTrade;