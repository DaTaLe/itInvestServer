# itInvestServer
Postgres is needed to be running on localhost:5432.
Database, tables will be created automatically
### .env file content
.env file needed with something like this to fill
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

### Some routes
```
GET /security - get some securities with pagination 
GET /security/:id - get security with id
GET /trades - subscription on trades updates
POST /security - add security row to db
POST /trade - add trade row to db
```

