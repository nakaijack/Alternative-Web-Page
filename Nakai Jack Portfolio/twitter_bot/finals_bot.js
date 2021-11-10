var debug = false; // if we don't want it to post to Twitter! Useful for debugging!

var Twit = require('twit');
var T = new Twit(require('./config.js'));
var fs = require('fs');

// This is the URL of a search for the latest/popular tweets on the '#finalsweek' or '#finalexams' hashtag; used by retweetLatest()
var params = {
q: "#finalsweek OR #finalexams OR #exams OR #university OR #tests OR #college OR #universitylife", 
count: 10, 
result_type: "recent",
lang: 'en'
}
// function that forms phrase to tweet out
function sentence() {
    var verb = ['studied for',
                'prepared for',
                'can do', 'know',
                'got', 'will make',
                'will conquer',
                'will ace'];
    var present = ['S T U D Y',
                   'F O C U S',
                   'D O  Y O U R  B E S T',
                   'T R Y  Y O U R  H A R D E S T',
                   'P A C E  Y O U R S E L F',
                   'B R E A T H E',
                   'R E L A X',
                   'C O N C E N T R A T E'];
    var more = ['you\'re almost there 💪',
                'keep going 🙌',
                'drink water🥤🥤',
                'snack break! 🥪',
                '🧘‍♀️🧘🧘‍♂️ meditate, omm!'];
    var rand = Math.floor(Math.random() * 10); // randomly picks from arrays
    var rand1 = Math.floor(Math.random() * verb.length);
    var rand2 = Math.floor(Math.random() * present.length);
    var rand3 = Math.floor(Math.random() * more.length);
    var form = "";
    if (rand1 % 2 === 0) { // If value of rand1 is even, this group runs
        if (rand % 2 === 0) {
        form = "you " + verb[rand1] + " this!" // concantenates words together
        } else {
        form = "K E E P  C A L M  A N D  " + present[rand2];
        }
    } else { // If rand1 is odd, this group runs
        if (rand3 % 2 == 0) {
            form = more[rand3];
        } else {
            form = present[rand2];
        }
    }
    try {
        //If there's an error, print here
        if (error) {
            console.log("Error: " + error);
        }
        //If error caught, print here
    } catch (error) {
        console.log("Caught an error, try again: " + error); 
    } finally {
        retweetLatest(); // will run even if there's error
    }
    tweetStatus(form); // tweets out phrase that was formed
    return form;
}

//function that tweets a status
function tweetStatus(message) {
    var tweet = {
        status: message
    }
    //posts a status update 
    T.post('statuses/update', tweet, tweeted);
    function tweeted(err, data, response) {
        // If there's an error, print here
        if (err) {
            console.log('Something went wrong: ' + err);
        } else {
            console.log('Success! Tweeted out a status update!');
        }
    }
}
//function that retweets tweet using params variable
function retweetLatest() {
	T.get('search/tweets', params, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, { }, function(error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with retweeting, print here
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // If search has error, print here
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
        try {
        if (error) {
            console.log("error: " + error);
        }
    } catch (error) {
        console.log("try again: " + error); 
    } finally {
        favoriteTweets();
    }
	});
}
var args = {
    q: "#finalsweek OR #collegefinals OR #finalexams OR #collegelife OR #exams OR #studentlife OR #universitylife",
    count: 5,
    result_type: "recent",
    lang: "en"
};
//function that likes tweets
function favoriteTweets() {
    T.get('search/tweets', args, function(error, data, response) {
    if(!error){
        // Loop through the returned tweets
        for(let i = 0; i < data.statuses.length; i++){
            // Get the tweet Id from the returned data
            let id = { id: data.statuses[i].id_str }
            // Try to Favorite the selected Tweet
            T.post('favorites/create', id, function(error, response){
                // If the favorite fails, log the error message
                if (error){
                    console.log(error[0]);
                }
                // If the favorite is successful, log the url of the tweet
                else {
                    let username = response.user.screen_name;
                    let tweetId = response.id_str;
                    console.log('Success, favorited: ', `https://twitter.com/${username}/status/${tweetId}`)
                }
            });
        }
    } else {
        console.log('There was an error: ' + err);
    }
    })
}       
//reply
//function tweetEvent() {  
//    var reply = ['please take care of yourself',
//                'rest is good for the brain',
//                'have a good meal',
//                'remove any distractions and study',
//                'study the right way, not the easy way',
//                'the rainbow comes after the rain',
//                'be prepared and come prepared',
//                'index cards are lifesavers',
//                'go through that big ol\' textbook',
//                'there are people who can help you study or understand, just reach out'];
//    function reply(tweet) {
//        T.get('search/tweets', params, function (error, data) {
//        var name = tweet.user.screen_name;
//        var nameID = tweet.id_str;
//        var replyToMention = reply[Math.floor(Math.random()*reply.length)];
//        replyToMention = "@" + name + " " + replyToMention;
//        T.post('statuses/update', {status: replyToMention, in_reply_to_status_id: id}, function(error, response) {
//            if (error) {
//                console.log("error with replying" + error);
//            } else {
//                console.log("Success in replying");
//            }
//        });
//    }
//)}
//}

var onceADay = 1000 * 60 * 60 * 24; //happens automatically once a day
var twiceADay = 1000 * 60 * 60 * 12;
//var fiveADay = 1000 * 60 * 60 * 5;
sentence();
setInterval(sentence, onceADay);
favoriteTweets();
setInterval(favoriteTweets, twiceADay);
//tweetEvent(); // not working               
//setInterval(tweetEvent, fiveADay);