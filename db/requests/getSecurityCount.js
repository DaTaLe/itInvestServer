//TODO will be so slow on big table. Rewrite to approx count
async function getSecurityCount(){
    const result = await this.query(`SELECT count(*) AS exact_count FROM public.security;`);
    return result.rows[0].exact_count;
}

module.exports = getSecurityCount;