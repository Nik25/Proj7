
const express = require('express');
const Twit = require('twit');
const config = require('./config');  

const app = express();

//static server is set up
app.use('/static',express.static(__dirname + '/public'));

// Pug is set as template engine
app.set('view engine', 'pug');

//Path to template is set
app.set('views', __dirname + '/views');

//Twit is setup with specific user details from config.js file
const T = new Twit(config);

//Get credentials for user
T.get('account/verify_credentials', {skip_status: true}, function(err, data, req) {
    const twitterHandle = data.screen_name;
    const realName = data.name;
    const profileImage = data.profile_image_url;
    const following = data.friends_count;
     
     //Gets a list of 5 friends 
        T.get('friends/list', {screen_name: ' ', count: 5}, function(err, friends, req){
            const getFriends = [];
            for(let i = 0; i < friends.users.length; i++) {
                getFriends.push(friends.users[i]);
            }
 

             //Gets a list of 5 most recent  sent messages
            T.get('direct_messages/sent', {screen_name: ' ', count: 5}, function(err, messages, req){
                const getMessages = [];
                for(let i = 0; i < messages.length; i++) {
                    getMessages.push(messages[i]);
                }

    //Gets a list of 5 most recent tweets
    T.get('statuses/user_timeline', {screen_name: ' ', count: 5}, function(err, tweets, req) {
        const getTweets = [];//array to hold tweet data
        for (let i = 0; i < tweets.length; i++) {
            getTweets.push(tweets[i]);
        }

                //This renders template with variables
                app.get('/', function(req, res) {
                    res.render('index', {twitterHandle, profileImage, realName, following, getTweets, getFriends, getMessages});
                });
            });
        });
    });
});

// server set up
app.listen(3000, () => {
    console.log("The app is running on port 3000");
});