//Dotenv
require("dotenv").config();
//Node-Spotify-Api
var Spotify = require("node-spotify-api");
//API Keys
var keys    = require("./keys");
//Axios
var axios   = require("axios");
//Moment
var moment  = require("moment");
//FS
var fs      = require("fs");
//Spotify Key
var spotify = new Spotify(keys.spotify);


//Start of executing "node liri.js concert-this <artist/band name here>"
var searchConcert = function(artist) {
    //Search the Bands in Town Artist Events API
    var queryURL = "https://rest.bandsintown.com/artists/" 
                    + artist 
                    + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function(res) {
            var jsonData = res.data;

            //No concerts for searched artist
            if (!jsonData.length) {
                console.log("No concerts showing for " + artist + ". Try searching for another artist");
                return;
            }
            //Concerts for searched artist
            console.log("Concerts showing for " + artist + "are:");
            //Looping though jsonData
            for (var i=0; i < jsonData.length; i++) {
                var show = jsonData[i];
                //Event Information (Name of the venue, venue location, and date of the event)
                console.log(
                    "RESULT #" 
                    + i
                )
                console.log(
                    "VENUE NAME: " 
                    + show.venue.name
                    ) 
                console.log(    
                    "VENUE LOCATION: "
                    + show.venue.city
                    + ", " 
                    + show.venue.country
                    )
                console.log(
                    "DATE OF EVENT: "
                    + moment(show.datetime).format("MM/DD/YYYY")
                    )
                console.log(
                    "___________________________________"                    
                );
            }
        }
    );    
};
//End of executing "node liri.js concert-this <artist/band name here>"

//Start of executing node liri.js spotify-this-song '<song name here>'
var searchSong = function(songName) {
    //Grabbing Artists
    var searchArtistNames = function(artist) {
        return artist.name;
    }; 
    //If no song is provided then program will default to "The Sign" by Ace of Base
    if (songName === undefined) {
        songName = "The sign";
    }
    //Search track
    spotify.search(
        {
          type: "track",
          query: songName
        },
        //Error
        function (err, data){
            if (err) {
                console.log("Oops and error occered: " + err);
                return;
        }

    var songs = data.tracks.items;
    //Looping thoruhg results 
    for (var i = 0; i < songs.length; i++) {
        //Song information (Results, artist(s), song name, link to preview, and album)
        console.log("RESULT #" + i);
        console.log("ARTIST(S): " + songs[i].artists.map(searchArtistNames));
        console.log("SONG NAME: " + songs[i].name);
        console.log("LINK TO THE PREVIEW: " + songs[i].preview_url);
        console.log("FROM THE ALBUM: " + songs[i].album.name);
        console.log("___________________________________")

        }
    });
};
//End of executing node liri.js spotify-this-song '<song name here>'

//Start of executing node liri.js movie-this '<movie name here>'
var searchMovie = function(movieName) {
    if (movieName === undefined) {
        movieName = "Mr Nobody";
      }
    //Search movies from omdb API
    var url = "http://www.omdbapi.com/?t=" 
                + movieName 
                + "&y=&plot=full&tomatoes=true&apikey=trilogy";
    
    axios.get(url).then(
        function(response) {
        var jsonData = response.data;
        //Movie information (Title, Year, imdb and rotten tomatoes rating, country, language, plot, and actors)
        console.log("TITLE: " + jsonData.Title);
        console.log("YEAR OF RELEASE: " + jsonData.Year);
        console.log("IMDB RATING: " + jsonData.imdbRating);
        console.log("ROTTEN TOMATOES RATING: " + jsonData.Ratings[1].Value); 
        console.log("COUNTRY: " + jsonData.Country);
        console.log("LANGUAGE: " + jsonData.Language);
        console.log("PLOT: " + jsonData.Plot);
        console.log("ACTORS: " + jsonData.Actors);

        });
};
//End of executing node liri.js movie-this '<movie name here>'

//Start of executing node liri.js do-what-it-says
var doWhatItSays = function() {
    //reading the random.txt file
    fs.readfile("random.txt", utf8, function(err, data) {
        var dataArr = data.split(",");

        if (dataArr.length === 2) {
          pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
          pick(dataArr[0]);
        }
    });
};
//End of executing node liri.js do-what-it-says


//Start of give User Options To Choose From
var options = function (caseData, functionData) {
    switch(caseData){
        //concert-this
        case "concert-this":
            searchConcert(functionData);
            break;
        //spotify-this-song
        case "spotify-this-song":
            searchSong(functionData);
            break;
        //movie-this
        case "movie-this":
            searchMovie(functionData);
            break;
        //do-what0is-says
        case "do-what-it-says":
            doWhatItSays();
            break;
        //if nothing
        default:
            console.log("Invalid");
    }
};
//End of give User Options To Choose From


var runThis = function(argOne, argTwo) {
    options(argOne, argTwo);
  };

runThis(process.argv[2], process.argv.slice(3).join(" "));
