async function postSecurity(seccode, price, isin, lotsize){
    const result = await this.query('INSERT INTO security (seccode, price, isin, lotsize) VALUES ($1, $2, $3, $4) RETURNING id, seccode, price, isin, lotsize;', [seccode, price, isin, lotsize]);
    return result.rows[0];
}

module.exports = postSecurity;