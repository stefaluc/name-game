# name-game
The name-game project provides an API as well as a very simplistic client implementation for a name guessing game. This API and client implementation are a proof-of-concept and would need to greatly be expanded on if there was a desire to deliver a full fledged applcation. (NOTE: the client is more of a means of testing that the API is functioning. Please ignore the horrid ui design and code)
## API
The following are the implemented API endpoints for this project. Please take note that this API isn't 100% exhaustive due to the time constraint (e.g. missing DELETE and PUT endpoints that weren't directly needed for the game, minor pluses like expressive error messages, etc.)
#### Users
`GET /users`

`GET /users/:id`

`POST /users/:id`

`GET /users/:id/games` 

`POST /users/:id/games` (query params: ?guess=(firstName+lastName))

`GET /users/:id/stats`

#### Stats
`GET /stats` (query params: ?type=(accuracy|speed|amount)&sort=(ascending|descending)&limit=(int)

`GET /stats/:id`

#### Games
`GET /games`

`GET /games/:id`

#### Profiles
`GET /profiles`

`GET /profiles/:id`

`POST /profiles`

## On the one-to-one relationships
The endpoints `/users`, `/stats`, and `/games` are all related. With the current implementation of this name-game, the the endpoints `/stats` and `/games` have a one-to-one relationship with `/users`. Minor aspects of this can be seen in certain aspects of the code. However, the endpoints are structured so that minimal effort would need to be taken to reorganize this relationship when it expands from one-to-one (e.g. adding more unique ids, changing single object to list of objects, etc.). This would need to be done in a case where, say, another game is implemented, and users can play and have stats for either one.

## Changing to a linking relationship
Currently, the relations between `/users`, `/stats`, and `/games` are all embedded in a user object. It would like be prudent to change this embedding to a linking relationship. This would greatly reduce the size of user GET payloads and limit unneeded date (especially when more games and stats are implemented). For example:

Current embedding:
```js
users: [
    {
        id: 1,
        name: Hunter McMillen,
        game: {
            profiles: [],
            gameStartTime: 0,
            answer: ''
        },
        stats: {
            correctGuesses: 0,
            wrongGuesses: 0,
            timeSpent: 0,
            avgFinishTime: 0,
        },
    },
]
```
Changed to linking relationship:
```js
users: [
    {
        id: 1,
        name: Hunter McMillen,
        relationship: {
            game: "http://localhost:8080/api/games/1",
            stats: "http://localhost:8080/api/stats/1",
        },
    },
]
```

## Handling Authentication/Authorization
At the current stage of this application, there is no authentication/authorization happening. All you need to know to access a user account is username/id. In order to protect our endpoints, a JWT based token authorization could be implemented.
1. Have user's create passwords as well as a username.
2. Create new endpoint `/users/login` which a client will POST to with their username and password 
3. If the server determines the username and password are valid, it will create a JWT with a secret and send it back to the client for it store locally
4. Now, everytime the client wants to access a route, it will send the JWT token on the authorization HTTP header
5. The server will first check the JWT token, and if valid, send the data back to the client

Additionally, account types could be associated with a user. For example, an admin based account could access more priviledged endpoints like DELETE, or anything with `/profiles`.

## Testing
Due to time constraints, minimal testing was performed for this API. In a sense, the case that a functioning client built using this API naively ensures some integrity. However, more stringent testing should be implemented. In the future, it would be prudent to implement unit tests for each API endpoint ensuring that the endpoint is returning the correct data on given requests.
