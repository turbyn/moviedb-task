# MovieDB example project

### Project information

As for the tech stack I decided to go with MongoDB (by using mongoose) due to ease in processing results later on (especially when it comes to filtering results based on query in POST /movies), Express for routing and Heroku for deployment, because I did a couple of projects using those.

# Setting up

To run app, you will require your mongo url as well as apikey (available [here](http://www.omdbapi.com/))

### **DEVELOPMENT**
Git clone repo and run
```
$ npm install
$ npm run dev
```
A **config.dev.js** file (if not present already present in your /src/config directory) will be created.
Enter necessary information in following manner:
```
module.exports = {
  "mongoURI":<mongoURI | String>,
  "apikey":<apikey from omdbapi | String>
}
```
Once that is done, run app again by entering
```
$ npm run dev
```

### **PRODUCTION**
```
$ npm run start
```
App will require **/src/config/config.prod.js**, where:
+ *mongoURI* is set to **process.env.herokuIMDBApikey**
+ *apikey* is set to **process.env.herokuIMDBApikey**

### **TESTING**
Testing is treated as dev environment, so you will need /src/config/config.dev.js file created and filled in.

To run tests:
```
$ npm run test
```

# Usage

### GET /movies

##### Example response
```
{
    "result": [
        {
            "_id": "5bb62d428a7c7e001564d4de",
            "data": {<DATA FROM IMDB API, check POST /movies documentation for format>}
            "timestamp": 1538665794730,
            "queryTitle": "monty python",
            "__v": 0
        },
        {
            "_id": "5bb655dbbfed4f0015e654bb",
            "data": {<DATA FROM IMDB API, check POST /movies documentation for format>}
            "timestamp": 1538676187620,
            "queryTitle": "pulp fiction",
            "__v": 0
        },
        {...}
      ]
}
```

##### Additional Information and how to use

Available queries:


| Available query |                      What does it do                     | Input specifications         | Default value |
|-----------------|:--------------------------------------------------------:|------------------------------|---------------|
| r_day-min       | Returns movies that were released after or on this date  | Integer (Unix timestamp)     | -1893456000   |
| r_day-max       | Returns movies that were released before or on this date |                              | 2145744000    |
| runtime-min     | Returns movies that are longer than input                | Integer (Runtime in minutes) | 0             |
| runtime-max     | Returns movies that are shorter than input               |                              | 60000         |
| imdb-min        | Movies rated better or same as this value                | Float (Imdb rate)            | 0.0           |
| imdb-max        | Movies rated worse or same as this value                 |                              | 10.0          |

*Example:*
```
/movies?r_day-min=-94694400&r_day-max=94694400&imdb-min=6.8&imdb-max=9.2&runtime-max=174
```
Movies released between 1967 and 1973, with minimum imdb rate of 6.8, but not bigger than 9.2. Also, has to be max 174 minutes long

### GET /comments

##### Example response
```
{
    "result": [
        {...},
        {
            "_id": "5bb663261754fa00155ed966",
            "content": "test comment",
            "imdbID": "tt0071853",
            "timestamp": 1538679590992,
            "__v": 0
        },
        {...}
    ]
}
```
##### Additional Information and how to use

Can be used to filter comments associated with proper movie by providing *imdbID* property in query string:
**Example**
```
/comments?id=tt0848228
```
If movie of provided id is not in db, app will return status *200* and empty *result* array.


### POST /movies

##### Request body
```
{
	"title": <movie title | String>
}
```
##### Example response
```
{
    "_id": "5bb657bd6614951ca4c550db",
    "data": {
        "Title": "The Avengers",
        "Year": "2012",
        "Rated": "PG-13",
        "Released": "04 May 2012",
        "Runtime": "143 min",
        "Genre": "Action, Adventure, Sci-Fi",
        "Director": "Joss Whedon",
        "Writer": "Joss Whedon (screenplay), Zak Penn (story), Joss Whedon (story)",
        "Actors": "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth",
        "Plot": "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
        "Language": "English, Russian, Hindi",
        "Country": "USA",
        "Awards": "Nominated for 1 Oscar. Another 38 wins & 79 nominations.",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
        "Ratings": [
            {
                "Source": "Internet Movie Database",
                "Value": "8.1/10"
            },
            {
                "Source": "Rotten Tomatoes",
                "Value": "92%"
            },
            {
                "Source": "Metacritic",
                "Value": "69/100"
            }
        ],
        "Metascore": "69",
        "imdbRating": "8.1",
        "imdbVotes": "1,122,811",
        "imdbID": "tt0848228",
        "Type": "movie",
        "DVD": "25 Sep 2012",
        "BoxOffice": "$623,279,547",
        "Production": "Walt Disney Pictures",
        "Website": "http://marvel.com/avengers_movie",
        "Response": "True"
    },
    "timestamp": 1538676669238,
    "queryTitle": "avengers",
    "__v": 0
}
```
##### Additional Information and how to use

In case movie is not found in API, will return status *503* and
```
"Movie not found!"
```

If title was not specified in request or was empty, app will return *400* and
```
Title not specified
```

**If the file is already present in DB (was posted to /movies before), it will return response object as usual, but not duplicate document in DB.**

### POST /comments

##### Request body
```
{
	"content" : <comment | String>
	"movieId" : <imdb ID | String>
}
```
##### Example response
```
{
    "_id": "5bb663261754fa00155ed966",
    "content": "test comment",
    "imdbID": "tt0071853",
    "timestamp": 1538679590992,
    "__v": 0
}
```
##### Additional Information and how to use

In case of provided ID not being found in db will return status *400* and
```
"Movie not found in db"
```
