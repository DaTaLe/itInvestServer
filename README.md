# itInvestServer

### .env file content

```dotenv
PORT=3000
PG_SECRET='Your Postgres pass'
DB_NAME='itInvest'
DB_NAME_INIT='postgres'
DELAY=1000
LIMIT=20
DB_CLEAR_STR='*/5 * * * *'
```

### Run

```shell
npm i
npm run start
```

### DB clear

To set up db clear by schedule fill env DB_CLEAR_STR with chron style string

