/**
 * Created by May on 10/05/2017.
 */

'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var sqlDB = require('./DataBase.js');
var Bot = require('slackbots');
var settings = {
    token: 'xoxb-179658476039-s1rijIoTO7KIKHmNa2uTuTkx',
    name: 'cookit'};

// create a DB
var db = new sqlDB();

// constructor
var CookItBot = function Constructor()
{
    this.settings = settings;
    this.settings.name = this.settings.name || 'cookit';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'Databases', 'CookIt.db');

    db.executeQuery('select * from tbl_FoodGroups');
    this.user = null;

}

// inherits methods and properties from the Bot constructor
util.inherits(CookItBot, Bot);

// connect to the Slack servers
CookItBot.prototype.run = function () {
    CookItBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

CookItBot.prototype._onStart = function () {
    this._loadBotUser();
    //this._connectDb();
    //this._firstRunCheck();
};

// Load all the metadata related to the user representing the bot itself on the current Slack organization
CookItBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

// Get user name by user id
CookItBot.prototype._getUserById = function (userid) {
    var username = this.users.filter(function (user) {
        if (user.id == userid)
        {
            return true;
        }
        else
        {
            return false;
        }
    })[0];

    return username.name;
};

// Connect to the MsSql database
CookItBot.prototype._connectDb = function () {
    if (!fs.existsSync(this.dbPath)) {
        console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
        process.exit(1);
    }

    this.db = new MsSql.Database(this.dbPath);
};

// Check if it's the first time the bot is executed and if so send a greeting messages to alle the users
CookItBot.prototype._firstRunCheck = function () {
    var self = this;
    self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
        if (err) {
            return console.error('DATABASE ERROR:', err);
        }

        var currentTime = (new Date()).toJSON();

        // this is a first run
        if (!record) {
            self._welcomeMessage();
            return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
        }

        // updates with new last running time
        self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
    });
};

// welcome message
CookItBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, 'Hi guys, anybody hungry?' +
        '\n I can suggest on some recipes for you. Just say `Chuck Norris` or `' + this.name + '` to invoke me!',
        {as_user: true});
};

CookItBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message)  &&
        //this._isChannelConversation(message) &&
        !this._isFromCookItBot(message) /* &&
        this._isMentioningChuckNorris(message) */
    ) {
        if (this._isChannelConversation(message)) {
            var channel = this._getChannelById(message.channel);
            this.postMessageToChannel(channel.name, 'Hi guys, anybody hungry?' +
                '\n I can suggest on some recipes for you. Just say `Chuck Norris` or `' + this.name + '` to invoke me!',
                {as_user: true});
        }
        else if (this._isDirectConversation(message))
        {
            var returnuser = this._getUserById(message.user);
            this.postMessageToUser(returnuser, 'reply to user', {as_user: true});
        }
    }
};

CookItBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

CookItBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

CookItBot.prototype._isDirectConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'D';
};

// see if the message comes from a user who is not the CookitBot itself.
    CookItBot.prototype._isFromCookItBot = function (message) {
    return message.user === this.user.id;
};

// checks the message
CookItBot.prototype._isMentioningChuckNorris = function (message) {
    return message.text.toLowerCase().indexOf('chuck norris') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

CookItBot.prototype._reply = function (originalMessage) {
    var self = this;
};

// retrieve the name of the channel given its ID
CookItBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

/*
//  Extracts ..... from the database and posts it in the channel where the original message was written
NorrisBot.prototype._replyWithRandomJoke = function (originalMessage) {
    var self = this;
    self.db.get('SELECT id, joke FROM jokes ORDER BY used ASC, RANDOM() LIMIT 1', function (err, record) {
        if (err) {
            return console.error('DATABASE ERROR:', err);
        }

        var channel = self._getChannelById(originalMessage.channel);
        self.postMessageToChannel(channel.name, record.joke, {as_user: true});
        self.db.run('UPDATE jokes SET used = used + 1 WHERE id = ?', record.id);
    });
};

 // retrieve the name of the channel given its ID
 NorrisBot.prototype._getChannelById = function (channelId) {
 return this.channels.filter(function (item) {
 return item.id === channelId;
 })[0];
 };
*/


// export our class to outside access
module.exports = CookItBot;
