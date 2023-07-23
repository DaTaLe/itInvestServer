async function getSecurity(limit, offset){
    const result = await this.query('SELECT * FROM security LIMIT $1 OFFSET $2', [limit, offset]);
    return result.rows;
}

module.exports = getSecurity;