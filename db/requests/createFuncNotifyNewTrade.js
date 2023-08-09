const notifyFuncSQL = `
CREATE OR REPLACE FUNCTION notify_new_trade()
  RETURNS trigger AS
$BODY$
    BEGIN
        PERFORM pg_notify('new_trade', row_to_json(NEW)::text);
        RETURN NULL;
    END; 
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;`

async function createFuncNotifyNewTrade() {
    return await this.query(notifyFuncSQL);
}

module.exports = createFuncNotifyNewTrade;