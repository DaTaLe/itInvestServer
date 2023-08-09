const notifyTriggerSQL = `
CREATE TRIGGER notify_new_trade
  AFTER INSERT
  ON "trade"
  FOR EACH ROW
  EXECUTE PROCEDURE notify_new_trade();`

async function createTriggerNotifyNewTrade() {
    try {
        return await this.query(notifyTriggerSQL);
    } catch (e) {
        console.log(e.message)
    }

}

module.exports = createTriggerNotifyNewTrade;