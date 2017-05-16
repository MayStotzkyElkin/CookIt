/**
 * Created by May on 10/05/2017.
 */

var Bot = require('./CookItBot.js');

// create a bot
var CookItBot = new Bot();

CookItBot.run();

/*
CookItBot.on('start', function() {
    CookItBot.postMessageToChannel('recipes', 'Hello channel!');
    CookItBot.postMessageToUser('some-username', 'hello bro!');
    CookItBot.postMessageToGroup('some-private-group', 'hello group chat!');
});
*/