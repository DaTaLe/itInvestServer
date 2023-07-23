async function getSecurityById(id){
    const result = await this.query('SELECT * FROM security WHERE id = $1', [id]);
    return result.rows[0] || {};
}

module.exports = getSecurityById;