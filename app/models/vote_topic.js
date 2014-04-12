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
        
        votes.forEach(function(vote) { // synchronous forEach

            if (typeof topics[vote.name] == "undefined") { //Creates an object with however many optinons (ex. name, options array, counts array)
                topics[vote.name] = {};
                topics[vote.name].name = vote.name;
                topics[vote.name].options = [];
                topics[vote.name].counts = []; // This creates an array of counts
                topics[vote.name].totalVotes = 0;
            }
            topics[vote.name].options.push(vote.option); // Push otions into the array of options for this specific topic
            topics[vote.name].counts.push(vote.votes_count);
            topics[vote.name].totalVotes += vote.votes_count;
        });

        // convert topics from object to array.
        var topicsArray = [];
        for (var i=0; i<Object.keys(topics).length; i++) {

            /*
             *Determine if it's multiple choice or not. indicate this in a "yesno" boolean property.
             */
            var yesno = false;
            if (topics[Object.keys(topics)[i]].options.length == 2) {
                if (topics[Object.keys(topics)[i]].options.indexOf("Yes") > -1 && topics[Object.keys(topics)[i]].options.indexOf("No") > -1) {
                    yesno = true;
                }
            }
            topics[Object.keys(topics)[i]].yesno = yesno;

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
    var counter = 0;
    async.forEach(topic.options, function(option, callback) {
        counter++;
        var vote = new Vote({
            name: topic.name,
            option: option
        });
        vote.save(function(err) {
            if (err) return callback(err);
            callback(null);
        });
    }, function(err) {
        if (err) return callback(err);
        // all saves complete.
        callback(null);
    });
}

module.exports = VoteTopic;
