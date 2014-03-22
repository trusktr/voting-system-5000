/*
 * VoteTopic objects are not actually stored in MongoDB. Instead, they are
 * composed of Vote objects. A VoteTopic is a collection of Vote objects. Saving
 * a VoteTopic means saving a collection of Vote object to the DB, but VoteTopic
 * objects never exist in the DB. Getting a VoteTopic basically means getting a
 * collection of Vote objects from the DB. What's the term for this? It's kinda
 * like an adapter.
 */

var VoteTopic = {};

VoteTopic.getVoteTopics = function(callback /* (topics)*/ ) {
    var Vote = require("../models/vote.js");

    Vote.find( {/* empty search criteria */}, function(err, votes) {
        var topics = {};

        votes.forEach(function(vote) {

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

        callback(topicsArray);
    });
}

VoteTopic.saveVoteTopics = function() {
}

module.exports = VoteTopic;
