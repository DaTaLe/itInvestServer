async function getSecurityCount() {
    const result = await this.query(`SELECT count(*) AS exactCount FROM public.security;`);
    return result.rows[0].exactCount;
}

module.exports = getSecurityCount;