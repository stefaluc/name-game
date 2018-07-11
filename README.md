# name-game
The name-game project provides an API as well as a very simplistic client implementation for a name guessing game.
## API
The following are the implemented API endpoints for this project. Please take note that this API isn't 100% exhaustive due to the time constraint (e.g. missing DELETE and PUT endpoints that weren't directly needed for the game, minor things like expressive error messages, etc.)
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
The endpoints `/users`, `/stats`, and `/games` are all related. With the current implementation of this name-game, the the endpoints `/stats` and `games` have a one-to-one relationship with `/users`. Minor aspects of this can be seen in certain aspects of the code. However, the endpoints are structured so that minimal effort would need to be taken to reorganize this relationship when it expands from one-to-one (e.g. adding more unique ids, changing single object to list of objects, etc.). This would need to be done in a case where, say, another game is implemented, and users can play and have stats for either one.

## Changing to a linking relationship
Currently, the relations between `/users`, `/stats`, and `/games` are all embedded in a user object. It would like be prudent to change this embedding to a linking relationship. This would greatly reduce the size of user GET payloads and limit unneeded date (especially when more games and stats are implemented). For example:

Current embedding:
```json
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
```json
users: [
    {
        id: 1,
        name: Hunter McMillen,
        relationship: {
            game: "http://localhost:8080/api/games/1"
            stats: "http://localhost:8080/api/stats/1",
        },
    },
]
```

## Handling Authentication

## Testing
