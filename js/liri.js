//liri.js
//This program uses terminal/command line and node to execute commands
//The twitter npm is used to return tweets
//Spotify is used to return the 
//

//require twitter npm
var twitter = require('twitter');

//require spotify npm
var spotify = require('node-spotify-api');

//require request npm
var request = require('request');

//require file system
var fs = require('fs');

//taking in the keys into a variable called client
var keys = require('./key.js')

//get the twitter keys
var client = new twitter(keys.twitter);

//spotiyfy keys
var clientSpotify = new spotify(keys.spotify);

//take in the user inputs
var inputs = process.argv.splice(2);

//take the command that the user inputs
var command = inputs[0];


console.log(command);


//switch for the different commands
switch(command){
	//for using the twitter npm package
	case 'my-tweets':
		myTweets();
		break;
	//node-spotify-api
	case 'spotify-this-song':
		spotifyThisSong(inputs);
		break;
	//ombd request
	case 'movie-this':
		movieThis(inputs);
		break;
	case 'do-what-it-says':
		doWhatItSays();
		break;
}


//this is function that will get the last 20 tweets for a specified user name
function myTweets(){
	client.get('statuses/user_timeline', { screen_name: 'NamKiwon2016', count: 20 }, function(error, tweets, response) {
		if(error){
			console.log(error);
			return;
		}
		var counter = 0;
		//console.log the tweets
		tweets.map(function(tweet){
			counter ++;
			console.log('tweet ' + counter + ': ' + tweet.text);
		})
	});
}

function spotifyThisSong(inputs){
	//parse the input into song
	var songName = '';
	for(var i = 1; i < inputs.length;i++){
		console.log("For loop");
		songName = songName + ' ' + inputs[i];
	}

	//set song name to Ace of Base's 'The Sign'
	if(songName == ''){
		songName = 'The Sign';
	}
	
	console.log(songName)

	//search for the song
	clientSpotify.search({type:'track', query:songName}, function(error, data){
		if (error){
			console.log('Error occured: ' + error);
			return;
		}
		console.log('hi');
		//run a loop through the response returned
		for(var i = 0; i < data.tracks.items.length;i++){
			console.log(data.tracks.items[i]);
		}
	});	

}

function movieThis(inputs){

	var movieName = '';
	for(var i = 1; i < inputs.length;i++){
		console.log("For loop");
		movieName = movieName + ' ' + inputs[i];
	}

	//set movie name to Mr. Nobody
	if(movieName == ''){
		movieName = 'Mr. Nobody';
	}

	//creating the movie url
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";


	request(queryUrl, function(error, response, body) {

	  // If the request is successful (i.e. if the response status code is 200)
		if (!error && response.statusCode === 200) {

		    console.log(response);
		   
		    console.log("IMBD Rating: " + JSON.parse(body).imdbRating);
		}
	});


}

function doWhatItSays(){
	fs.readFile("../random.txt.txt", "utf8", function(error, data) {
    	//take in the file content and make an array by splitting via the comma
    	var fileContents = data.split(",");
    	var command = fileContents[0];

    	//do the spotify-command
    	if(command == "spotify-this-song"){
    		spotifyThisSong(fileContents[1]);
    	}
    });
}