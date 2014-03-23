/*
 * VoteTopic objects are not actually stored in MongoDB. Instead, they are
 * composed of Vote objects. A VoteTopic is a collection of Vote objects. Saving
 * a VoteTopic means saving a collection of Vote object to the DB, but VoteTopic
 * objects never exist in the DB. Getting a VoteTopic basically means getting a
 * collection of Vote objects from the DB. What's the term for this? It's kinda
 * like an adapter.
 */

var VoteTopic = {};

/*
 * Get all vote topics based on the Vote objects in the DB.
 * The callback accepts a single argument: an array of topics.
 */
VoteTopic.getAll = function(callback) {
    var Vote = require("../models/vote.js");

    Vote.find( {/* empty search criteria */}, function(err, votes) {
        if (err) return callback(err, null);

        var topics = {};

        console.log(" -- Votes from DB:");
        console.log(votes);

        votes.forEach(function(vote) { // synchronous forEach

            if (typeof topics[vote.name] == "undefined") {
                topics[vote.name] = {};
                topics[vote.name].name = vote.name;
                topics[vote.name].options = [];
            }
            topics[vote.name].options.push(vote.option);
        });

        // convert topics from object to array.
        var topicsArray;
        for (var i=0; i<Object.keys(topics); i++) {
            topicsArray.push(topics[Object.keys(topics)[i]]);
        }

        // there we go. Now we have the topics array to pass to the callback.

        callback(null, topicsArray);
    });
}

/*
 * Saves a vote topic to the DB in the form of multiple Vote objects.  The
 * `topic` parameter accepts an object that contains a property "name" and a
 * property "options". "name" is a string and "options" is an array of strings.
 * The callback receives a String argument if an error ocurrs while saving.
 */
VoteTopic.saveOne = function(topic, callback) {
    var Vote = require("./vote.js");
    var async = require("async");
    async.forEach(topic.options, function(option, callback) {
        var vote = new Vote({
            name: topic.name,
            option: option
        });
        vote.save(function(err) {
            if (err) return callback(err);
            callback(null);
        });
    }, function(err) {
        // all saves complete.
        if (err) return callback(err);
        console.log(" -- Vote topic '"+topic.name+"' saved to DB in the form of multiple Vote objects.");
        callback(null);
    });
}

module.exports = VoteTopic;
