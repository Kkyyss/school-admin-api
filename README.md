# Shool-admin-api

## Hosted APIs (Heroku)
**Base URL:** [https://dev-school-admin-api.herokuapp.com/api/v1.0](https://dev-school-admin-api.herokuapp.com/)


| APIs   | Mehtods |
|---------|------------|
|[/register](https://dev-school-admin-api.herokuapp.com/api/v1.0/register) | POST |
| [/commonstudents](https://dev-school-admin-api.herokuapp.com/api/v1.0/commonstudents) | GET |
|[/suspend](https://dev-school-admin-api.herokuapp.com/api/v1.0/suspend)| POST |
| [/suspend](https://dev-school-admin-api.herokuapp.com/api/v1.0/retrievefornotification) | POST |

## Local Setup
**Base URL:** [http://localhost:5000/api/v1.0](https://dev-school-admin-api.herokuapp.com/)
1. use ssh `git clone git@github.com:Kkyyss/school-admin-api.git` or
use https `git clone https://github.com/Kkyyss/school-admin-api.git`
2. `npm install`
3. `npm start` (development mode by default)

## Test (Mocha)
**Run all test cases:**
1. `make test-dev` ---- hosted APIs
2. `make test-local` ---- local APIs

**Run test through specific file:**
1. `make path=./tests/{filename.test.js} test-dev-file` ---- hosted APIs
2. `make path=./tests/{filename.test.js} test-local-file` ---- local APIs

## Others
* `make database-reset` ---- database migration
