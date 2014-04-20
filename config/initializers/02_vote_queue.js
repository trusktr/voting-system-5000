/*
 * The VoteQueue is used to place increments/decrements of a Vote object's
 * votes_count property into a queue. This is needed because if many people vote
 * at once, we want to ensure that only one increment/decrement operation is
 * performed at any given time, never concurrently. The controller method for
 * the /votes page puts the operations into the VoteQueue. See pages#vote in
 * app/controllers/pages_controller.js.
 */

console.log('Begin VoteQueue initializer.');


var async = require("async");
var Vote = require("../../app/models/vote.js");

// TODO: Is there a better way than attaching this to global?
global.VoteQueue = async.queue(function(voteChange, callback) { // This function is a "worker". Basic idea: http://en.wikipedia.org/wiki/Thread_pool_pattern
    Vote.findOne({name: voteChange.name, option: voteChange.option}, function(err, vote) {
        if (err) return callback();
        if (!vote) return callback();
        // TODO: Better error handling here?

        vote.votes_count += voteChange.giveOrTake;
        vote.save(function(err) {
            if (err) return callback();
            // TODO: Better error handling here?

            console.log(" -- Updated a vote count while avoiding a race condition. :)");
            callback();
        });
    });
}, 1); // Allow only 1 worker at a time.

global.VoteQueue.drain = function() {
    console.log(" -- VoteQueue is empty.");
};

console.log('End VoteQueue initializer.');

